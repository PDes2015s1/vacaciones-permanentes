var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Travel = mongoose.model('Travel');
var Destination = mongoose.model('Destination');
var User = mongoose.model('User');
var passport = require('passport');
var jwt = require('express-jwt');

var auth = jwt({
  secret: 'SECRET',
  userProperty: 'payload'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/travels', auth, function(req, res, next) {
  Travel.find({
    'user': req.payload._id
  }, function(err, travels) {
    if (err) {
      return next(err);
    }

    res.json(travels);
  });
});

router.post('/travels', auth, function(req, res, next) {
  var travel = new Travel(req.body);
  travel.user = req.payload._id;
  travel.save(function(err, travel) {
    if (err) {
      return next(err);
    }

    res.json(travel);
  });
});

var removeTravel = function(req, res, next) {
  req.travel.remove(function(err) {
    if (err) throw err;
    res.json();
  });
}

var checkPermission = function(req,res, next) {
  if (req.travel.user != req.payload._id)
    return res.status(500).json({
      message: 'Usuario no autorizado'
    });
  else {
    return next();
  }  
}

router.put('/travels/:travel', removeTravel);

router.get('/travels/:travel', function(req, res, next) {
  req.travel.populate('destinations', function(err, travel) {
    if (err) {
      return next(err);
    }

    res.json(travel);
  });
});

router.post('/travels/:travel/destinations', auth, function(req, res, next) {
  var destination = new Destination(req.body);
  destination.travel = req.travel;

  destination.save(function(err, destination) {
    if (err) {
      return next(err);
    }

    req.travel.destinations.push(destination);
    req.travel.save(function(err, travel) {
      if (err) {
        return next(err);
      }

      res.json(destination);
    });
  });
});

router.post('/register', function(req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: 'Please fill out all fields'
    });
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function(err) {
    if (err) {
      return next(err);
    }

    return res.json({
      token: user.generateJWT()
    })
  });
});

router.post('/login', function(req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: 'Please fill out all fields'
    });
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (user) {
      return res.json({
        token: user.generateJWT()
      });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

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

var params = function(model, field) {
  return function(req, res, next, id) {
    setParam(req, res, next, id, model, field);
  };
}

router.param('travel', params(Travel, 'travel'));
router.param('destination', params(Destination, 'destination'));

module.exports = router;
