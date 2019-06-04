import http from 'http'
import https from 'https'
import url from 'url'
import fs from 'fs'
import { StringDecoder } from 'string_decoder'
import { environment } from './config'
import {
  notFoundHandler,
  pingHandler,
  usersHandler
} from './lib/handlers'

// Logic for both the http and https server
const unifiedServer = (req, res) => {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true)

  // Get the path
  const path = parsedUrl.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')

  // Get the query string as an object
  const queryStringObject = parsedUrl.query

  // Get the HTTP method
  const method = req.method.toLowerCase()

  // Get the headers as an object
  const headers = req.headers

  // Get the payload, if any
  const decoder = new StringDecoder('utf-8')
  let buffer = ''
  req.on('data', data => {
    buffer += decoder.write(data)
  })

  req.on('end', () => {
    buffer += decoder.end()

    // Choose the handler. If one is not found, use notFound handler
    const handler = router[trimmedPath] ? router[trimmedPath] : notFoundHandler
    
    // Construct the data object to send to the handler
    const data = {
      path: trimmedPath,
      query: queryStringObject,
      method: method,
      headers: headers,
      payload: buffer,
    }

    // Route the request to the handler specified in the router
    handler(data, (statusCode = 200, payload = {}) => {
      // Convert the payload to a string
      const payloadString = JSON.stringify(payload)

      // Return the response
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode)
      res.end(payloadString)

      // Log response info
      console.log(`Status code: ${statusCode}`)
      console.log(`Response payload: ${payloadString}`)
    })
  })
}

// HTTP Server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res)
})

httpServer.listen(environment.http, () => {
  console.log(`The server is listening on port ${environment.http} in ${environment.name} mode.`)
})

// HTTPS Server
const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
}

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res)
})

httpsServer.listen(environment.https, () => {
  console.log(`The server is listening on port ${environment.https} in ${environment.name} mode.`)
})

// Define a request router
const router = {
  ping: pingHandler,
  users: usersHandler,
}