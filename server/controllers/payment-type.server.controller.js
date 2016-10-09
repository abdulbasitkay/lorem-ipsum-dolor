'use strict';

var models = require('../models');


module.exports = {
  index: index,
  find: find,
  save: save,
  destroy: destroy,
  update: update
};

function index(req, res) {
  models.PaymentType.findAll().then(function (types) {
    return res.status(200).json(types);
  })
  .catch(function (err) {
    return res.status(500).json({ message: err.message });
  });
}

function find(req, res) {
  var id = req.params.id;
  models.PaymentType.findById(id).then(function (type) {
    return res.status(200).json(type);
  })
  .catch(function (err) {
    return res.status(500).json({ message: err.message });
  });
}

function save(req, res) {
  var type = req.body.type;
  models.PaymentType.create(type).then(function (type) {
    return res.status(200).json(type);
  })
  .catch(function (err) {
    return res.status(500).json({ message: err.message });
  });
}

function destroy(req, res) {
  var id = req.params.id;
  models.PaymentType.destroy({
    where: {
      id: id
    }
  }).then(function (affectedRows) {
    return res.status(200).json({ message: 'Payment type deleted' });
  })
  .catch(function (err) {
    return res.status(500).json({ message: err.message });
  });
}

function update(req, res) {
  var id = req.params.id;
  var type = req.body.type;
  models.PaymentType.update(type, {
    where: {
      id: id
    }
  }).then(function (affectedRows) {
    return res.status(200).json({ updated: true, type: type });
  })
  .catch(function (err) {
    res.status(500).json({ message: err.message });
  });
}