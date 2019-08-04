/*import/require the built-in
  http (webserver)
  url (url resolution & parsing)
  fs (file system)
modules*/
const http = require('http'),
  url = require('url'),
  fs = require('fs');

//create webserver using createServer() from the http module
http.createServer((request, response) => {
  var addr = request.url, //get the url from the request parameter
    q = url.parse(addr, true), //use parse() from the url module to get url info
    filePath = ''; //set filePath to be used later

    console.log(q.host);
    console.log(q.pathname);

    if (q.pathname.includes('documentation')) { //using indludes() check if q.pathname (from the parsed url) contains "documentation"
      filePath = (__dirname + '/documentation.html'); //if it does, combine it with __dirname to create the filePath
    } else {
      filePath = 'index.html'; //if it doesn't, send the user to the homepage
    }

    fs.readFile(filePath, function(err, data) { //use readFile() from fs module to get the specific (using filePath) file from the file server
      if (err) {
        throw err;
      }

      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write(data);
      response.end();

      fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Added to log.');
        }
      });

    });

}).listen(3000);
