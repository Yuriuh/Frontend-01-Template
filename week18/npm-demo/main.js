const npm = require('npm')

const config = {
  "name": "npm-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
}

console.log('npm', npm)

npm.load(config, err => {
  console.log('err', err)
  npm.install('webpack', err2 => {
    console.log('err2', err2)
  })
})