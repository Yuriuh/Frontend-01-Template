const net = require('net')

// const client = net.createConnection({
//   host: '127.0.0.1',
//   port: 8080,
// }, () => {
//   console.log('connected to server!')
//   // 起始行
//   client.write("POST / HTTP/1.1\r\n")
//   // 请求头
//   client.write("Content-Type: application/x-www-form-urlencoded\r\n")
//   client.write("Content-length: 11\r\n")
//   // 空行
//   client.write("\r\n")
//   // 请求体
//   client.write("name=yuriuh")
// })

// client.on('data', data => {
//   console.log('--- on data ---')
//   console.log(data.toString())
//   client.end()
// })

// client.on('end', () => {
//   console.log('disconnected from server')
// })

// const client = net.createConnection({
//   host: '127.0.0.1',
//   port: 8080,
// }, () => {
//   const request = new Request({
//     method: 'POST',
//     host: '127.0.0.1',
//     port: '8080',
//     headers: {
//       ['X-Bar']: 'hehe',
//     },
//     body: {
//       name: 'yuriuh'
//     }
//   })

//   console.log('--- request to string ---')
//   client.write(request.toString())
// })

// client.on('data', data => {
//   console.log('--- on data ---', data.toString())
//   client.end()
// })

// client.on('end', () => {
//   console.log('disconnected from server')
// })

class Request {
  constructor(options) {
    this.method = options.method || 'GET'
    this.host = options.host
    this.path = options.path || '/'
    this.port = options.port || 80
    this.body = options.body || {}
    this.headers = options.headers || {}
    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded"
    }

    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body)
    } else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
      this.bodyText  = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')
    }

    this.headers["Content-Length"] = this.bodyText.length
  }

  toString() {
    return (
      `${this.method} ${this.path} HTTP/1.1\r\n` +
      `${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r\n` +
      `\r\n` +
      `${this.bodyText}`
    )
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser()
      if (connection) {
        connection.write(this.toString())
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port,
        }, () => {
          connection.write(this.toString())
        })
        connection.on('data', data => {
          parser.receive(data.toString())
          if (parser.isFinished) {
            resolve(parser.response)
          }
          // console.log(parser.statusLine)
          // console.log(parser.headers)
          connection.end()
        })
        connection.on('error', err => {
          reject(err)
          connection.end()
        })
      }
    })
  }
}

class Response {

}

class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 0
    this.WAITING_STATUS_LINE_END = 1
    this.WAITING_HEADER_NAME = 2
    this.WAITING_HEADER_SPACE = 3
    this.WAITING_HEADER_VALUE = 4
    this.WAITING_HEADER_LINE_END = 5
    this.WAITING_HEADER_BLOCK_END = 6
    this.WAITING_BODY = 7

    this.current = this.WAITING_STATUS_LINE
    this.statusLine = ''
    this.headers = {}
    this.headerName = ''
    this.headerValue = ''
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }

  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i))
    }
  }
  receiveChar(char) {
    if (this.current === this.WAITING_STATUS_LINE) {
      // console.log(char, char.charCodeAt(0))
      if (char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END
      } else if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      } else {
        // console.log('char', char)
        this.statusLine += char
      }
    }

    else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      }
    }

    else if (this.current === this.WAITING_HEADER_NAME) {
      if (char === ':') {
        this.current = this.WAITING_HEADER_SPACE
      } else if (char === '\r') {
        this.current = this.WAITING_HEADER_BLOCK_END
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new TrunkedBodyParser()
        }
      } else {
        this.headerName += char
      }
    }

    else if (this.current === this.WAITING_HEADER_SPACE) {
      if (char === ' ') {
        this.current = this.WAITING_HEADER_VALUE
      }
    }

    else if (this.current === this.WAITING_HEADER_VALUE) {
      if (char === '\r') {
        this.current = this.WAITING_HEADER_LINE_END
        this.headers[this.headerName] = this.headerValue
        this.headerName = ''
        this.headerValue = ''
      } else {
        this.headerValue += char
      }
    }

    else if (this.current === this.WAITING_HEADER_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      }
    }

    else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      if (char === '\n') {
        this.current = this.WAITING_BODY
      }
    }

    else if (this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char)
    }
  }
}

class TrunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0
    this.WAITING_LENGTH_LINE_END = 1
    this.READING_TRUNK = 2
    this.WAITING_NEW_LINE = 3
    this.WAITING_NEW_END = 4

    this.isFinished = false
    this.length = 0
    this.content = []

    this.current = this.WAITING_LENGTH
  }
  receiveChar(char) {
    // console.log('char', JSON.stringify(char))
    if (this.current === this.WAITING_LENGTH) {
      if (char === '\r') {
        if (this.length === 0) {
          // console.log('----- finished -----')
          // console.log('----- content -----')
          // console.log(this.content)
          this.isFinished = true
        }
        this.current = this.WAITING_LENGTH_LINE_END
      } else {
        this.length *= 16
        this.length += parseInt(char, 16)
      }
    }

    else if (this.current === this.WAITING_LENGTH_LINE_END) {
      if (char === '\n') {
        this.current = this.READING_TRUNK
      }
    }

    else if (this.current === this.READING_TRUNK) {
      this.content.push(char)
      this.length -= 1
      if (this.length === 0) {
        this.current = this.WAITING_NEW_LINE
      }
    }

    else if (this.current === this.WAITING_NEW_LINE) {
      if (char === '\n') {
        this.current = this.WAITING_LENGTH
      }
    }
  }
}

void async function() {
  const request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: '8080',
    headers: {
      ['X-Bar']: 'hehe',
    },
    body: {
      name: 'yuriuh'
    }
  })

  const res = await request.send()
  console.log('--- res ---')
  console.log(res)
}()