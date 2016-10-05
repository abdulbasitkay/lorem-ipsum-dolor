'use strict';

var models = require('../models');

module.exports = {
  index: index,
  find: find,
  destroy: destroy,
  update: update
}

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
  }).then(function (affectedRows) {
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
