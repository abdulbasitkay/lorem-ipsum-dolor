'use strict';

var models = require('./../../../server/models');
var controllers = require('./../../../server/controllers');
var should = require('should');
var Q = require('q');
var httpMocks = require('node-mocks-http');


var res, error, req, id, mockType, promise;

describe('PaymentType controller', function () {
  mockType = {
    name: 'School fee'
  };

  error= { message: 'An error ocurred' };

  beforeEach(function (done) {
    res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    models.sequelize.sync({ force: true }).then(function () {
      models.PaymentType.create(mockType).then(function (type) {
        id = type.id;
        done();
      });
    });
  });

  afterEach(function (done) {
    models.sequelize.sync({ force: true }).then(function () {
      done();
    });
  });

  describe('#index', function () {
    describe('No Errors', function () {
      it('should return all payment types', function (done) {
        req = httpMocks.createRequest();
        controllers.paymenttypeController.index(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          data.should.be.instanceOf(Array);
          done();
        });
      });
    });
    describe('Errors', function () {
      promise = models.PaymentType.findAll;
      before(function () {
        var deferred = Q.defer();
        models.PaymentType.findAll = function () { return deferred.promise; };
        deferred.reject(error);
      });
      after(function () {
        models.PaymentType.findAll = promise;
      });
      it('should return status code 500', function (done) {
        req = httpMocks.createRequest();
        controllers.paymenttypeController.index(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(500);
          data.message.should.equal(error.message);
          done();
        });
      });
    });
  });
  describe('#find', function () {
    describe('No Errors', function () {
      it('should return a payment type', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        controllers.paymenttypeController.find(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          should.exist(data);
          data.name.should.equal(mockType.name);
          done();
        });
      });
    });
    describe('Errors', function () {
      promise = models.PaymentType.findById;
      before(function () {
        var deferred = Q.defer();
        models.PaymentType.findById = function () { return deferred.promise; };
        deferred.reject(error);
      });
      after(function () {
        models.PaymentType.findById = promise;
      });
      it('should return status code 500', function (done) {
        req = httpMocks.createRequest();
        controllers.paymenttypeController.find(req, res);
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
      it('should update a payment type', function (done) {
        mockType.name = 'Unknown';
        req = httpMocks.createRequest({
          params: {
            id: id
          },
          body: {
            type: mockType
          }
        });
        controllers.paymenttypeController.update(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          should.exist(data);
          data.type.name.should.equal('Unknown');
          done();
        });
      });
    });
    describe('Errors', function () {
      promise = models.PaymentType.update;
      before(function () {
        var deferred = Q.defer();
        models.PaymentType.update = function () { return deferred.promise; };
        deferred.reject(error);
      });
      after(function () {
        models.PaymentType.update = promise;
      });
      it('should return status code 500', function (done) {
        mockType.name = 'Misc';
        req = httpMocks.createRequest({
          params: {
            id: id
          },
          body: {
            type: mockType
          }
        });
        controllers.paymenttypeController.update(req, res);
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
    describe('No Errors', function () {
      it('should update a payment type', function (done) {
        mockType.name = 'Unknown';
        req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        controllers.paymenttypeController.destroy(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          should.exist(data);
          data.message.should.equal('Payment type deleted');
          done();
        });
      });
    });
    describe('Errors', function () {
      promise = models.PaymentType.destroy;
      before(function () {
        var deferred = Q.defer();
        models.PaymentType.destroy = function () { return deferred.promise; };
        deferred.reject(error);
      });
      after(function () {
        models.PaymentType.destroy = promise;
      });
      it('should return status code 500', function (done) {
        mockType.name = 'Misc';
        req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        controllers.paymenttypeController.destroy(req, res);
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
      it('should update a payment type', function (done) {
        mockType.name = 'Unknown';
        req = httpMocks.createRequest({
          body: {
            type: mockType
          }
        });
        controllers.paymenttypeController.save(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          should.exist(data);
          data.name.should.equal('Unknown');
          done();
        });
      });
    });
    // describe('Errors', function () {
    //   promise = models.PaymentType.create;
    //   before(function () {
    //     var deferred = Q.defer();
    //     models.PaymentType.create = function () { return deferred.promise; };
    //     deferred.reject(error);
    //   });
    //   after(function () {
    //     models.PaymentType.create = promise;
    //   });
    //   it('should return status code 500', function (done) {
    //     mockType.name = 'Misc';
    //     req = httpMocks.createRequest({
    //       body: {
    //         type: mockType
    //       }
    //     });
    //     controllers.paymenttypeController.save(req, res);
    //     res.on('end', function () {
    //       var data = JSON.parse(res._getData());
    //       res.statusCode.should.equal(500);
    //       data.message.should.equal(error.message);
    //       done();
    //     });
    //   });
    // });
  });
})