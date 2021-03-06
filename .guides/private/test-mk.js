ok
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

function lookupMime(filename, callback) {
  if (filename.indexOf('.css') !== -1) {
    callback('text/css') 
    return
  }
  require('child_process').execFile('file',
                                    ['-b', '--mime-type', filename ],
                                    null,
                                   function(err, stdout, stderr) {
    callback(stdout)
  } )
}

function handleRequest(request, response) {
  const filename = '/home/codio/workspace' + request.url
  response.statusCode = 200;
  lookupMime(filename, function(contentType) {
    response.setHeader("Content-Type", contentType)
    readMode = 'r'
    if (contentType.indexOf('image') === 0 ) {
      response.setEncoding('binary')
      readMode = 'b'
    }
    const content = require('fs').read(filename, {mode: readMode})
    response.write(content);
    response.close();
  })
}

http.listen(PORT, handleRequest);

// start a casper test
casper.test.begin('Tags', function(test) {
  var failures = [];
  
  casper.test.on("fail", function(failure) {
    failures.push(failure);
  });
  
  phantomcss.init({
    screenshotRoot: fs.absolute('/home/codio/workspace/screenshots/' + casper.cli.get('folder') ),
    failedComparisonsRoot: fs.absolute('/home/codio/workspace/' + casper.cli.get('folder') ),
    mismatchTolerance: 0.2,
    rebase: casper.cli.get('rebase')
  });

  // open page
  casper.start('http://localhost:3000/' + casper.cli.get('folder') + '/list.html');

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
      log('This is not correct. Please check the png file in the file tree to see the difference.')
      exitCode = 1;
    } else {
      log('That is correct')
    }
    casper.test.done(exitCode);
  });
});




