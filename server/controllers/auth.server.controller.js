var models = require('./../models');
var TokenGen = require('./../utils/token');


module.exports = {
  login: login,
  getToken: getToken,
  matchTokens: matchTokens,
};

function login(req, res) {
  var email = req.body.user.email;
  var password = req.body.user.password;
  models.User.findOne({
    where: {
      email: email
    }
  }).then(function (user) {
    if(!user) {
      return res.status(404).json({ message: 'User account does not exist' });
    }
    user.matchPasswords(password, user.password).then(function () {
      return res.status(200).json({ user: user, token: TokenGen.createToken(user)});
    })
    .catch(function () {
      return res.status(409).json({ message: 'Invalid username or password' });
    });
  })
  .catch(function (err) {
    return res.status(500).json({ message: err.message });
  });
}

function matchTokens(req, res) {
  var email = req.body.email;
  var token = req.body.token;
  models.RegToken.findOne({
    where: {
      email: email,
      token: token
    }
  }).then(function (result) {
    if(result) {
      return res.status(200).json({
        success: true,
        message: 'Confirmation token found',
        role: result.role
      });
    }
    return res.status(404).json({ success: false, message: 'Confirmation token not found' });
  }).catch(function (err) {
    return res.status(500).json({ message: err.message });
  });
}

function getToken(req, res) {
  var emailAddress = req.params.email;
  models.RegToken.findOne({
    where: {
      email: emailAddress
    }
  }).then(function (token) {
    if(token) {
      return res.status(200).json(token);
    }
    return res.status(404).json({ message: 'Token not found' });
  }).catch(function (err) {
    return res.status(500).json({ message: err.message });
  });
}
