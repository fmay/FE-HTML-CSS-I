const log_original = console.log
const log = function() {
  return log_original.apply(console, arguments)
}

console.log = function () {}

var phantomcss = require('phantomcss');
var http = require('webserver').create();
const PORT = 3000


function handleRequest(request, response){
  response.statusCode = 200
  //response.setHeader('Content-Type', 'text/html; charset=utf-8')
  response.write(fs.read('/home/codio/workspace/' + request.url))
  response.close()
}
http.listen(PORT, handleRequest);


// CONFIG



// start a casper test
casper.test.begin('Tags', function(test) {
  var failures = [];
  var fobj = object;
  
  casper.test.on("fail", function(failure) {
    fobj = casper.test.getFailures()
    failures.push(failure);
  });
  
  phantomcss.init({
    rebase: casper.cli.get('rebase')
  });

  // open page
  casper.start('http://localhost:3000/list1/list.html');

  // set your preferred view port size
  casper.viewport(1024, 768);

  casper.then(function() {
      this.mouse.move(120, 140);
  });
  
  casper.then(function() {
      // take the screenshot of the whole body element and save it under "body.png". The first parameter is actually a CSS selector
      phantomcss.screenshot('body', 'body');
  });

  casper.then(function now_check_the_screenshots() {
    // compare screenshots
    phantomcss.compareAll();
  });
  
  // run tests
  casper.run(function() {
    var exitCode = 0;
    if (failures.length > 0) {
      log(util.inspect(failures)
      exitCode = 1;
    } else {
      log('Well done, this is correct.')
    }
    casper.test.done(exitCode);
  });
});




