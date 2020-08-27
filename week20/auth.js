// 1. 浏览器发起登录
// https://github.com/login/oauth/authorize?client_id=d0a5737dce00dc2ca997&redirect_uri=http%3A%2F%2Flocalhost%3A8080&state=abc123

// 2. 服务端获取token，publish-server
let code = '8e363b58dbd2d99d7928';
let state = 'abc123';
let client_secret = '21b80bc39977b52a32fbb68838ab2ea504412307';
let client_id = 'd0a5737dce00dc2ca997';
let redirect_uri = encodeURIComponent('http://localhost:8080');

let params = `code=${code}&state=${state}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}`;

let xhr = new XMLHttpRequest();

xhr.open('POST', `https://github.com/login/oauth/access_token?${params}`, true);
xhr.send(null);

xhr.addEventListener('readystatechange', function (event) {
  if (xhr.readyState === 4) {
    console.log(event.responseText);
  }
});

// 3. 客户端/服务端调接口，publish-tool/publish-server
let xhr = new XMLHttpRequest();

xhr.open('GET', `https://api.github.com/user`, true);
xhr.setRequestHeader('Authorization', `token 68f5e7b6f8a60f61c6f90fb366cb981274700687`);
xhr.send(null);

xhr.addEventListener('readystatechange', function (event) {
  if (xhr.readyState === 4) {
    console.log(event.responseText);
  }
});
