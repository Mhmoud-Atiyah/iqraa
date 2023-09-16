//---------------------------------------------------------
// Node Modules
//---------------------------------------------------------
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { spawn } = require('node:child_process');
const fs = require('fs');
var http = require('http');
const { log } = require('console');
const { escape } = require('querystring');
//---------------------------------------------------------
// Some Constants and variables
//---------------------------------------------------------
const SERVER_PORT = 1999;  // ! Don't Change it
var REFRESH_NEWS = 3; // Number of days
var REFRESH_Store = 7; // Number of days
const home_dir = process.env.HOME + '/';
const iqraa_home_dir = home_dir + '.iqraa/';
const notes_dir = iqraa_home_dir + 'notes/';
const cache_dir = iqraa_home_dir + 'cache/';
const cache_temp_dir = cache_dir + 'temp/';
const cache_books_dir = cache_dir + 'books/';
const user_Data_file = iqraa_home_dir + 'user.json';
const user_Config_file = iqraa_home_dir + 'config.json';
const Reader_file = iqraa_home_dir + 'reader.json';
const bookTable = cache_books_dir + 'table.json';
const NoteTable = notes_dir + 'table.json';
//---------------------------------------------------------
const iqraa_Binary = 'assets/htmlEngine/build/iqraa';
//---------------------------------------------------------

//---------------------------------------------------------
// Some Misc Functions
//---------------------------------------------------------
// True if it's first time
function isItfirstTime(path) {
  if (!fs.existsSync(path)) {
    return true;
  } else {
    false;
  }
};
//---------------------------------------------------------
// FS Node Module related Functions
//---------------------------------------------------------
/**
 * @brief Moves a file asynchronously.
 * @param {string} src - The source path of the file.
 * @param {string} des - The destination path of the file.
 * @returns {Promise<void>} A promise that resolves when the file is moved successfully or rejects with an error.
 */
fs.MoveFileAsync = async function (src, des) {
  try {
    await fs.rename(src, des);
    console.log('File moved successfully');
  } catch (err) {
    console.error(`Error moving file: ${err}`);
  }
}
/**
 * @brief Reads a file asynchronously.
 * @param {string} filename - The path of the file to read.
 * @returns {Promise<Buffer|string>} A promise that resolves with the file data as a Buffer or string, depending on the encoding used.
 */
fs.readFileAsync = function (filename) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, function (err, data) {
      if (err)
        reject(err);
      else
        resolve(data);
    });
  });
};
//---------------------------------------------------------
// JSON related Functions
//---------------------------------------------------------
/**
* Reads a JSON file and sends its contents as a response in an HTTP server.
*
* @param {string} file - The path to the JSON file to be read.
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
*/
function readJson(file, req, res) {
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) throw err;
    let Data = JSON.parse(data);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(Data));
    res.end();
  });
}
//TODO: implement right editJsonFile function
/**
 * Edits a JSON file by either deleting a specified key data or editing existing data.
 *
 * @param {string} path - The path to the JSON file.
 * @param {number} opt - The option for editing the JSON data. 
 * Use 0 to delete data with a string key, 
 * or 1 to edit data with an object, 
 * or 2 to append data to object.
 * @param {string|object} data - The data to be deleted, edited or append . 
 * If `opt` is 0, it should be a string representing the key to be deleted.
 * If `opt` is 1, it should be an object containing the key-value pairs to be edited.
 * If `opt` is 2, it should be an object containing the key-value pairs to be appended
 * @returns {void}
 */
function editJsonFile(path, opt, data) {
  fs.readFileAsync(path).then((seed) => {
    let Input = JSON.parse(seed);
    // Delete Specified Key Data
    if (opt === 0 && typeof data === 'string') {
      if (Input.hasOwnProperty(`${data}`)) {
        delete Input[`${data}`]
      }
    } else if (opt === 1 && typeof data === 'object') {
      // Edit Data
      Object.keys(data).forEach((key) => {
        Input[key] = data[key];
      })
    } else if (opt === 2 && typeof data === 'object') {
      // append Data
      Input.push(data);
    } else {
      // Error Option
      console.log("Invalid option. Use 0 with a string or 1 with an object.");
      return;
    }
    // Write it back
    fs.writeFile(path, JSON.stringify(Input), 'utf8', (err) => {
      if (err) throw err;
      console.log(`Data updated successfully`);
    });
  });
}
//---------------------------------------------------------
// Minor Routines for Main services
//---------------------------------------------------------
/**
 * Checks the creation time of a file and performs an action if it's more than three days old.
 * @param {string} filePath - The path to the file.
 * @param {Number} nrDays - time to check in days.
 */
