var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var HttpStrategy = require('passport-http').BasicStrategy;
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
//register middleware.
app.use(bodyParser());
app.use(cookieParser());
//bodyparse and cookieparser have to be used before passport.
app.use(expressSession({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());

function varifyCredentials(username, password, done){
    //pretend this is real DB. start working if user info correct. 
  if(username===password){
      console.log('passport.use called');
      return done(null, { id:username, name:username});
    }else{
      return done(null,null);
    }
}

passport.use(new HttpStrategy(varifyCredentials));

passport.use(new LocalStrategy(varifyCredentials));

passport.serializeUser(function(user, done) {
  console.log(done);
  done(null, user.id);
});

passport.deserializeUser(function(id,done){
    //query DB using is.
   console.log("deserialized id: "+ id);
    done(null,{ id: id, name: id});
});


//
app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});





// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
