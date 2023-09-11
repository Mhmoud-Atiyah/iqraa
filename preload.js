const { contextBridge, ipcRenderer } = require('electron')

// Install Interface
contextBridge.exposeInMainWorld('installInterface', {
  closeWindow: (data) => ipcRenderer.invoke('installChannel', data),
})
// Note Interface
contextBridge.exposeInMainWorld('noteInterface', {
  sendId: (data) => ipcRenderer.send('noteChannel', data)
})
// reader Interface
contextBridge.exposeInMainWorld('readerInterface', {
  sendToReader: (bookData) => ipcRenderer.send('readerChannel', bookData)
})
// User Settings Interface
contextBridge.exposeInMainWorld('settingsInterface', {
  Open: (data) => ipcRenderer.send('settingsChannel', data)
})
// User Profile Interface
contextBridge.exposeInMainWorld('profileInterface', {
  Open: (data) => ipcRenderer.invoke('profileChannel', data)
})