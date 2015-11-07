var http = require('http'),
    express = require('express');

var app = express();
var server = http.createServer(app);

server.listen(2323);

app.use(express.static(__dirname + '/public'));

console.log("server running, default localhost:2323");
