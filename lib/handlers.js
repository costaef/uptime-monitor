import FileStore from './FileStore'
import { hash } from './helpers'

export const notFoundHandler = (data, callback) => { callback(404) }

export const pingHandler = (data, callback) => { callback(200) }

export const usersHandler = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete']
  if (acceptableMethods.find(method => method == data.method)) {
    users[data.method](data, callback)
  } else {
    callback(405)
  }
}

const users = {
  post: (data, callback) => {
    try {
      const userData = JSON.parse(data.payload)
      const firstName = validateField(userData.firstName, 'firstName')
      const lastName = validateField(userData.lastName, 'lastName')
      const phone = validateField(userData.phone, 'phone', { type: 'string', length: 10 })
      const password = validateField(userData.password, 'password', { type: 'string', minLength: 8 })
      const tosAgreement = validateField(userData.tosAgreement, 'tosAgreement', { type: 'boolean', value: true })

      // Make sure that the user does not already exist
      const dataStore = new FileStore()
      dataStore.read('users', phone, (err, data) => {
        if (err) {
          // Hash the password
          const hashedPassword = hash(password)
          if (hashedPassword) {
            const userFile = {
              firstName,
              lastName,
              phone,
              password: hashedPassword,
              tosAgreement
            }

            // Store the user
            dataStore.create('users', phone, userFile, err => {
              if (!err) {
                callback(201)
              } else {
                console.log(err)
                callback(500, { error: 'Could not create the new user' })
              }
            })
          } else {
            callback(500, { error: 'Unable to hash the user\'s password' })
          }
        } else {
          // User already exists
          callback(400, { error: 'A user with that phone number already exists.' })
        }
      })
    } catch (ex) {
      callback(400, { error: ex })
    }
  },
  get: (data, callback) => {callback(200)},
  put: (data, callback) => {callback(200)},
  delete: (data, callback) => {callback(200)},
}

// options = {
//   type: type,
//   minLength: number,
//   length: number,
//   maxLength: number,
//   value: any
// }
const validateField = (field, name, options = { type: 'string', minLength: 1 }) => {
  if (field == null || field == undefined) {
    throw `Missing field ${name}`
  }

  const validType = typeof(field) == options.type
  const validLength = options.length ? field.trim().length == options.length : true
  const validMinLength = options.minLength ? field.trim().length >= options.minLength : true
  const validMaxLength = options.maxLength ? field.trim().length <= options.maxLength : true
  const validValue = options.value ? field == options.value : true

  if (validType && validLength && validMinLength && validMaxLength && validValue) {
    return options.type == 'string' ? field.trim() : field
  } else {
    throw `Error validating field ${name}`
  } 
}