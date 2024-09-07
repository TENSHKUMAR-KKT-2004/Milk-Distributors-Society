const path = require('path')
const { app, BrowserWindow, Menu } = require('electron')

const isDev = process.env.NODE_ENV !== 'production'

const createMainWindow = () => {
    const mainWin = new BrowserWindow({
        title: 'Milk Distributors Society',
        width: isDev ? 1000 : 800,
        height: 600
    })

    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)

    // open dev tool
    if(isDev){
        mainWin.webContents.openDevTools()
    }

    mainWin.loadFile(path.join(__dirname, './renderer/index.html'))
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
                click: ()=> app.quit(),
                // accelerator: "Ctrl+W"
            }
        ]
    }
]
