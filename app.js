const path = require('path')
const { app, BrowserWindow, Menu, screen } = require('electron')
const express = require('express')

// Set up Express app
const expressApp = express()
expressApp.set('view engine', 'ejs')
expressApp.set('views', path.join(__dirname, 'renderer'))

expressApp.use(express.static(path.join(__dirname, 'assets')))

// APP ROUTES
expressApp.get('/', (req, res) => {
    res.render('index')
})

expressApp.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

expressApp.get('/cow-owners', (req, res) => {
    res.render('cow-owners')
})

expressApp.get('/cow-owners-one', (req, res) => {
    res.render('cow-owners-one')
})

expressApp.get('/cowowner-add', (req, res) => {
    res.render('cowowner-add')
})

expressApp.get('/add-loan', (req, res) => {
    res.render('add-loan')
})

expressApp.get('/milk-entry-one', (req, res) => {
    res.render('milk-entry-one')
})

expressApp.get('/milk-entry-all', (req, res) => {
    res.render('milk-entry-all')
})

expressApp.get('/milkers', (req, res) => {
    res.render('milkers')
})
expressApp.get('/milkers-one', (req, res) => {
    res.render('milkers-one')
})

expressApp.get('/milker-add', (req, res) => {
    res.render('milker-add')
})

expressApp.get('/feeds', (req, res) => {
    res.render('feeds')
})

expressApp.get('/feed-add', (req, res) => {
    res.render('feed-add')
})

expressApp.get('/feed-edit', (req, res) => {
    res.render('feed-edit')
})

expressApp.get('/feed-sales', (req, res) => {
    res.render('feed-sales')
})

expressApp.get('/feed-purchase', (req, res) => {
    res.render('feed-purchase')
})

expressApp.get('/milk-company', (req, res) => {
    res.render('milk-company')
})

expressApp.get('/milkcompany-add', (req, res) => {
    res.render('milkcompany-add')
})

expressApp.get('/milk-sales', (req, res) => {
    res.render('milk-sales')
})



const server = expressApp.listen(3000, () => {
    console.log('Express server is running on http://localhost:3000')
})

// Set up Electron app
const isDev = process.env.NODE_ENV !== 'production'

const createMainWindow = () => {

    mainWin = new BrowserWindow({
        title: 'Milk Distributors Society',
        width: 1366, // Set initial width
        height: 768, // Set initial height
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

    mainWin.loadURL('http://localhost:3000')
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
                mainWin.loadURL('http://localhost:3000/dashboard'); // Use loadURL for routing
            } else {
                console.error("Main window is not defined");
            }
        }
    }
];

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        server.close(() => {
            console.log('Express server closed')
        })
        app.quit()
    }
})
