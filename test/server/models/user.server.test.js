var should = require('should')
models = require('../../../server/models');


describe('User Model', function () {
  var mockUser = {
    username: 'kellybone',
    password: 'testpasword',
    emailAddress: 'kellybone@example.com',
    firstName: 'Kelly',
    lastName: 'Bone'
  };

  var mockRole = {
    name: 'admin'
  };

  beforeEach(function (done) {
    models.sequelize.sync({ force: true }).then(function () {
      models.Role.create(mockRole).then(function (role) {
        mockUser.RoleId = role.id;
        done();
      });
    });
  });
  afterEach(function (done) {
    models.sequelize.sync({ force: true }).then(function () {
      done();
    });
  });

  it('should create a user in the database', function (done) {
    models.User.create(mockUser).then(function (user) {
      should.exists(user);
      user.username.should.equal(mockUser.username);
      user.firstName.should.equal(mockUser.firstName);
      done();
    });
  });

  it('should update a user in the database', function (done) {
    models.User.create(mockUser).then(function (user) {
      should.exist(user);
      user.username = 'kellyadams';
      user.save().then(function (user) {
        should.exist(user);
        user.username.should.not.equal(mockUser.username);
        done();
      });
    });
  });

  it('should delete a user from the database', function (done) {
    models.User.create(mockUser).then(function (user) {
      should.exist(user);
      models.User.destroy({
        where: {
          id: user.id
        }
      }).then(function (user) {
        should.exist(user);
        user.should.equal(1);
        done();
      });
    });
  });

  it('should find a user from the database', function (done) {
    models.User.create(mockUser).then(function(user) {
      should.exist(user);
      models.User.findOne({
        where: {
          id: user.id
        }
      }).then(function (user) {
        should.exist(user);
        user.username.should.equal(mockUser.username);
        done();
      });
    });
  });

  it('should return a JSON object without a password', function (done) {
    models.User.create(mockUser).then(function (user) {
      should.exist(user);
      userJSON = user.toJSON();
      should.not.exist(userJSON.password);
      done();
    });
  });
});
