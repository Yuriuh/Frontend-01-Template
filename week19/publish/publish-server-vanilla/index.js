const http = require('http')
const unzip = require('unzipper')

const server = http.createServer((req, res) => {
  let writeStream = unzip.Extract({ path: '../server/public/' })
  req.pipe(writeStream)

  // req.on('data', trunk => {
  //   writeStream.write(trunk)
  // })
  // req.on('end', trunk => {
  //   writeStream.end(trunk)
  // })

  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('okay')
  })
})

server.listen(8081, () => {
  console.log('server listening in 8081')
})