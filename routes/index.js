var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Travel = mongoose.model('Travel');
var Comment = mongoose.model('Comment');
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
  Travel.find({'author':req.payload.username},function(err, travels) {
    if (err) {
      return next(err);
    }

    res.json(travels);
  });
});

router.post('/travels', auth, function(req, res, next) {
  var travel = new Travel(req.body);
  travel.author = req.payload.username;
  travel.save(function(err, travel) {
    if (err) {
      return next(err);
    }

    res.json(travel);
  });
});

router.get('/travels/:travel', function(req, res, next) {
  req.travel.populate('comments', function(err, travel) {
    if (err) {
      return next(err);
    }

    res.json(travel);
  });
});

router.put('/travels/:travel/upvote', auth, function(req, res, next) {
  req.travel.upvote(function(err, travel) {
    if (err) {
      return next(err);
    }

    res.json(travel);
  });
});

router.put('/travels/:travel/comments/:comment/upvote', auth, function(req, res, next) {
  req.comment.upvote(function(err, comment) {
    if (err) {
      return next(err);
    }

    res.json(comment);
  });
});

router.post('/travels/:travel/comments', auth, function(req, res, next) {
  req.body.created_at = new Date();
  var comment = new Comment(req.body);
  comment.travel = req.travel;
  comment.author = req.payload.username;

  comment.save(function(err, comment) {
    if (err) {
      return next(err);
    }

    req.travel.comments.push(comment);
    req.travel.save(function(err, travel) {
      if (err) {
        return next(err);
      }

      res.json(comment);
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

router.param('travel', function(req, res, next, id) {
  var query = Travel.findById(id);

  query.exec(function(err, travel) {
    if (err) {
      return next(err);
    }
    if (!travel) {
      return next(new Error('can\'t find travel'));
    }

    req.travel = travel;
    return next();
  });
});

router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function(err, comment) {
    if (err) {
      return next(err);
    }
    if (!comment) {
      return next(new Error('can\'t find comment'));
    }

    req.comment = comment;
    return next();
  });
});

module.exports = router;