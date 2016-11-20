
const models = require('../models');
const encrypter = require('../utils/token');
const mailer = require('../utils/mailer');
const mailRedirect = process.env.MAIL_REDIRECT;

module.exports = {
  index: index,
  find: find,
  destroy: destroy,
  update: update,
  save: save,
  sendMail: sendMail,
  findByUsername: findByUsername,
  findByEmail: findByEmail,
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
  const id = req.params.id;
  models.User.findById(id).then(function (user) {
    res.status(200).json(user);
  })
  .catch(function (error) {
    res.status(500).json({ message: error.message });
  });
}

function destroy(req, res) {
  const id = req.params.id;
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
  const user = req.body.user;
  models.User.create(user).then(function (user) {
    return res.status(200).json(user);
  })
  .catch(function (err) {
    return res.status(500).json({ message: err.message});
  });
}

function findByUsername(req, res) {
  const username = req.params.username;
  models.User.findOne({
    where: {
      username: username
    }
  }).then(function (user) {
    if(user) {
      return res.status(200).json(user);
    }
    return res.status(404).json({ message: 'User not found' });
  }).catch(function (err) {
    return res.status(500).json({message: err.message});
  });
}

function findByEmail(req, res) {
  const email = req.body.email;
  models.User.findOne({
    where: {
      emailAddress: email
    }
  }).then(function (user) {
    if(user) {
      return res.status(200).json(user);
    }
    return res.status(404).json({ message: 'User not found' })
  }).catch(function (err) {
    return res.status(500).json({ message: err.message });
  });
}

function sendMail(req, res) {
  const emailAddress = req.body.email;
  const hashString =  req.body.activationCode + '-' + emailAddress;
  const role = req.body.role;
  const subject = 'School Portal: Complete your registration';

  encrypter.createHash(hashString).then(function (hash) {
    const text = 'Welcome. Please follow this link to complete your registration ' +
      mailRedirect + '?token='  + encodeURIComponent(hash);
    const regToken = {
      token: hash,
      email: emailAddress,
      role: role,
    };
    mailer.sendMail(emailAddress, subject, text).then(function (info) {
      models.RegToken.create(regToken).then(function () {
        return res.status(200).json(info);
      }).catch(function (err) {
        res.status(500).json(err);
    });
    }).catch(function (err) {
      return res.status(500).json(err);
    });
  });
}
