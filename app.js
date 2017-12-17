const express = require('express');
const path = require('path');
const open = require('open');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const expressValidator = require('express-validator');

const routes = require('./src/routes/login');
const database = require('./config/database');

//Express app setup
const PORT = 3030 || process.env.port;
const app = express();

//Cookie-Parser Body-Paser Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Set the views to pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Setting static files
app.use(express.static(path.join(__dirname,'public')));

//Express Session middleware
app.use(session({
  secret: 'kfadahsdjhad',
  resave: false,
  saveUninitialized: true
}));

//Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

//Routes to use
app.use('/',routes);


//Check for db connection and starts the server
database.connectDB(() => {
  app.listen(PORT, err =>{
    if(err) throw err;
    open('http://localhost:' + PORT);
  });
});