function retrieve_NEWS_STORE(filePath, nrDays) {
  let parts = filePath.split("/");
  const fileName = parts[parts.length - 1];
  const file = fileName.split(".")[0];
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) { // First Time
      // run Binary
      const BIN = spawn(iqraa_Binary, [`-${file}`]);
      BIN.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
      BIN.on('close', (code) => {
        console.log(`${file} File Created Successfully`);
      });
    } else { // Already Exist
      // Get the file creation time
      const fileStat = fs.statSync(filePath);
      const creationTime = fileStat.birthtime;
      // Calculate the difference in days between the creation time and the current time
      const currentTime = new Date();
      const timeDifference = Math.abs(currentTime - creationTime);
      const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      // Perform an action if the file is more than three days old
      if (daysDifference > nrDays) {
        const BIN = spawn(iqraa_Binary, [`-${file}`]);
        BIN.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
        BIN.on('close', (code) => {
          console.log(`${bin} File Created Successfully`);
        });
      }
    };
  });
}
/**
 * Creates a server and handles different URL routes to read JSON files.
 *
 * @param {http.IncomingMessage} req - The request object.
 * @param {http.ServerResponse} res - The response object.
 */
var server = http.createServer(function (req, res) {
  if (req.url == '/user') {
    readJson(user_Data_file, req, res);
  } else if (req.url == '/config') {
    readJson(user_Config_file, req, res);
  } else if (req.url.includes('configEdit')) {
    let query = decodeURIComponent(req.url.replace(/%20/g, " ").replace("/configEdit", " ")).split("|--|");
    if (query[1] == 'darkMode') {
      if (query[2] == "true") {
        editJsonFile(user_Config_file, 1, {
          "darkMode": true
        });
      } else {
        editJsonFile(user_Config_file, 1, {
          "darkMode": false
        });
      }
    } else if (query[1] == 'language') {

    }
  } else if (req.url == '/news') {
    readJson((path.join(cache_dir, "news.json")), req, res);
  } else if (req.url == '/store') {
    readJson((path.join(cache_dir, "store.json")), req, res);
  } else if (req.url == '/noteTable') {
    readJson(NoteTable, req, res);
  } else if (req.url.includes('readNote')) {
    let book = req.url.replace(/%20/g, " ").replace("/readNote/", " ").slice(1);
    fs.access((path.join(notes_dir, `${book}.json`)), fs.constants.F_OK, (err) => {
      if (err) {
        console.log(`${(path.join(notes_dir, `${book}.json`))} Can't Open`);
        return;
      }
      readJson((path.join(notes_dir, `${book}.json`)), req, res);
    });
  } else if (req.url.includes('writeNote')) {
    //TODO: need a lot of work
    let data = decodeURIComponent(req.url.replace(/%20/g, " ").replace("/writeNote/", " ").slice(1)).replace(/\//g, "\\");
    // ! Second Update Data
    /* 
    fs.readFileAsync((path.join(notes_dir, `${query[0]}.json`))).then((seed) => {
      let Input = JSON.parse(seed);
      if (Input.hasOwnProperty("notes")) {
        //TODO: Get Data from Note Window itself
        Input["notes"].push({
          "quotation": "",
          "comment": "",
          "lastEdit": "",
          "location": ""
        });
      }
      // Write it back
      fs.writeFile((path.join(notes_dir, `${query[0]}.json`)), JSON.stringify(Input), 'utf8', (err) => {
        if (err) throw err;
        console.log(`Data in file ${(notes_dir + `${query[0]}.json`)} updated successfully`);
      });
    })
     */

  } else if (req.url.includes('deleteNote')) {
    let book = req.url.replace(/%20/g, " ").replace("/deleteNote/", " ").slice(1).split("/");
    fs.readFileAsync((path.join(notes_dir, `${book[0]}.json`))).then((seed) => {
      let Input = JSON.parse(seed);
      // This's Last Entry so delet book entry from table
      if (Input.notes.length <= 1) {
        editJsonFile(NoteTable, 0, `${book[0]}`);
        fs.unlink((path.join(notes_dir, `${book[0]}.json`)), (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`File ${(path.join(notes_dir, `${book[0]}.json`))} deleted successfully`);
        });
      } else {
        if (Input.hasOwnProperty("notes")) {
          Input["notes"].splice(book[1], 1);
        }
        // Write it back
        fs.writeFile((path.join(notes_dir, `${book[0]}.json`)), JSON.stringify(Input), 'utf8', (err) => {
          if (err) throw err;
          console.log(`Data updated successfully`);
        });
      };
    });
  } else if (req.url == '/lastOpen') {
    readJson(Reader_file, req, res);
  } else if (req.url == '/bookList') {
    readJson(bookTable, req, res);
  } else if (req.url.includes('searchBook')) {
    let query = req.url.replace(/%20/g, " ").replace("/searchBook/", " ").slice(1).split(" ");
    fs.access((path.join(cache_temp_dir, `search: ${query.join(' ')}.json`)), fs.constants.F_OK, (err) => {
      if (err) {
        console.log(`Waiting While Downlaoding search: ${query.join(' ')}.json File`);
        const GOODREADSAPI = spawn(iqraa_Binary, ['-search', ...query]);
        GOODREADSAPI.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
        GOODREADSAPI.on('close', (code) => {
          console.log(`Goodreads return with data of ${query.join(' ')}`);
          readJson((path.join(cache_temp_dir, `search: ${query.join(' ')}.json`)), req, res);
        });
        return;
      }
      console.log(`${(path.join(cache_temp_dir, `search: ${query.join(' ')}.json`))} Already Exist`);
      readJson((path.join(cache_temp_dir, `search: ${query.join(' ')}.json`)), req, res);
    });
  } else if (req.url.includes('retrieveBookData')) {
    let _seed = decodeURI(req.url.replace(/%20/g, " ").replace("/retrieveBookData/", " ").slice(1)).split("|--|");
    fs.access((path.join(cache_books_dir, `${_seed[1]}.json`)), fs.constants.F_OK, (err) => {
      if (err) {
        console.log(`Waiting While Downlaoding Data of ${_seed[1]}.json file`);
        const GOODREADSRetrieve = spawn(iqraa_Binary, ['-open', _seed[0]]);
        GOODREADSRetrieve.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
        GOODREADSRetrieve.on('close', (code) => {
          // Open it Just for reading id to edit book table
          fs.readFileAsync((path.join(cache_temp_dir, `${_seed[1]}.json`)), 'utf8').then((jsonValue) => {
            let obj = JSON.parse(jsonValue);
            // Edit Book Table file
            let NewData = {};
            NewData[obj.id] = `${_seed[1]}`;
            editJsonFile(bookTable, 1, NewData);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({
              "id": obj.id
            }));
            res.end();
            console.log(`Goodreads return with ${_seed[1]}.json`);
          });
          // Move file To books Dir
          fs.MoveFileAsync(`${cache_temp_dir}${_seed[1]}.json`, `${cache_books_dir}${_seed[1]}.json`);
        });
        return;
      }
      console.log(`${(path.join(cache_books_dir, `${_seed[1]}.json`))} Already Exist`);
    });
  } else if (req.url.includes('openBookData')) {
    //TODO: book = id
    let book = req.url.replace(/%20/g, " ").replace("/openBookData/", " ").slice(1);
    fs.access((path.join(cache_books_dir, `${book}.json`)), fs.constants.F_OK, (err) => {
      if (err) {
        console.log(`${(path.join(cache_books_dir, `${book}.json`))} Can't Open`);
        return;
      }
      readJson((path.join(cache_books_dir, `${book}.json`)), req, res);
    });
  } else if (req.url.includes('editTable')) {
    let query = req.url.replace(/%20/g, " ").replace("/editTable/", " ").slice(1).split("/");
    // TODO: use the new editJsonFile function
    if (query[0] == "want" || query[0] == "read" || query[0] == "current" || query[0] == "best") {
      fs.readFileAsync(bookTable).then((seed) => {
        let bookTableData = JSON.parse(seed);
        bookTableData[`${query[0]}`][`${query[1]}`] = `${decodeURIComponent(query[2])}`;
        // Write it back
        fs.writeFile(bookTable, JSON.stringify(bookTableData), 'utf8', (err) => {
          if (err) throw err;
          console.log(`Data updated successfully`);
        });
      });
    } else if (query[0] == "notes") {
      fs.readFileAsync(NoteTable).then((seed) => {
        let NoteTableData = JSON.parse(seed);
        NoteTableData[`${query[1]}`] = `${query[2]}`;
        // Write it back
        fs.writeFile(NoteTable, JSON.stringify(NoteTableData), 'utf8', (err) => {
          if (err) throw err;
          console.log(`Data updated successfully`);
        });
      });
    }
  }
});
//---------------------------------------------------------
// Main Services  
//---------------------------------------------------------
function initIqraa() {
  if (!isItfirstTime(iqraa_home_dir) && !isItfirstTime(user_Data_file)) {
    console.log("مرحباً بك مرة أخرى");
  } else {
    if (isItfirstTime(user_Data_file)) {
      createInstallWindow();
    };
    // Create Needed Directories and Files
    if (!fs.existsSync(iqraa_home_dir)) {
      // Create Main Directory
      fs.mkdir(iqraa_home_dir, (err) => {
        if (err) throw err;
        console.log(`Directory: ${iqraa_home_dir} created successfully`);
      });
      // Create Cache Directory and Sub Directories
      fs.mkdir((iqraa_home_dir + 'cache'), (err) => {
        if (err) throw err;
        console.log(`Directory: ${iqraa_home_dir}cache created successfully`);
        // Cache any Book data in search or any else
        fs.mkdir((cache_dir + 'books'), (err) => {
          if (err) throw err;
          console.log(`Directory: ${cache_dir + 'books '}cache created successfully`);
          // create dir for temp files like html ones
          fs.mkdir(cache_temp_dir, (err) => {
            if (err) throw err;
            console.log(`Directory: ${cache_temp_dir} created successfully`);
          });
          // Create Main Table file to deal with data in Dir
          fs.access(bookTable, fs.constants.F_OK, (err) => {
            if (err) {
              fs.writeFile(bookTable, JSON.stringify({
                "read": {},
                "current": {},
                "want": {},
                "best": {}
              }), 'utf8', (err) => {
                if (err) throw err;
                console.log(`File: ${bookTable} created successfully`);
              });
            };
          });
          // Create Reader file
          fs.access(Reader_file, fs.constants.F_OK, (err) => {
            if (err) {
              fs.writeFile(Reader_file, JSON.stringify({
                "lastOpen": []
              }), 'utf8', (err) => {
                if (err) throw err;
                console.log(`File: ${Reader_file} created successfully`);
              });
            };
          });
        });
      });
      // Create Notes Directory        
      fs.mkdir((iqraa_home_dir + 'notes'), (err) => {
        if (err) throw err;
        console.log(`Directory: ${iqraa_home_dir}notes created successfully`);
        // Create Main Table file to deal with data in Dir
        fs.access(NoteTable, fs.constants.F_OK, (err) => {
          if (err) {
            fs.writeFile(NoteTable, JSON.stringify({
              "1999": "My Notes"
            }), 'utf8', (err) => {
              if (err) throw err;
              console.log(`File: ${NoteTable} created successfully`);
            });
            //TODO: Add Note Cover To setting Data
            fs.readFileAsync(user_Data_file).then((_seed) => {
              let Data = JSON.parse(_seed);
              fs.writeFile((notes_dir + '1999.json'), JSON.stringify({
                "id": "1999",
                "cover": "https://m.media-amazon.com/images/I/61EgnjxoHPL._AC_UF1000,1000_QL80_.jpg",
                "title": "ملاحظاتي",
                "author": (Data.firstName + " " + Data.lasttName),
                "notes": []
              }), 'utf8', (err) => {
                if (err) throw err;
                console.log(`File: ${bookTable} created successfully`);
              });
            })

          };
        });
      });
    };
  };
};
//---------------------------------------------------------
// Application's Install Window
//---------------------------------------------------------
function createInstallWindow() {
  const login_window = new BrowserWindow({
    minHeight: 700,
    minWidth: 800,
    width: 700,
    height: 800,
    frame: false,
    center: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  login_window.loadFile('static/install.html')
  login_window.once('ready-to-show', () => {
    login_window.show()
  })
  //---------------------------------------------------------
  // Install Window
  //---------------------------------------------------------
  ipcMain.handle("installChannel", (event, data) => {
    // Create User Data Based On Login Modal
    fs.access(user_Data_file, fs.constants.F_OK, (err) => {
      if (err) {
        fs.writeFile(user_Data_file, (JSON.stringify(data[0])), 'utf8', (err) => {
          if (err) throw err;
          console.log(`File: ${user_Data_file} created successfully`);
        });
      };
    });
    // Create User Configuration Based On Login Modal
    fs.access(user_Config_file, fs.constants.F_OK, (err) => {
      if (err) {
        fs.writeFile(user_Config_file, (JSON.stringify(data[1])), 'utf8', (err) => {
          if (err) throw err;
          console.log(`File: ${user_Config_file} created successfully`);
        });
      };
    });
    login_window.close();
  });
}
//---------------------------------------------------------
// Application's Main Window
//---------------------------------------------------------
const createMainWindow = () => {
  // Initialize Server First to Syn Data
  server.listen(SERVER_PORT);
  const win = new BrowserWindow({
    minHeight: 720,
    minWidth: 1280,
    width: 1280,
    height: 720,
    center: true,
    autoHideMenuBar: true,
    icon: path.join(__dirname, '/img/logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true // Enable nodeIntegration
    }
  });
  // load specific html file
  if (!isItfirstTime(user_Data_file)) {
    win.loadFile('static/main.html');
  } else {
    win.loadFile('static/about.html');
    //TODO: Do some staff to mae it more magic experience
  };
  //---------------------------------------------------------
  // Note Window
  //---------------------------------------------------------
  ipcMain.on("noteChannel", (event, _query) => {
    const noteWin = new BrowserWindow({
      minHeight: 720,
      minWidth: 1280,
      width: 1280,
      height: 720,
      center: true,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
    noteWin.loadFile('static/note.html');
    //-----------------------------------
    //  Some Work before show Window
    //-----------------------------------
    let query = _query.split("|--|");
    // check if it's first Note for this query ?
    fs.readFileAsync(NoteTable).then((seed) => {
      let Input = JSON.parse(seed);
      if (!(query[0] in Input)) { // First Time
        // read file of ID from Books Dir to get needed Data
        fs.readFileAsync((path.join(cache_books_dir, `${query[0]}.json`))).then((_seed) => {
          let Data = JSON.parse(_seed);
          // Note file Data
          let Note = {
            "id": `${query[0]}`,
            "cover": `${Data.coverSrc}`,
            "title": `${Data.title}`,
            "author": `${Data.author.name}`,
            "notes": []
          }
          // Create new file for notes
          fs.writeFile((path.join(notes_dir, `${query[0]}.json`)), JSON.stringify(Note), 'utf8', (err) => {
            if (err) throw err;
            console.log(`${(path.join(notes_dir, `${query[0]}.json`))} file Created successfully`);
          });
          // Append new entry to note table
          Input[query[0]] = Data.title;
          fs.writeFile(NoteTable, JSON.stringify(Input), 'utf8', (err) => {
            if (err) throw err;
            console.log(`Data updated successfully`);
          });
        })
      }
    });
    // Now Show Note Window
    noteWin.once('ready-to-show', () => {
      noteWin.show();
    })
  });
  //---------------------------------------------------------
  // Reader Window
  //---------------------------------------------------------
  ipcMain.on("readerChannel", (event, bookData) => {
    // Save data first
    fs.readFileAsync((path.join(iqraa_home_dir, "reader.json")), 'utf8').then((readerData) => {
      let items = JSON.parse(readerData);
      var exist = 0;
      for (let j = 0; j < items.length; j++) {
        (items[j].path == bookData[0]) ? (exist = 1) : (exist += 0);
      }
      if (!exist) {
        editJsonFile((path.join(iqraa_home_dir, "reader.json")), 2, {
          "path": bookData[0],
          "imgSrc": bookData[1],
          "title": bookData[2],
          "info": bookData[3]
        });
      }
    });
    // Create Reader Window
    const readerWin = new BrowserWindow({
      minHeight: 720,
      minWidth: 1280,
      width: 1280,
      height: 720,
      center: true,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
    readerWin.once('ready-to-show', () => {
      readerWin.show();
    })
    readerWin.loadFile('static/reader.html');
    readerWin.webContents.executeJavaScript(`window.path = "${bookData[0]}";`);
  });
  //---------------------------------------------------------
  // Settings Window
  //---------------------------------------------------------
  ipcMain.on("settingsChannel", (event, add) => {
    const profileWin = new BrowserWindow({
      width: 720,
      height: 720,
      center: true,
      center: true,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
    profileWin.once('ready-to-show', () => {
      profileWin.show();
    })
    profileWin.loadFile('static/settings.html');
  });
  //---------------------------------------------------------
  // Profile window
  //---------------------------------------------------------
  ipcMain.handle("profileChannel", () => {
    const profileWin = new BrowserWindow({
      width: 1280,
      height: 720,
      center: true,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
    profileWin.once('ready-to-show', () => {
      profileWin.show();
    })
    profileWin.loadFile('static/profile.html');
  });
}
//---------------------------------------------------------
// Electron's App start
//---------------------------------------------------------
app.whenReady().then(() => {
  initIqraa();
  // ! Second: Create window View  
  createMainWindow();
  // ! First: Run Backend Engines to retrieve data
  //TODO: make it work perfectly
  //retrieve_NEWS_STORE(path.join(cache_dir, "news.json"), REFRESH_NEWS, "iqraa");
  //retrieve_NEWS_STORE(path.join(cache_dir, "store.json"), REFRESH_Store, "iqraa");
  // refresh app after finish
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})