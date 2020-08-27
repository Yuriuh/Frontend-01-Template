const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const unzip = require('unzipper');
const child_process = require('child_process');

// 启动服务器后打开首页
child_process.exec(`start http://localhost:8081/index.html`);

// 获得客户端的Cookie
function getCookies(req) {
  let cookies = {};
  req.headers.cookie &&
    req.headers.cookie.split(';').forEach(function (Cookie) {
      let parts = Cookie.split('=');
      cookies[parts[0].trim()] = (parts[1] || '').trim();
    });
  console.log('cookies', cookies);
  return cookies;
}

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

    let result = '';
    response.on('data', (d) => {
      result += d.toString();
    });

    response.on('end', () => {
      let matchedResult = result.match(/access_token=([^&]+)/);
      console.log('access_token result', matchedResult);

      if (matchedResult) {
        let token = matchedResult[1];
        console.log('token', token);

        res.writeHead(200, {
          'Set-Cookie': `token=${token}; Expires=${new Date(
            new Date().getTime() + 30 * 60 * 1000,
          ).toUTCString()}`,
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

  if (req.url === '/index.html') {
    const cookies = getCookies(req);
    // 进入index时，判断cookie中是否有token，有则表示已登录，可以发布
    if (cookies.token) {
      res.end(
        `<a href="http://localhost:8080/publish?token=${cookies.token}">publish</a>`,
      );
      return;
    } else {
      // cookie中没有token，则跳转到github登录
      const redirect_uri = encodeURIComponent('http://localhost:8081/auth');
      res.writeHead(301, {
        Location: `https://github.com/login/oauth/authorize?client_id=d0a5737dce00dc2ca997&redirect_uri=${redirect_uri}&state=abc123`,
      });
      res.end();
      return;
    }
  }
  if (req.url.match(/^\/auth/)) {
    const cookies = getCookies(req);
    // 访问/auth时，判断cookie中是否有token，有则表示已登录，可以发布
    if (cookies.token) {
      res.end(
        `<a href="http://localhost:8080/publish?token=${cookies.token}">publish</a>`,
      );
      return;
    } else {
      // 若没有token，则进行认证
      return auth(req, res);
    }
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
  console.log('req.headers', req.headers);

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
