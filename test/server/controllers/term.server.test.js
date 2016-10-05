'use strict';

var should = require('should');
var Q = require('q');
var httpMocks = require('node-mocks-http');
var controllers = require('../../../server/controllers');
var models = require('../../../server/models');

var res, req, mockTerm, id, error;

describe('Term Controller', function () {
  beforeEach(function (done) {
    mockTerm = {
      session: '2016/2017',
      name: 'Third'
    };

    res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    error = { message: 'An error occured' };

    models.sequelize.sync({ force: true }).then(function () {
      models.Term.create(mockTerm).then(function (term) {
        id = term.id;
        done();
      });
    })
  });

  afterEach(function (done) {
    models.sequelize.sync({ force: true }).then(function () {
      done();
    });
  });

  describe('No Errors', function () {
    it('should find all records in the database', function (done) {
      req = httpMocks.createRequest();
      controllers.termController.index(req, res);
      res.on('end', function () {
        var data = JSON.parse(res._getData());
        res.statusCode.should.equal(200);
        data.should.be.instanceOf(Array);
        done();
      });
    });

    it('should save a term in the database', function (done) {
      var term = {
        session: '2016/2017',
        name: 'First'
      };

      req = httpMocks.createRequest({
        body: {
          term: term
        }
      });
      controllers.termController.save(req, res);
      res.on('end', function () {
        var data = JSON.parse(res._getData());
        res.statusCode.should.equal(200);
        data.name.should.equal(term.name);
        done();
      });
    });

    it('should update a record in the database', function (done) {
      mockTerm.name = 'Second';
      req = httpMocks.createRequest({
        params: {
          id:id
        },
        body: {
          term: mockTerm
        }
      });
      controllers.termController.update(req, res);
      res.on('end', function () {
        var data = JSON.parse(res._getData());
        res.statusCode.should.equal(200);
        should.exist(data);
        data.name.should.equal('Second');
        done();
      });
    });
    it('should find a record from the databse', function (done) {
      req = httpMocks.createRequest({
        params: {
          id: id
        }
      });
      controllers.termController.find(req, res);
      res.on('end', function () {
        var data = JSON.parse(res._getData());
        res.statusCode.should.equal(200);
        should.exist(data);
        data.name.should.equal(mockTerm.name);
        done();
      });
    });

    it('should delete a record in the databse', function (done) {
      req = httpMocks.createRequest({
        params: {
          id: id
        }
      });
      controllers.termController.destroy(req, res);
      res.on('end', function () {
        var data = JSON.parse(res._getData());
        res.statusCode.should.equal(200);
        should.exist(data);
        data.message.should.equal('Term deleted');
        done();
      });
    });
  });
  describe('Errors', function () {
    describe('#index', function () {
      var promise = models.Term.findAll;
      before(function () {
        var deferred = Q.defer();
        models.Term.findAll = function () { return deferred.promise; };
        deferred.reject(error);
      });
      after(function () {
        models.Term.findAll = promise;
      });

      it('should return 500 status code', function (done) {
        req = httpMocks.createRequest();
        controllers.termController.index(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          should.exist(data);
          res.statusCode.should.equal(500);
          data.message.should.equal(error.message);
          done();
        });
      });
    });
    describe('#find', function () {
      var promise = models.Term.findById;
      before(function () {
        var deferred = Q.defer();
        models.Term.findById = function () { return deferred.promise; }
        deferred.reject(error);
      });
      after(function () {
        models.Term.findById = promise;
      });
      it('should return status code 500', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        controllers.termController.find(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(500);
          data.message.should.equal(error.message);
          done();
        });
      });
    });
    describe('#update', function () {
      var promise = models.Term.update;
      before(function () {
        var deferred = Q.defer();
        models.Term.update = function () { return deferred.promise; };
        deferred.reject(error);
      });
      after(function () {
        models.Term.update = promise;
      });
      it('shoould return status code 500', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: id
          },
          body: {
            term: mockTerm
          }
        });
        controllers.termController.update(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(500);
          data.message.should.equal(error.message);
          done();
        });
      });
    });
    describe('#destroy', function () {
      var promise = models.Term.destroy;
      before(function () {
        var deferred = Q.defer();
        models.Term.destroy = function () { return deferred.promise; };
        deferred.reject(error);
      });
      after(function () {
        models.Term.destroy = promise;
      });
      it('should return status code 500', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        controllers.termController.destroy(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(500);
          data.message.should.equal(error.message);
          done();
        })
      });
    });
    describe('#save', function () {
      var promise = models.Term.create;
      before(function () {
        var deferred = Q.defer();
        models.Term.create = function () { return deferred.promise; };
        deferred.reject(error);
      });
      after(function () {
        models.Term.create = promise;
      });
    });
  });
});
