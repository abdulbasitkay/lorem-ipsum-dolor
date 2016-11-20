const models = require('../models');


module.exports = {
  save: save,
  find: find,
  destroy: destroy,
  match: match,
  findByEmail: findByEmail,
};



function save(req, res) {
  const token = req.body.token;
  models.RegToken.create(token).then(function (_token) {
    return res.status(200).json(_token);
  }).catch(function (err) {
    return res.status(500).json(err);
  });
}

function find(req, res) {
  models.RegToken.findById(req.params.id).then(function (token) {
    if(token) {
      return res.status(200).json(token);
    }
    return res.status(404).json({ message: 'token not found' });
  }).catch(function (err) {
    return res.status(500).json(err);
  });
}

function destroy(req, res) {
  models.RegToken.destroy({
    where: {
      id: req.params.id
    }
  }).then(function () {
    return res.status(200).json({ message: 'Token deleted' });
  }).catch(function (err) {
    return res.status(500).json(err);
  });
}

function match(req, res) {
  const email = req.body.email;
  const token = req.body.token;
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

function findByEmail(req, res) {
  models.RegToken.findOne({
    where: {
      email: req.body.email
    }
  }).then(function (token) {
    if(token) {
      return res.status(200).json(token);
    }
    return res.status(404).json({ message: 'Token not found' });
  }).catch(function (err) {
    return res.status(500).json(err);
  });
}
