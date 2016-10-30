var models = require('../../../server/models');
var should = require('should');

describe('RegToken model', function () {
  var mockToken = {
    email: 'testuser@example.com',
    token: '$2a$10$wOB7qAOr3eRuR9fHBlQwruIPr7PgSkh3hqEApnPUCVe1N73UhdXcC'
  };

  beforeEach(function (done) {
    models.sequelize.sync({ force: true }).then(function () {
      done();
    });
  });

  afterEach(function (done) {
    models.sequelize.sync({ force: true }).then(function () {
      done();
    });
  });

  it('should create a token in the database', function (done) {
    models.RegToken.create(mockToken).then(function (token) {
      should.exist(token);
      token.token.should.equal(mockToken.token);
      done();
    });
  });
  it('should find reg token', function (done) {
    models.RegToken.create(mockToken).then(function (token) {
      models.RegToken.findById(token.id).then(function (_token) {
        should.exist(_token);
        _token.token.should.equal(mockToken.token);
        done();
      });
    });
  });
  it('should delete a token', function (done) {
    models.RegToken.create(mockToken).then(function (token) {
      models.RegToken.destroy({
        where: {
          id: token.id
        }
      }).then(function (affectedRows) {
        should.exist(affectedRows);
        affectedRows.should.equal(1);
        done();
      });
    });
  });
});