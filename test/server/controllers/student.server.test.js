'use strict';

var models = require('./../../../server/models');
var controllers = require('./../../../server/controllers');
var should = require('should');
var httpMocks = require('node-mocks-http');
var Q = require('q');

var res, req, mockStudent, mockUser, mockRole, id, error, promise;

describe('Student controller', function () {
  mockUser = {
    username: 'kellybone',
    password: 'testpasword',
    emailAddress: 'kellybone@example.com',
    firstName: 'Kelly',
    lastName: 'Bone'
  };
  mockStudent = {
    parentName: 'Ken Bone',
    parentPhone: '+2345678675090',
    address: '234, South & 32'
  };

  mockRole = {
    name: 'Admin'
  };

  error = { message: 'An error occured' };
  beforeEach(function (done) {
    res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    models.sequelize.sync({ force: true }).then(function () {
      models.Role.create(mockRole).then(function (role) {
        mockUser.RoleId = role.id;
        models.User.create(mockUser).then(function (user) {
          mockStudent.UserId = user.id;
          models.Student.create(mockStudent).then(function (student) {
            id = student.id;
            done();
          });
        });
      });
    });
  });

  afterEach(function (done) {
    models.sequelize.sync({ force: true }).then(function () {
      done();
    });
  });

  describe('#find', function () {
    describe('No Errors', function () {
      it('should find a student', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        controllers.studentController.find(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          should.exist(data);
          data.address.should.equal(mockStudent.address);
          done();
        });
      });
    });
    describe('Errors', function () {
      promise = models.Student.findById;
      var deferred = Q.defer();
      before(function () {
        models.Student.findById = function () { return deferred.promise; };
        deferred.reject(error);
      });
      after(function () {
        models.Student.findById = promise;
      });
      it('should return status code 500', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        controllers.studentController.find(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(500);
          data.message.should.equal(error.message);
          done();
        });
      });
    });
  });

  describe('#index', function () {
    describe('No Errors', function () {
      it('should return all students', function (done) {
        req = httpMocks.createRequest();
        controllers.studentController.index(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          should.exist(data);
          data.should.be.instanceOf(Array);
          done();
        });
      });
    });
    describe('Errors', function () {
      promise = models.Student.findAll;
      var deferred = Q.defer();
      before(function () {
        models.Student.findAll = function () { return deferred.promise; };
        deferred.reject(error);
      });
      after(function () {
        models.Student.findAll = promise;
      });

      it('should return status code 500', function (done) {
        req = httpMocks.createRequest();
        controllers.studentController.index(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(500);
          data.message.should.equal(error.message);
          done();
        });
      });
    });
  });
  describe('#update', function () {
    describe('No Errors', function () {
      it('should update a student record', function (done) {
        mockStudent.address = '45th & West';
        req = httpMocks.createRequest({
          params: {
            id: id
          },
          body: {
            student: mockStudent
          }
        });
        controllers.studentController.update(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          should.exist(data);
          data.student.address.should.equal('45th & West');
          done();
        });
      });
    });
    describe('Errors', function () {
      promise = models.Student.update;
      var deferred = Q.defer();
      before(function () {
        models.Student.update = function () { return deferred.promise; };
        deferred.reject(error);
      });
      after(function () {
        models.Student.update = promise;
      });
      it('should return status code 500', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: id
          },
          body: {
            student: mockStudent
          }
        });
        controllers.studentController.update(req, res);
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
      it('should save a student', function (done) {
        mockStudent.parentName = 'Ken Ter';
        req = httpMocks.createRequest({
          body: {
            student: mockStudent
          }
        });
        controllers.studentController.save(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          data.parentName.should.equal(mockStudent.parentName);
          done();
        });
      });
    });
  });
  describe('#destroy', function () {
    describe('No Errors', function () {
      it('should delete a student', function (done){
        req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        controllers.studentController.destroy(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          data.message.should.equal('Student record deleted');
          done();
        });
      });
    });
    describe('Errors', function () {
      promise = models.Student.destroy;
      var deferred = Q.defer();
      before(function () {
        models.Student.destroy = function () { return deferred.promise; };
        deferred.reject(error);
      });
      after(function () {
        models.Student.destroy = promise;
      });
      it('should return status code 500', function(done) {
        req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        controllers.studentController.destroy(req, res);
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
