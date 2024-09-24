const path = require('path')
const { app, BrowserWindow, Menu } = require('electron')
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

expressApp.get('/milk-entry-one', (req, res) => {
    res.render('milk-entry-one')
})

expressApp.get('/milk-entry-all', (req, res) => {
    res.render('milk-entry-all')
})

expressApp.get('/milkers', (req, res) => {
    res.render('milkers')
})

expressApp.get('/add-cowowner', (req, res) => {
    res.render('add-cowowner')
})
expressApp.get('/add-milker', (req, res) => {
    res.render('add-milker')
})

const server = expressApp.listen(3000, () => {
    console.log('Express server is running on http://localhost:3000')
})

// Set up Electron app
const isDev = process.env.NODE_ENV !== 'production'

const createMainWindow = () => {
    mainWin = new BrowserWindow({
        title: 'Milk Distributors Society',
        width: isDev ? 1000 : 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    })

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
    }
]

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        server.close(() => {
            console.log('Express server closed')
        })
        app.quit()
    }
})
