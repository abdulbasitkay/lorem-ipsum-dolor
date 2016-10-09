'use strict';

var Q = require('q');
var should = require('should');
var httpMocks = require('node-mocks-http');
var models = require('../../../server/models');
var controllers = require('../../../server/controllers');

var id, mockRole, res, req;

describe('Roles controller', function () {
  mockRole = {
    name: 'Admin'
  };

  beforeEach(function (done) {
    res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    models.sequelize.sync({ force: true }).then(function () {
      models.Role.create(mockRole).then(function (role) {
        id = role.id;
        done();
      });
    });
  });

  afterEach(function (done) {
    models.sequelize.sync({ force: true }).then(function () {
      done();
    });
  });

  describe('No Errors', function () {
    it('#index should fetch all roles in the datbase', function (done) {
      req = httpMocks.createRequest();
      controllers.rolesController.index(req, res);
      res.on('end', function () {
        var data = JSON.parse(res._getData());
        res.statusCode.should.equal(200);
        data.should.be.instanceOf(Array);
        done();
      });
    });

    it('#find should find a role with specified id in the database', function (done) {
      req = httpMocks.createRequest({
        params: {
          id: id
        }
      });

      controllers.rolesController.find(req, res);
      res.on('end', function () {
        var data = JSON.parse(res._getData());
        res.statusCode.should.equal(200);
        data.name.should.equal(mockRole.name);
        done();
      });
    });

    it('#update should update a record in the database', function (done) {
      mockRole.name = 'Super Admin';
      req = httpMocks.createRequest({
        params: {
          id: id
        },
        body: {
          role: mockRole
        }
      });
      controllers.rolesController.update(req, res);
      res.on('end', function () {
        var data = JSON.parse(res._getData());
        res.statusCode.should.equal(200);
        data.name.should.equal('Super Admin');
        done();
      });
    });

    it('#destroy should delete a record in the database', function (done) {
      req = httpMocks.createRequest({
        params: {
          id: id
        }
      });
      controllers.rolesController.destroy(req, res);
      res.on('end', function () {
        var data = JSON.parse(res._getData());
        res.statusCode.should.equal(200);
        data.message.should.equal('Role deleted');
        done();
      });
    });
    it('#save should save a record', function (done) {
      mockRole.name = 'Super Admin';
      req = httpMocks.createRequest({
        body: {
          role: mockRole
        }
      });
      controllers.rolesController.save(req, res);
      res.on('end', function () {
        var data = JSON.parse(res._getData());
        should.exist(data);
        data.name.should.equal('Super Admin');
        done();
      });
    });
  });

  describe('Errors', function () {
    var error = { message: 'An error ocurred' };
    var deferred = Q.defer();
    describe('#index', function () {
      var promise = models.Role.findAll;
      before(function () {
        models.Role.findAll = function () { return deferred.promise; };
        deferred.reject(error);
      });
      after(function () {
        models.Role.findAll = promise;
      });

      it('should return status code 500', function (done) {
        req = httpMocks.createRequest();
        controllers.rolesController.index(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(500);
          data.message.should.equal(error.message);
          done();
        });
      });
    });

    describe('#find', function () {
      var promise = models.Role.findById;
      before(function () {
        models.Role.findById = function () { return deferred.promise; };
        deferred.reject(error);
      });
      after(function () {
        models.Role.findById = promise;
      });
      it('should fail with status 500', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        controllers.rolesController.find(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(500);
          data.message.should.equal(error.message);
          done();
        });
      });
    });

    describe('#update', function () {
      var promise = models.Role.update;
      before(function () {
        models.Role.update = function () { return deferred.promise; };
        deferred.reject(error);
      });

      after(function () {
        models.Role.update = promise;
      });

      it('should return status code 500', function (done) {
        models.Role.create(mockRole).then(function (role) {
          role.name = 'Super Admin';
          req = httpMocks.createRequest({
            params: {
              id: id
            },
            body: {
              role: mockRole
            }
          });
          controllers.rolesController.update(req, res);
          res.on('end', function () {
            var data = JSON.parse(res._getData());
            res.statusCode.should.equal(500);
            data.message.should.equal(error.message);
            done();
          });
        });
      });
    });

    describe('#destroy', function () {
      var promise = models.Role.destroy;
      before(function () {
        models.Role.destroy = function () { return deferred.promise; }
        deferred.reject(error);
      });
      after(function () {
        models.Role.destroy = promise;
      });

      it('should returns status code 500', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: id
          }
        });

        controllers.rolesController.destroy(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(500);
          data.message.should.equal(error.message);
          done();
        });
      });
    });
  });
});
