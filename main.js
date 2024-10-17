const { app, BrowserWindow, Menu, screen } = require('electron')
const server = require("./app.js");

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

    mainWin.loadURL(`http://localhost:52331`)
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
                mainWin.loadURL(`http://localhost:52331/dashboard`);
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
        // server.close(() => {
        //     console.log('Express server closed')
        // })
        app.quit()
    }
})
