const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

ELECTRON_ENABLE_LOGGING=1;

let win;

function createWindow(){
  win = new BrowserWindow({width: 1000, height: 600, icon: __dirname+'/img/icon.png', frame: false});
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
    resizable: false
  }));
  win.on('closed', () => {
    win = null;
  });
  win.webContents.openDevTools()
  win.setResizable(false);
}

app.on('ready', createWindow);

app.on('window-all-closed', () =>{
  if(process.platform !== 'darwin'){
    app.quit();
  }
});
