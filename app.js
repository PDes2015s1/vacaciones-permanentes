var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
require('./models/Users');
require('./models/Travels');
require('./models/PointsOfInterest');
require('./models/Destinations');
require('./config/passport');

//mongoose.connect('mongodb://localhost/travels');

//Functions Globals

var setParam = function(req, res, next, id, model, field) {
  var query = model.findById(id);

  query.exec(function(err, value) {
    if (err) {
      return next(err);
    }
    if (!value) {
      return next(new Error('can\'t find ' + field));
    }

    req[field] = value;
    return next();
  });
}

global.params = function(model, field) {
  return function(req, res, next, id) {
    setParam(req, res, next, id, model, field);
  };
}

global.checkPermission = function(req, res, next) {
  if ((req.travel && req.travel.user != req.payload._id) || (req.destination && req.destination.user != req.payload._id))
    return res.status(401).json({
      message: 'Usuario no autorizado'
    });
  else {
    return next();
  }
}

//End Functions Globals

var routes = require('./routes/index');
var travels = require('./routes/travels');
var users = require('./routes/users');
var destinations = require('./routes/destinations');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(passport.initialize());
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use('/', routes);
app.use('/', travels);
app.use('/', destinations);
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

if (app.get('env') === 'development') {
  /* Connect to the DB */
  mongoose.connect('mongodb://localhost/travelstest', function() {
    /* Drop the DB */
    mongoose.connection.db.dropDatabase();
  });
} else {
  mongoose.connect('mongodb://localhost/travels');
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

// templates

var myRender = function(view) {
  return function(req, res) {
    res.render(view, {
      title: 'Vacacioner permanentes'
    });
  }
}

routes.get('/view/home', myRender('home'))
routes.get('/view/travels/all', myRender('travels/all'))
routes.get('/view/travels/detail', myRender('travels/detail'))
routes.get('/view/login', myRender('users/login'))
routes.get('/view/register', myRender('users/register'))
routes.get('/view/destinations/detail', myRender('destinations/detail'))

module.exports = app;