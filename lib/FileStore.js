import fs from 'fs'
import path from 'path'

export default class FileStore {
  baseDir = path.join(__dirname, '/../.data/')

  create = (dir, file, data, callback) => {
    fs.open(`${this.baseDir}${dir}/${file}.json`, 'wx', (openError, fileDescriptor) => {
      if (!openError && fileDescriptor) {
        // Convert data to string
        const stringData = JSON.stringify(data)

        // Write to file and close it
        fs.writeFile(fileDescriptor, stringData, writeError => {
          if (!writeError) {
            fs.close(fileDescriptor, closeError => {
              if (!closeError) {
                callback()
              } else {
                callback(closeError)
              }
            })
          } else {
            callback(writeError)
          }
        })
      } else {
        callback(openError)
      }
    })
  }

  read = (dir, file, callback) => {
    fs.readFile(`${this.baseDir}${dir}/${file}.json`, 'utf8', (err, data) => {
      callback(err, data)
    })
  }

  update = (dir, file, data, callback) => {
    // Open the file
    fs.open(`${this.baseDir}${dir}/${file}.json`, 'r+', (openError, fileDescriptor) => {
      if (!openError && fileDescriptor) {
        const stringData = JSON.stringify(data)

        // Truncate the file
        fs.ftruncate(fileDescriptor, truncateError => {
          if (!truncateError) {
            fs.writeFile(fileDescriptor, stringData, writeError => {
              if (!writeError) {
                fs.close(fileDescriptor, closeError => {
                  if (!closeError) {
                    callback()
                  } else {
                    callback(closeError)
                  }
                })
              } else {
                callback(writeError)
              }
            })
          } else {
            callback(truncateError)
          }
        })
      } else {
        callback(openError)
      }
    })
  }

  delete = (dir, file, callback) => {
    fs.unlink(`${this.baseDir}${dir}/${file}.json`, err => {
      callback(err)
    })
  }
}