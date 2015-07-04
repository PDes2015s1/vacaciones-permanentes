var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var router = express.Router();
var jwt = require('express-jwt');

require('./models/Users');
require('./models/Travels');
require('./models/PointsOfInterest');
require('./models/Destinations');
require('./config/passport');

var User = mongoose.model('User');
var Travel = mongoose.model('Travel');
var Destination = mongoose.model('Destination');
var PointOfInterest = mongoose.model('PointOfInterest');

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
};

global.params = function(model, field) {
  return function(req, res, next, id) {
    setParam(req, res, next, id, model, field);
  };
};

global.checkPermission = function(req, res, next) {
  if ((req.travel && req.travel.user != req.payload._id) || (req.destination && req.destination.user != req.payload._id))
    return res.status(401).json({
      message: 'Usuario no autorizado'
    });
  else {
    return next();
  }
};

//End Functions Globals

var index = require('./routes/index');
var travels = require('./routes/travels');
var destinations = require('./routes/destinations');

var app = express();

var auth = jwt({
  secret: 'SECRET',
  userProperty: 'payload'
});

//Router travels
router.get('/travels', auth, travels.all);
router.post('/travels', auth, travels.create);
router.delete('/travels/:travel', auth, checkPermission, travels.remove);
router.get('/travels/:travel', auth, checkPermission, travels.get);

router.param('travel', params(Travel, 'travel'));
//End router travels

//Router destinations
router.post('/travels/:travel/destinations', auth, checkPermission, destinations.create);
router.get('/destinations/:destination', auth, checkPermission, destinations.get);
router.post('/destinations/:destination/pointsOfInterest', auth, checkPermission, destinations.createPoint);
router.post('/destinations/:destination/lodging', auth, checkPermission, destinations.createLodging);
router.delete('/destinations/:destination/:pointOfInterest', auth, checkPermission, destinations.removePoint);
router.delete('/travels/:travel/:destination/dest', auth, checkPermission, destinations.remove);

router.param('travel', params(Travel, 'travel'));
router.param('destination', params(Destination, 'destination'));
router.param('pointOfInterest', params(PointOfInterest, 'pointOfInterest'));
//End router destinations


//Router index
router.get('/', index.index);
router.post('/register', index.register);
router.post('/login', index.login);

//End router index

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

app.use('/', router);

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
    console.log(err);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

var mongodb_base_url = mongodb://localhost/;

if(process.env.OPENSHIFT_MONGODB_DB_URL){
  mongodb_base_url = process.env.OPENSHIFT_MONGODB_DB_URL;
}

if (app.get('env') === 'development') {
  /* Connect to the DB */
  mongoose.connect(mongodb_base_url + 'travelstest', function() {
    /* Drop the DB */
    mongoose.connection.db.dropDatabase();
  });
} else {
  mongoose.connect(mongodb_base_url + 'travels');
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
  };
};

router.get('/view/home', myRender('home'));
router.get('/view/travels/all', myRender('travels/all'));
router.get('/view/travels/detail', myRender('travels/detail'));
router.get('/view/login', myRender('users/login'));
router.get('/view/register', myRender('users/register'));
router.get('/view/destinations/detail', myRender('destinations/detail'));

module.exports = app;