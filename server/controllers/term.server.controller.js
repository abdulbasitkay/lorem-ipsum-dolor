

var models = require('../models');

module.exports = {
  find: find,
  index: index,
  save: save,
  update: update,
  destroy: destroy
};

function find(req, res) {
  var id = req.params.id;
  models.Term.findById(id).then(function (term) {
    return res.status(200).json(term);
  })
  .catch(function (err) {
    return res.status(500).json({ message: err.message });
  });
}

function index(req, res) {
  models.Term.findAll().then(function (terms) {
    return res.status(200).json(terms);
  })
  .catch(function (err) {
    return res.status(500).json({ message: err.message });
  });
}

function save(req, res) {
  var term = req.body.term;
  models.Term.create(term).then(function (term) {
    return res.status(200).json(term);
  })
  .catch(function (err) {
    return res.status(500).json({ message: err.message });
  });
}

function update(req, res) {
  var term = req.body.term;
  var id = req.params.id;
  models.Term.update(term, {
    where: {
      id: id
    }
  }).then(function () {
    return res.status(200).json(term);
  })
  .catch(function (err) {
    return res.status(500).json({ message: err.message });
  });
}

function destroy(req, res) {
  var id = req.params.id;
  models.Term.destroy({
    where: {
      id: id
    }
  }).then(function () {
    return res.status(200).json({message: 'Term deleted'});
  })
  .catch(function (err) {
    return res.status(500).json({ message: err.message });
  });
}
