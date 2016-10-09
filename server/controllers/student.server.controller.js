'use strict';

var models = require('./../models');


module.exports = {
  find: find,
  update: update,
  destroy: destroy,
  save: save,
  index: index
};


function find(req, res) {
  var id = req.params.id;
  models.Student.findById(id).then(function (student) {
    return res.status(200).json(student);
  })
  .catch(function (error) {
    return res.status(500).json({ message: error.message });
  });
}

function update(req, res) {
  var id = req.params.id;
  var student = req.body.student;
  models.Student.update(student, {
    where: {
      id: id
    }
  }).then(function (affectedRows) {
    return res.status(200).json({ message: 'Student details updated', student: student });
  })
  .catch(function (error) {
    return res.status(500).json({ message: error.message });
  });
}

function destroy(req, res) {
  var id = req.params.id;
  models.Student.destroy({
    where: {
      id: id
    }
  }).then(function (affectedRows) {
    return res.status(200).json({ message: 'Student record deleted' });
  })
  .catch(function (error) {
    return res.status(500).json({ message: error.message });
  });
}

function save(req, res) {
  var student = models.Student.build(req.body.student);
  student.save().then(function (student) {
    return res.status(200).json(student);
  })
  .catch(function (error) {
    return res.status(500).json({ message: error.message });
  });
}

function index(req, res) {
  models.Student.findAll().then(function (students) {
    return res.status(200).json(students);
  })
  .catch(function (error) {
    return res.status(500).json({ message: error.message });
  });
}
