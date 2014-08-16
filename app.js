// basic express app
var express = require('express');
var app = express();

// set static folder to serve assets from
app.use(express.static(__dirname + '/public'));

// serve all requests to index.html in public folder
app.get('*', function(req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

// listen
port = process.env.PORT || process.argv[2] || 8888;
app.listen(port, '0.0.0.0');

console.log('Static server listening on port ' + port + '.');
