var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
const path = require('path');
const fs = require('fs');

/* GET home page. */
router.post('/', function (request, res, next) {
  const filePath = path.resolve(
    __dirname,
    `../../server/public/${request.query.filename}`,
  );
  console.log(filePath);
  fs.writeFileSync(filePath, request.body.content);
  res.send('Success!');
  res.end();
});

module.exports = router;
