const path = require('path')
const { app, BrowserWindow, Menu, screen } = require('electron')
const express = require('express')
const session = require('express-session')
require("dotenv").config();

const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const milkersRoutes = require('./routes/milkersRoutes');
const cowOwnersRoutes = require('./routes/cowOwnersRoutes');
const milkEntryRoute = require('./routes/milkEntryRoutes');
const feedRoutes = require('./routes/feedRoutes');
const milkCompanyRoutes = require('./routes/milkCompanyRoutes');

// Set up Express app
const expressApp = express()
expressApp.set('view engine', 'ejs')
expressApp.set('views', path.join(__dirname, 'renderer'))

expressApp.use(express.static(path.join(__dirname, 'assets')))

expressApp.use(express.json());
expressApp.use(express.urlencoded({
    extended: true
}));

expressApp.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// APP ROUTES
expressApp.use('/auth', authRoutes);
expressApp.use(milkersRoutes)
expressApp.use(cowOwnersRoutes)
expressApp.use(milkEntryRoute)
expressApp.use(feedRoutes)
expressApp.use(milkCompanyRoutes)

expressApp.get('/', (req, res) => {
    res.render('index')
})

expressApp.get('/dashboard', authMiddleware, (req, res) => {
    res.render('dashboard')
})

expressApp.get('/add-loan', authMiddleware, (req, res) => {
    res.render('add-loan')
})

const server = expressApp.listen(process.env.PORT, () => {
    console.log(`Express server is running on http://localhost:${process.env.PORT}`)
})

// Set up Electron app
const isDev = process.env.NODE_ENV !== 'production'

const createMainWindow = () => {

    mainWin = new BrowserWindow({
        title: 'Milk Distributors Society',
        width: 1366,
        height: 768,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    mainWin.maximize();

    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)

    // open dev tool
    // if(isDev){
    //     mainWin.webContents.openDevTools()
    // }

    mainWin.loadURL(`http://localhost:${process.env.PORT}`)
}

app.on('ready', () => {
    createMainWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    })
})

// menu template
const menu = [
    {
        // role: 'fileMenu'
        label: "File",
        submenu: [
            {
                label: "Quit",
                click: () => app.quit(),
                // accelerator: "Ctrl+W"
            }
        ]

    },
    {
        label: "Dashboard",
        click: () => {
            if (mainWin) {
                mainWin.loadURL(`http://localhost:${process.env.PORT}/dashboard`);
            } else {
                console.error("Main window is not defined");
            }
        }
    },
    {
        label: 'Developer Tool',
        accelerator: 'CmdOrCtrl+I',
        click: () => {
            mainWin.webContents.toggleDevTools();
        },
    },
];

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        server.close(() => {
            console.log('Express server closed')
        })
        app.quit()
    }
})
