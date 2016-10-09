'use strict';

var Q = require('q'),
  should = require('should'),
  httpMocks = require('node-mocks-http'),
  models = require('../../../server/models'),
  controllers = require('../../../server/controllers');

var id, res, error, mockUser, mockRole;

describe('UserController', function () {
  error = { message: 'An error occurred' };

  mockUser = {
    username: 'kellybone',
    password: 'testpasword',
    emailAddress: 'kellybone@example.com',
    firstName: 'Kelly',
    lastName: 'Bone'
  };

  mockRole = {
    name: 'admin'
  };

  beforeEach(function (done) {
    res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    models.sequelize.sync({ force: true }).then(function () {
      models.Role.create(mockRole).then(function (role) {
        mockUser.RoleId = role.id;
        models.User.create(mockUser).then(function (user) {
          id = user.id;
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

  describe('index', function () {

    describe('No Errors', function () {
      it('should return all users in the database', function (done) {
        var req = httpMocks.createRequest();
        controllers.userController.index(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          data.should.be.instanceOf(Array);
          data.length.should.equal(1);
          done();
        });
      });
    });

    describe('Errors', function () {
      var promise = models.User.findAll;

      before(function () {
        var deferred = Q.defer();
        models.User.findAll = function () {
          return deferred.promise;
        };
        deferred.reject(error);
      });

      after(function () {
        models.User.findAll = promise;
      });

      it('should return a 500 status code', function (done) {
        var req = httpMocks.createRequest();
        controllers.userController.index(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(500);
          data.message.should.be.exactly(error.message);
          done();
        });
      });
    });
  });

  describe('find', function () {

    describe('No Errors', function () {
      it('should find a user in the database', function (done) {
        var req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        controllers.userController.find(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          should.exist(data);
          done();
        });
      });
    });

    describe('Errors', function () {
      var promise = models.User.findById;

      before(function () {
        var deferred = Q.defer();
        models.User.findById = function () {
          return deferred.promise;
        };
        deferred.reject(error);
      });
      after(function () {
        models.User.findById = promise;
      });
      it('should return status code 500', function (done) {
        var req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        controllers.userController.find(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(500);
          data.message.should.be.exactly(error.message);
          done();
        });
      });
    });
  });

  describe('destroy', function () {
    describe('No Errors', function () {
      it('should delete a record from the database', function (done) {
        var req = httpMocks.createRequest({
          params: {
            id: id
          }
        });

        controllers.userController.destroy(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          data.message.should.equal('User account deleted');
          done();
        });
      });
    });
    describe('Errors', function () {
      var promise = models.User.destroy;
      before(function () {
        var deferred = Q.defer();
        models.User.destroy = function () {
          return deferred.promise;
        };
        deferred.reject(error);
      });
      after(function () {
        models.User.destroy = promise;
      });
      it('should return status code 500', function (done) {
        var req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        controllers.userController.destroy(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(500);
          data.message.should.be.exactly(error.message);
          done();
        });
      });
    });
  });

  describe('update', function () {
    describe('No Errors', function () {
      it('should update a user', function (done) {
        mockUser.username = 'AndersonRoberts';
        var req = httpMocks.createRequest({
          params: {
            id: id
          },
          body: mockUser
        });
        controllers.userController.update(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          data.updated.should.equal(true);
          data.user.username.should.be.exactly('AndersonRoberts');
          done();
        });
      });
    });
    describe('Errors', function () {
      var promise = models.User.upsert;
      before(function () {
        var deferred = Q.defer();
        models.User.upsert = function () { return deferred.promise; };
        deferred.reject(error);
      });
      after(function () {
        models.User.upsert = promise;
      });
      it('should return status code 500', function (done) {
        mockUser.username = 'AndersonRoberts';
        var req = httpMocks.createRequest({
          params: {
            id: id
          },
          body: mockUser
        });
        controllers.userController.update(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(500);
          data.message.should.equal(error.message);
          done();
        });
      });
    });
  });
  describe('#save', function () {
    describe('No Errors', function () {
      it('should save a user', function (done) {
        var req = httpMocks.createRequest({
          body: {
            user: mockUser
          }
        });
        controllers.userController.save(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          should.exist(data);
          res.statusCode.should.equal(200);
          data.username.should.equal(mockUser.username);
          done();
        });
      });
    });
    // describe('Errors', function () {
    //   var promise = models.User.create;
    //   before(function () {
    //     var deferred = Q.defer();
    //     models.User.create = function () { return deferred.promise; };
    //     deferred.reject(error);
    //   });
    //   after(function () {
    //     models.User.create = promise;
    //   });
    //   it('should return status code 500', function (done) {
    //     var req = httpMocks.createRequest({
    //       body: {
    //         user: mockUser
    //       }
    //     });
    //     controllers.userController.save(req, res);
    //     res.on('end', function () {
    //       console.log(res._getData());
    //       var data = JSON.parse(res._getData());
    //       res.statusCode.should.equal(500);
    //       data.message.should.equal(error.message);
    //       done();
    //     });
    //   });
    // });
  });
});
