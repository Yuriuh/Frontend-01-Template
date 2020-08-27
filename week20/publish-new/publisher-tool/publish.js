const http = require('http');
const fs = require('fs');
const archiver = require('archiver');
const child_process = require('child_process');

let packname = 'package.zip';

/* const redirect_uri = encodeURIComponent('http://localhost:8081/auth');
child_process.exec(
  `start https://github.com/login/oauth/authorize?client_id=d0a5737dce00dc2ca997&redirect_uri=${redirect_uri}&state=abc123`,
); */

const server = http.createServer((request, res) => {
  console.log(request.url);
  console.log('real publish');
  if (request.url.match(/^\/favicon.ico/)) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
    return;
  }

  let token = request.url.match(/token=([^&]+)/)[1];
  console.log('token', token);

  // fs.stat(packname, (error, stat) => {
  const options = {
    host: 'localhost',
    port: 8081,
    path: `/?filename=${packname}`,
    method: 'POST',
    headers: {
      token,
      'Content-Type': 'application/x-www-form-urlencoded',
      // 'Content-Length': stat.size,
    },
  };

  var archive = archiver('zip', {
    zlib: {level: 9}, // Sets the compression level.
  });

  // append files from a sub-directory and naming it `new-subdir` within the archive
  archive.directory(`./package`, false);
  archive.finalize();

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  });

  archive.pipe(req);

  archive.on('end', () => {
    /* const redirect_uri = encodeURIComponent('http://localhost:8081/auth');
  child_process.exec(
    `start https://github.com/login/oauth/authorize?client_id=d0a5737dce00dc2ca997&redirect_uri=${redirect_uri}&state=abc123`,
  ); */
    req.end();
    console.log('publish success!');
    res.end('publish success!');
    // 因支持了多用户登录发布，因此不关闭服务器
    // server.close();
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  /* const readStream = fs.createReadStream(`./${packname}`);
  readStream.pipe(req);

  readStream.on('end', () => {
    req.end();
  }); */
  // });
});
server.listen(8080);
