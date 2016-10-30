var models = require('./../models');
var TokenGen = require('./../utils/token');


module.exports = {
  login: login
}

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
    user.matchPasswords(password, user.password).then(function (matched) {
      return res.status(200).json({ user: user, token: TokenGen.createToken(user)});
    })
    .catch(function (err) {
      return res.status(409).json({ message: 'Invalid username or password' });
    });
  })
  .catch(function (err) {
    return res.status(500).json({ message: err.message });
  });
}