const http = require('http')
const archiver = require('archiver')
const childProcess = require('child_process')

const packname = 'package'

const redirect_uri = encodeURIComponent('http://localhost:8081/auth')
const url = `https://github.com/login/oauth/authorize?client_id=Iv1.a841d13f0ce2a88a&redirect_uri=${redirect_uri}&state=123abc`

childProcess.exec(`start ${url}`)

const server = http.createServer((request, response) => {
  let token = request.url.match(/token=([^&]+)/)[1]
  console.log('real publish!')

  const options = {
    host: 'localhost',
    port: 8081,
    path: `/?filename=${packname}.zip`,
    method: 'POST',
    headers: {
      token,
      'Content-Type': 'application/octet-stream',
    },
  }

  const archive = archiver('zip', {
    zlib: { level: 9 }
  })

  archive.directory(`./${packname}`, false)
  archive.finalize()

  const req = http.request(options, res => {
    console.log(`STATUS: ${res.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
  })

  req.on('error', e => {
    console.error(`problem with request: ${e.message}`)
  })

  archive.pipe(req)

  archive.on('end', () => {
    req.end()
    console.log('publish success!!!')
    response.end('publish success!!!')
    server.close()
  })
})

server.listen(8080, () => {
  console.log('publish tool server is listening in 8080')
})