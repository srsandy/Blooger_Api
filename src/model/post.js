const mongoose = require('mongoose');

// Define the schema for our post model
let PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  blog: {
    type: String,
    required: true
  },
  comments: []
});

const Post = module.exports = mongoose.model('Post', PostSchema);
