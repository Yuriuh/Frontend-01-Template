var page = require('webpage').create();

page.open('https://baidu.com', function(status) {
  console.log("Status: " + status);
  if(status === "success") {
    page.render('baidu.png');
  }
  phantom.exit();
});