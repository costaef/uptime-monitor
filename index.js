import http from 'http'
import url from 'url'

const server = http.createServer((req, res) => {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true)

  // Get the path
  const path = parsedUrl.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')

  // Send the response
  res.end('Hello World\n')

  // Log the request path
  console.log(`Request received on path: ${trimmedPath}`)
})

server.listen(3000, () => console.log('The server is listening on port 3000'))