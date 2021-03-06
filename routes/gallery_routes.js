var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var db = require('./../models');

var User = db.User;
var Photo = db.Photo;

router.use(bodyParser.urlencoded({extended: true}));

router.get('/user', function (req, res){
  User.findAll()
    .then(function(users){
      res.render('users/index', {
        "Users" : users
      });
    });
});

router.post('/users', function (req, res) {
  User.create({ username: req.body.username })
    .then(function (user) {
      res.redirect('/gallery/user');
    });
});

router.route('/')
  .get(function (req, res){
    Photo.findAll()
      .then(function(photos){
        res.render('photos/index', {
          "Photos" : photos
        });
      });
  })
  .post(function (req, res) {
    User.find({
      where : {
        username : req.body.author
      }
    })
    .then(function(data){
      if(data.dataValues.id !== undefined){
        Photo.create({ author: req.body.author,
          link : req.body.link,
          description : req.body.description,
          UserId : data.dataValues.id })
          .then(function (gallery) {
            res.redirect('/gallery');
          });
      } else {
        throw new Error('Invalid author');
      }
    })
    .catch(function(err){
      res.send( {'success' : false});
    });
})
.put(function (req, res){
  Photo.findAll()
    .then(function(photos){
      res.render('photos/index', {
        "Photos" : photos
      });
    });
});

router.get('/new', function (req, res){
  res.render('photos/new', {
    "Photos" : req.body
  });
});

router.route('/:id')
.get(function (req, res){
  Photo.find({
    where : {
      id : req.params.id
    }
  })
  .then(function(data){
    res.render( 'photos/show', {
      "photo" : data.dataValues
    });
  })
  .catch(function(err){
    res.send({'success' : false});
  });
})
.put(function (req, res){
  Photo.find({
    where : {
      id : req.params.id
    }
  })
  .then(function(data){
      data.update({
        link : req.body.link,
        description : req.body.description });
      res.redirect('/gallery');
  })
  .catch(function(err){
    res.send( {'success' : false});
  });
})
.delete(function (req, res){
  Photo.destroy({
    where : {
      id : req.params.id
    }
  })
  .then(function(data){
    res.redirect('/gallery');
    })
  .catch(function(err){
    res.send({"success" : false});
  });
});

router.get('/:id/edit', function (req, res){
  Photo.find({
    where : {
      id : req.params.id
    }
  })
  .then(function(data){
    res.render( 'photos/edit', {
      "photo" : data.dataValues
    });
  })
  .catch(function(err){
    res.send({'success' : false});
  });
});

module.exports = router;