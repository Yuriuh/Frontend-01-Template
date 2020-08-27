const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const unzip = require('unzipper');

function auth(req, res) {
  let code = req.url.match(/code=([^&]+)/)[1];
  console.log(code);

  let state = 'abc123';
  let client_secret = '21b80bc39977b52a32fbb68838ab2ea504412307';
  let client_id = 'd0a5737dce00dc2ca997';
  let redirect_uri = encodeURIComponent('http://localhost:8080/auth');

  let params = `code=${code}&state=${state}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}`;
  let url = `https://github.com/login/oauth/access_token?${params}`;

  const options = {
    hostname: 'github.com',
    port: 443,
    path: `/login/oauth/access_token?${params}`,
    method: 'POST',
  };

  const request = https.request(options, (response) => {
    // console.log('statusCode:', res.statusCode);
    // console.log('headers:', res.headers);

    response.on('data', (d) => {
      let result = d.toString().match(/access_token=([^&]+)/);

      if (result) {
        let token = result[1];
        console.log('token', token);

        res.writeHead(200, {
          'Set-Cookie': token,
          access_token: token,
          'Content-Type': 'text/html',
        });
        res.end(
          `<a href="http://localhost:8080/publish?token=${token}">publish</a>`,
        );
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/plain',
        });
        res.end('error');
      }
    });
  });

  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
}

// Create an HTTP server
const server = http.createServer((req, res) => {
  console.log(req.url);

  if (req.url.match(/^\/auth/)) {
    return auth(req, res);
  }
  if (req.url.match(/^\/favicon.ico/)) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
    return;
  }

  /* let matched = req.url.match(/\/\?filename=([^&]+)/);
  let filename = matched && matched[1];
  const filePath = path.resolve(__dirname, `../server/public/${filename}`);
  const writeStream = fs.createWriteStream(filePath); */
  console.log(req.headers);

  const options = {
    hostname: 'api.github.com',
    port: 443,
    path: `/user`,
    method: 'GET',
    headers: {
      Authorization: 'token ' + req.headers.token,
      'User-Agent': 'toy-publish',
    },
  };
  console.log('options', options);

  const request = https.request(options, (response) => {
    let body = '';
    response.on('data', (d) => {
      if (d) {
        body += d.toString();
      }
    });
    response.on('end', () => {
      console.log(body);
      let user = JSON.parse(body);
      console.log(user);
      // 此处可增加权限检查
      const writeStream = unzip.Extract({path: '../server/public'});
      req.pipe(writeStream);
      /* // data事件等同于pipe
      req.on('data', (trunk) => {
        writeStream.write(trunk);
      });
      req.on('end', (trunk) => {
        writeStream.end(trunk);
      }); */
      req.on('end', () => {
        console.log('writeStream end');
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('okay');
      });
    });
  });

  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
});

server.listen(8081);
