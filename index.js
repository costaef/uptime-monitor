import http from 'http'
import url from 'url'
import { StringDecoder } from 'string_decoder'

const server = http.createServer((req, res) => {
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

    // Send the response
    res.end('Hello World\n')

    // Log the request info
    console.log(`Request received on path: ${trimmedPath} with method: ${method}, and query params:`, queryStringObject)
    console.log('Request headers:', headers)
    console.log('Request payload:', buffer)
  })
})

server.listen(3000, () => console.log('The server is listening on port 3000'))