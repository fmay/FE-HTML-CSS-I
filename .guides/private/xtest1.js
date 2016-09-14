
// Suppress console.log
const log_original = console.log

// Alternate function to call to send console messages back to Guide
const log = function() {
  return log_original.apply(console, arguments)
}
console.log = function () {}

// Start web server
var phantomcss = require('phantomcss');
var http = require('webserver').create();
const PORT = 3000

function handleRequest(request, response){
  response.statusCode = 200
  response.write(fs.read('/home/codio/workspace/' + request.url))
  response.close()
}
http.listen(PORT, handleRequest);

// start a casper test
casper.test.begin('Tags', function(test) {
  var failures = [];
  
  casper.test.on("fail", function(failure) {
    failures.push(failure);
  });
  
  phantomcss.init({
    //screenshotRoot: fs.absolute('/home/codio/workspace/.guides/x'),
    //comparisonResultRoot: fs.absolute('/home/codio/workspace/.guides/y'),
    failedComparisonsRoot: fs.absolute('/home/codio/workspace/list1'),
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
      log('failed')
      exitCode = 1;
    } else {
      log('That is correct')
    }
    casper.test.done(exitCode);
  });
});




