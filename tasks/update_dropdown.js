r = require('rethinkdb');

var connection = null;
r.connect({host: 'localhost', port: 28015}, function(err, conn) {
  if (err) throw err;
  connection = conn;
  populateTable();
});

var populateTable = function() {
  var query = r.db('test').table('nzfapdc').group("Matched Scientific Name").count().ungroup().orderBy(r.desc('reduction'));

  r.db('test').tableDrop('nzfapdcDropdown').run(connection).then(function(){
    return r.db('test').tableCreate('nzfapdcDropdown').run(connection)
  }).then(function(){
    return query.run(connection);
  }).then(function(cursor){
    return cursor.toArray()
  }).then(function(results){
    return r.db('test').table('nzfapdcDropdown').insert(results).run(connection);
  }).error(function(err) {
    if (err) throw err;
  }).finally(function(){
    connection.close();
  });
};
