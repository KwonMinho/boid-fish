var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow, TouchBar = _a.TouchBar;
function createWindow() {
    var win = new BrowserWindow({
        width: 1366,
        height: 768,
        nodeIntegration: true,
    });
    win.loadFile("../src/aquarium.html");
}
app.whenReady().then(function () {
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
//# sourceMappingURL=index.js.map