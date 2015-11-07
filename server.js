var express = require('express');
var r = require('rethinkdb');
var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8000;

// Load config for app
var config = require(__dirname+"/config.js");

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname+'/public'));

// set the home page route
app.get('/', function(req, res) {
  // ejs render automatically looks in the views folder
  res.sendfile('index.html');
});

app.get('/datasets/nzfapdc/species/:name', function(req, res) {
  var connection = null;
  r.connect(config.rethinkdb).then(function(conn) {
    connection = conn;
    return r.table('nzfapdc').filter({"Matched Scientific Name": req.params.name}).run(connection)
  }).then(function(cursor) {
    return cursor.toArray();
  }).then(function(result) {
    res.send(JSON.stringify(result));
  }).error(handleError(res))
  .finally(function(){connection.close()});
});

app.get('/datasets/nzfapdc/dropdown', function(req, res) {
  var connection = null;
  r.connect(config.rethinkdb).then(function(conn) {
    connection = conn;
    return r.db('test').table('nzfapdcDropdown').orderBy(r.desc('reduction')).limit(1000).run(connection);
  }).then(function(cursor) {
    return cursor.toArray();
  }).then(function(result) {
    res.send(JSON.stringify(result));
  }).error(handleError(res))
  .finally(function(){connection.close()});
});

app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});

/*
 * Send back a 500 error
 */
function handleError(res) {
    return function(error) {
        res.send(500, {error: error.message});
    }
}
