const mongoose = require('mongoose');

let _db;

mongoose.connect('mongodb://localhost/Blogger');

//Check for db connection and starts the server
function connectDB(run_server) {
  _db = mongoose.connection;

  _db.once('open', () => {
    run_server();
  });

  _db.on('error', err => {
    if(err) throw err;
  });

}

module.exports = {
    connectDB : connectDB
}
