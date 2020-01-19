const { app, BrowserWindow, ipcMain} = require('electron')
const electron = require('electron')
const fs = require('fs')
const path = require('path')
const url = require('url')
const sqlite3 = require('sqlite3')
const shell = electron.shell

let dbFile = path.join(app.getAppPath(), 'engine',  'datast.sqlite3')
var knex = require("knex")({
	client: "sqlite3",
	connection: {
		filename: dbFile//path.join(__dirname, 'engine/datast.sqlite3')
	}
});



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let perman

var today = new Date();
var date = String(String(today.getFullYear())+'-'+String(today.getMonth()+1)+'-'+String(today.getDate()));
let mysysdate =date;
console.log(mysysdate);

ipcMain.on("setmysysdate", function(evt, dates){
  console.log("Recevied Date"+ dates);
  mysysdate = dates;
  console.log(mysysdate);
  win.webContents.send("donedate");
});

ipcMain.on("getmydate", function(){
  console.log("Sending Date"+ mysysdate);
  win.webContents.send("sentdate", mysysdate);
});



ipcMain.on("PersonID",function(evt, pid){
        console.log("Recevied Person"+ pid);
        perman = pid;
        win.webContents.send("PersonnDone");
});

ipcMain.on("Loaded", function () {
  console.log("MAIN");
  console.log(perman);
  let result = knex("Person").where('PID',perman)
  result.then(function(rows){
    win.webContents.send("resultSent", rows);
  })
});

ipcMain.on('print-pdf', function () {
  console.log("Entered");
  const pdfPath = path.join(__dirname, '/print.pdf')
  const wine = BrowserWindow.fromWebContents(event.sender)
  wine.webContents.printToPDF({printBackground: true, landscape: true}, function (error, data) {
    if (error) throw error
    fs.writeFile(pdfPath, data, function (error) {
      if (error) {
        throw error
      }
      shell.openExternal('file://' + pdfPath)
      event.sender.send('wrote-pdf', pdfPath)
    })
  })
});

var today = new Date();
var dateto = String(String(today.getFullYear())+'-'+String(today.getMonth()+1)+'-'+String(today.getDate())); 

ipcMain.on("Todayreq", function () {
  console.log("IN index");
  let result = knex("Transaction").where('Date',dateto)
  result.then(function(rows){
    console.log(rows);
    win.webContents.send("TodayresultSent", rows);
  })
});

ipcMain.on("TillTodayreq", function () {
  console.log("IN index");
  let result = knex("Transaction")
  result.then(function(rows){
    console.log(rows);
    win.webContents.send("TillTodayresultSent", rows);
  })
});

ipcMain.on("indexWindowLoaded", function () {
  console.log("IN index");
  let result = knex("Person").where('Balance','>','0')
  result.then(function(rows){
    console.log(rows);
    win.webContents.send("indexresultSent", rows);
  })
});

ipcMain.on("pendingWindowLoaded", function () {
  console.log("IN pending");
  let result = knex("Person").where('Balance','>','0')
  result.then(function(rows){
    console.log(rows);
    win.webContents.send("pendingresultSent", rows);
  })
});

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 1200,
    icon: __dirname + 'Design/Accountiee-logo.png',
    webPreferences: {
      nodeIntegration: true
    }
  })
//win.removeMenu();
  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'welcome.html'),
    protocol: 'file',
    slashes: true
  }));

  win.once("ready-to-show", () => { win.show() })

	

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.