var models = require('../../../server/models');
var should = require('should');

describe('Student model', function () {
  var mockUser = {
    username: 'kellybone',
    password: 'testpasword',
    emailAddress: 'kellybone@example.com',
    firstName: 'Kelly',
    lastName: 'Bone'
  };

  var mockStudent = {
    parentName: 'Kay Terrence',
    address: '23rd & West, some place',
    parentPhone: '897878878'
  };

  var mockRole = {
    name: 'student'
  };

  beforeEach(function (done) {
    models.sequelize.sync({ force: true }).then(function () {
      models.Role.create(mockRole).then(function (role) {
        mockUser.RoleId = role.id;
        models.User.create(mockUser).then(function(user) {
          mockStudent.UserId = user.id;
          done();
        });
      });
    });
  });

  afterEach(function (done) {
    models.sequelize.sync({ force: true }).then(function () {
      done();
    });
  });

  it('should create a student in the database', function (done) {
    models.Student.create(mockStudent).then(function (student) {
      should.exist(student);
      student.address.should.equal(mockStudent.address);
      done();
    });
  });

  it('should find a student in the database', function (done) {
    models.Student.create(mockStudent).then(function (student) {
      models.Student.findOne({
        where: {
          id: student.id
        }
      }).then(function (_student) {
        should.exist(_student);
        _student.parentName.should.equal(student.parentName);
        done();
      });
    });
  });

  it('should update a student in the database', function (done) {
    models.Student.create(mockStudent).then(function (student) {
      should.exist(student);
      student.parentPhone = '43554334';
      student.save().then(function (_student) {
        should.exist(_student);
        _student.parentPhone.should.equal('43554334');
        done();
      });
    });
  });

  it('should delete a student from the database', function (done) {
    models.Student.create(mockStudent).then(function (student) {
      should.exist(student);
      models.Student.destroy({
        where: {
          id: student.id
        }
      }).then(function (affectedRows) {
        should.exist(affectedRows);
        affectedRows.should.equal(1);
        done();
      });
    });
  });
});
