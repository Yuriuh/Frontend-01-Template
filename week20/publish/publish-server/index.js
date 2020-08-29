const http = require('http')
const https = require('https')
const unzip = require('unzipper')

const server = http.createServer((req, res) => {

  if (req.url.match(/^\/auth/)) {
    return auth(req, res)
  }

  if (req.url.match(/^\/$/)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('not fount')
    return
  }

  const options = {
    hostname: 'api.github.com',
    port: 443,
    path: `/user`,
    method: 'GET',
    headers: {
      'Authorization': 'token ' + req.headers.token,
      'User-Agent': 'publish-demo-007'
    }
  }
  const request = https.request(options, response => {
    let body = ''
    response.on('data', d => {
      if (d) body += d.toString()
    })
    response.on('end', () => {
      // console.log('body', body)
      let user = JSON.parse(body)
      console.log('user', user)
      // 权限检查
      let writeStream = unzip.Extract({ path: '../server/public/' })
      req.pipe(writeStream)

      req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('okay')
      })
    })
  })

  request.on('error', error => {
    console.error('error', error)
  })
  request.end()
})

const auth = (req, res) => {
  let code = req.url.match(/code=([^&]+)/)[1]
  let state = '123abc'
  let client_secret = '4e996e7d7ebba007f3c04acd8418760893c1524f'
  let client_id = 'Iv1.a841d13f0ce2a88a'
  let redirect_uri = encodeURIComponent('http://localhost:8080/auth')
  let params = `code=${code}&state=${state}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}`

  // console.log('code', code)

  const options = {
    hostname: 'github.com',
    port: 443,
    path: `/login/oauth/access_token?${params}`,
    method: 'POST',
  }

  const request = https.request(options, response => {
    response.on('data', d => {
      let result = d.toString().match(/access_token=([^&]+)/)
      if (result) {
        let token = result[1]
        res.writeHead(200, {
          'access_token': token,
          'Content-Type': 'text/html',
        })
        res.end(`<a href="http://localhost:8080/publish?token=${token}">publish</a>`)
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/plain',
        })
        res.end('error')
      }
    })
  })

  request.on('error', error => {
    console.log('error', error)
  })

  request.end()
}

server.listen(8081, () => {
  console.log('server listening in 8081')
})