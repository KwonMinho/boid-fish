const {app, BrowserWindow, TouchBar} = require('electron');




function createWindow(){
  let win = new BrowserWindow({
    width: 500,
    height: 500
  });
  win.loadFile(`../public/aquarium.html`);
}


app.whenReady().then(()=>{
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})