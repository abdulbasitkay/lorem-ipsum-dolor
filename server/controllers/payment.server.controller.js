'use strict';

var models = require('./../models');

module.exports = {
  index: index,
  save: save,
  find: find,
  update: update,
  destroy: destroy
}


function index(req, res) {
  models.Payment.findAll().then(function (payments) {
    return res.status(200).json(payments);
  })
  .catch(function (error) {
    return res.status(500).json({ message: error.message });
  });
}

function save(req, res) {
  var payment = req.body.payment;
  models.Payment.create(payment).then(function (payment) {
    return res.status(200).json(payment);
  })
  .catch(function (error) {
    return res.status(500).json({ message: error.message });
  });
}

function find(req, res) {
  var id = req.params.id;
  models.Payment.findById(id).then(function (payment) {
    return res.status(200).json(payment);
  })
  .catch(function (error) {
    return res.status(500).json({ message: error.message });
  });
}

function update(req, res) {
  var id = req.params.id;
  var payment = req.body.payment;
  models.Payment.update(payment, {
    where: {
      id: id
    }
  }).then(function (affectedRows) {
    return res.status(200).json({ updated: true, payment: payment });
  })
  .catch(function (error) {
    return res.status(500).json({ message: error.message });
  });
}

function destroy(req, res) {
  var id = req.params.id;
  models.Payment.destroy({
    where: {
      id:id
    }
  }).then(function (affectedRows) {
    return res.status(200).json({ message: 'Payment deleted' });
  })
  .catch(function (error) {
    return res.status(500).json({ message: error.message });
  });
}
