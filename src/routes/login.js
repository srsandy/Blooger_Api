const express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../model/users');
const Post = require('../model/post');

//GET ROUTES for rendering pages
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/regd', (req, res) => {
  res.render('regd');
});

router.get('/dash', isLoggedIn, (req, res) => {
  Post.find({}, function(err, post) {
    res.render('dash',{
     user: req.user,
     blogs: post.reverse()
    });
  });
});

router.get('/addNew', isLoggedIn, (req, res) => {
  res.render('addNew',{
    user: req.user
  });
});

router.get('/blog/:id', (req, res) => {
  Post.findOne({'_id': req.params.id}, function(err, data){
    res.render('blog',{
      user: req.user,
      blog: data
    })
  });
});

//POST ROUTE for signing up
router.post('/red', (req, res) => {

  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  req.checkBody('username', 'Name is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('role', 'Role is required').notEmpty();

  let errors = req.validationErrors();

  if(errors){
    res.render('regd', {
      errors:errors
    });
  }
  else{

    User.findOne({username: username}, function(err, data) {
      if(!data) {

        let newUser = new User({
          username: username,
          password: password,
          role: role
        });

        bcrypt.genSalt(10, function(err, salt){
          bcrypt.hash(newUser.password, salt, function(err, hash){
            if(err){
              console.log(err);
            }
            newUser.password = hash;
            newUser.save(function(err){
              if(err){
                console.log(err);
                return;
              }
              else {
                req.flash('success','You are now registered and can log in');
                res.redirect('/login');
              }
            });
          });
        });
      }
      else {
        req.flash('error', 'username already taken');
        res.redirect('/regd');
      }
    });
  }
});

router.post('/blog/:id/addComment', (req, res) =>{
  // console.log(req.params.id);
  // console.log(req.body);
  // console.log(req.user.username);
  let comment = {comment: req.body.comment, by: req.user.username }
  Post.update({'_id': req.params.id},{$push:{comments: comment}}, function(err, data){
    console.log(data);
    res.redirect('/blog/'+req.params.id);
  });
});

//POST ROUTE for adding post
router.post('/addThis', (req, res) => {
  console.log(req.body);
  let newPost = new Post({
    title: req.body.title,
    date: req.body.date,
    author: req.body.author,
    blog: req.body.blog
  });

  newPost.save(function(err) {
    if(err){
      console.log(err);
      return;
    }
    req.flash('success','Your post is added');
    res.redirect('/addNew');
  });

});

//POST ROUTE for login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect:'/dash',
    failureRedirect:'/login',
    failureFlash: true
  })(req, res, next);
});

//POST ROUTE for logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('login');
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}


module.exports = router;
