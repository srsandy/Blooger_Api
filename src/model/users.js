const mongoose = require('mongoose');

// Define the schema for our user model
let UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
});

const User = module.exports = mongoose.model('User', UserSchema);



