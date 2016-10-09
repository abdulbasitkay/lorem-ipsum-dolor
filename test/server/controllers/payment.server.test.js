'use strict';

var models = require('./../../../server/models');
var controllers = require('./../../../server/controllers');
var should = require('should');
var Q = require('q');
var httpMocks = require('node-mocks-http');


var mockUser, 
  mockStudent, 
  mockPayment, 
  mockTerm, 
  paymentType, 
  mockRole, 
  id, 
  req, 
  res, 
  error, 
  promise;

describe('Payments Controller', function () {
  mockStudent = {
    parentName: 'Kay Terrence',
    address: '23rd & West, some place',
    parentPhone: '897878878'
  };

  mockUser = {
    username: 'kellybone',
    password: 'testpasword',
    emailAddress: 'kellybone@example.com',
    firstName: 'Kelly',
    lastName: 'Bone'
  };

  mockTerm = {
    name: 'First Term',
    session: '2016/2017'
  };

  paymentType = {
    name: 'school fee'
  };

  mockPayment = {
    amount: 2000,
    receiverId: 1
  };

  mockRole = {
    'name': 'cashier'
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
            mockPayment.StudentId = student.id;
            models.PaymentType.create(paymentType).then(function (type) {
              mockPayment.PaymentTypeId = type.id;
              models.Term.create(mockTerm).then(function (term) {
                mockPayment.TermId = term.id;
                models.Payment.create(mockPayment).then(function (payment) {
                  id = payment.id;
                  done();
                });
              });
            });
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

  describe('#index', function () {
    describe('No Error', function () {
      it('should return all payments', function (done) {
        req = httpMocks.createRequest();
        controllers.paymentsController.index(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          data.should.be.instanceOf(Array);
          done();
        });
      });
    });
    describe('Error', function () {
      promise = models.Payment.findAll;
      var deferred = Q.defer();
      before(function () {
        models.Payment.findAll = function () { return deferred.promise; };
        deferred.reject(error);
      });
      after(function () {
        models.Payment.findAll = promise;
      });
      it('should return status code 500', function (done) {
        req = httpMocks.createRequest();
        controllers.paymentsController.index(req, res);
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
      it('should save a payment', function (done) {
        req = httpMocks.createRequest({
          body: {
            payment: mockPayment
          }
        });
        controllers.paymentsController.save(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          parseInt(data.amount).should.equal(mockPayment.amount);
          done();
        });
      });
    });
    // describe('Errors', function () {
    //   promise = models.Payment.create;
    //   before(function () {
    //     var deferred = Q.defer();
    //     models.Payment.create = function() { return deferred.promise; };
    //     deferred.reject(error);
    //   });
    //   after(function () {
    //     models.Payment.create = promise;
    //     done();
    //   });
    //   it('should return status code 500', function (done) {
    //     req = httpMocks.createRequest({
    //       body: {
    //         payment: mockPayment
    //       }
    //     });
    //     controllers.paymentsController.save(req, res);
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
  describe('#find', function () {
    describe('No Errors', function () {
      it('should find a payment in the database', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        controllers.paymentsController.find(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          should.exist(data);
          res.statusCode.should.equal(200);
          done();
        });
      });
    });
    describe('Errors', function() {
      promise = models.Payment.findById;
      before(function () {
        var deferred = Q.defer();
        models.Payment.findById = function () { return deferred.promise; };
        deferred.reject(error);
      });
      after(function () {
        models.Payment.findById = promise;
      });
      it('should return status code 500', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        controllers.paymentsController.find(req, res);
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
      it('should update a payment', function (done) {
        mockPayment.amount = 5000;
        req = httpMocks.createRequest({
          params: {
            id: id
          },
          body: {
            payment: mockPayment
          }
        });
        controllers.paymentsController.update(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          should.exist(data);
          res.statusCode.should.equal(200);
          data.payment.amount.should.equal(5000);
          done();
        });
      });
    });
    describe('Errors', function () {
      promise = models.Payment.update;
      before(function () {
        var deferred = Q.defer();
        models.Payment.update = function () { return deferred.promise; };
        deferred.reject(error);
      });
      it('should return status code 500', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: id
          },
          body: {
            payment: mockPayment
          }
        });
        controllers.paymentsController.update(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          should.exist(data);
          res.statusCode.should.equal(500);
          data.message.should.equal(error.message);
          done();
        });
      });
    });
  });
  describe('#destroy', function () {
    describe('No Errors', function () {
      it('should delete a payment', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        controllers.paymentsController.destroy(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          data.message.should.equal('Payment deleted');
          done();
        });
      });
    });
    describe('Errors', function () {
      promise = models.Payment.destroy;
      before(function () {
        var deferred = Q.defer();
        models.Payment.destroy = function () { return deferred.promise; };
        deferred.reject(error);
      });
      after(function () {
        models.Payment.destroy = promise;
      });
      it('should return status code 500', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        controllers.paymentsController.destroy(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          should.exist(data);
          res.statusCode.should.equal(500);
          data.message.should.equal(error.message);
          done();
        });
      });
    });
  });
});
