
var models = require('../models');
var encrypter = require('../utils/token');
var mailer = require('../utils/mailer');
var mailRedirect = process.env.MAIL_REDIRECT;

module.exports = {
  index: index,
  find: find,
  destroy: destroy,
  update: update,
  save: save,
  sendMail: sendMail
};

function index(req, res) {
  models.User.findAll().then(function (users) {
    return res.status(200).json(users);
  })
  .catch(function (error) {
    return res.status(500).json({ message: error.message});
  });
}

function find(req, res) {
  var id = req.params.id;
  models.User.findById(id).then(function (user) {
    res.status(200).json(user);
  })
  .catch(function (error) {
    res.status(500).json({ message: error.message });
  });
}

function destroy(req, res) {
  var id = req.params.id;
  models.User.destroy({
    where: {
      id:id
    }
  }).then(function () {
    res.status(200).json({ message: 'User account deleted' });
  })
  .catch(function (error) {
    res.status(500).json({ message: error.message });
  });
}


function update(req, res) {
  models.User.upsert(req.body).then(function (updated) {
    res.status(200).json({ updated: updated, user: req.body });
  })
  .catch(function (error) {
    res.status(500).json({ message: error.message });
  });
}

function save(req, res) {
  var user = req.body.user;
  models.User.create(user).then(function (user) {
    return res.status(200).json(user);
  })
  .catch(function (err) {
    return res.status(500).json({ message: err.message});
  });
}

function sendMail(req, res) {
  var emailAddress = req.body.email;
  var hashString =  req.body.activationCode + '-' + emailAddress;
  var subject = 'School Portal: Complete your registration';

  encrypter.createHash(hashString).then(function (hash) {
    var text = 'Welcome. Please follow this link to complete your registration ' +
      mailRedirect + '?token='  + hash;
    var regToken = {
      token: hash,
      email: emailAddress
    };
    mailer.sendMail(emailAddress, subject, text).then(function (info) {
      models.RegToken.create(regToken).then(function () {
        return res.status(200).json(info);
      }).catch(function (err) {
        res.status(500).json(err);
      })
    }).catch(function (err) {
      return res.status(500).json(err);
    });
  });
}