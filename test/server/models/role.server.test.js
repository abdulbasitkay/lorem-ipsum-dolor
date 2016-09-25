var should = require('should')
  models = require('../../../server/models');


describe('Role model', function () {
  var mockRole = {
    name: 'Admin',
  }
  var mockUser = {
    username: 'kellybone',
    password: 'testpasword',
    emailAddress: 'kellybone@example.com',
    firstName: 'Kelly',
    lastName: 'Bone'
  };

  beforeEach(function (done) {
    models.sequelize.sync().then(function () {
      done();
    });
  });

  afterEach(function (done) {
    models.sequelize.sync().then(function () {
      done();
    });
  });

  it('should create a role in the database', function (done) {
    models.Role.create(mockRole).then(function (role) {
      should.exist(role);
      role.name.should.equal(mockRole.name);
      done();
    });
  });

  it('should find a role in the database', function (done) {
    models.Role.create(mockRole).then(function (role) {
      should.exist(role);
      models.Role.findOne({
        where: {
          id: role.id
        }
      }).then(function (_role) {
        should.exist(_role);
        _role.id.should.equal(role.id);
        done();
      });
    });
  });

  it('should update a role in the database', function (done) {
    models.Role.create(mockRole).then(function (role) {
      should.exist(role);
      role.name = 'Staff';
      role.save().then(function (_role) {
        should.exist(_role);
        _role.name.should.equal('Staff');
        done();
      });
    });
  });

  it('should delete a role in the database', function (done) {
    models.Role.create(mockRole).then(function (role) {
      should.exist(role);
      models.Role.destroy({
        where: {
          id: role.id
        }
      }).then(function (numAffected) {
        numAffected.should.equal(1);
        done();
      });
    });
  });
});
