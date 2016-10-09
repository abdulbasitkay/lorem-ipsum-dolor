'use strict';

var models = require('../models');

module.exports = {
  index: index,
  find: find,
  update: update,
  destroy: destroy,
  save: save
};


function index(req, res) {
  models.Role.findAll().then(function (roles) {
    return res.status(200).json(roles);
  })
  .catch(function(error) {
    return res.status(500).json({ message: error.message });
  });
}

function find(req, res) {
  var id = req.params.id;
  models.Role.findById(id).then(function (role) {
    return res.status(200).json(role);
  })
  .catch(function (err) {
    return res.status(500).json({ message: err.message });
  });
}

function update(req, res) {
  var id = req.params.id;
  var role = req.body.role;
  models.Role.update(role, {
    where: {
      id: id
    }
  }).then(function (affectedRows) {
    return res.status(200).json(role);
  }).catch(function (err) {
    return res.status(500).json({ message: err.message });
  });
}

function destroy(req, res) {
  var id = req.params.id;
  models.Role.destroy({
    where: {
      id: id
    }
  }).then(function (deletedRows) {
    return res.status(200).json({ message: 'Role deleted' });
  })
  .catch(function (err) {
    return res.status(500).json({ message: err.message });
  });
}

function save(req, res) {
  var role = req.body.role;
  models.Role.create(role).then(function () {
    return res.status(200).json(role);
  })
  .catch(function (err) {
    return res.status(500).json({ message: err.message });
  });
}
