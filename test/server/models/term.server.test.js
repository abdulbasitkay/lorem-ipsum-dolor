'use strict';

var should = require('should'),
  models = require('../../../server/models');


describe('Term model', function () {
  var mockTerm = {
    name: 'first',
    'session': '2016/2017'
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

  it('should create a term in the database', function (done) {
    models.Term.create(mockTerm).then(function (term) {
      should.exist(term);
      term.name.should.equal(mockTerm.name);
      done();
    });
  });

  it('should find a term in the database', function (done) {
    models.Term.create(mockTerm).then(function (term) {
      should.exist(term);
      models.Term.findById(term.id).then(function (_term) {
        should.exist(_term);
        _term.session.should.equal(term.session);
        done();
      });
    });
  });

  it('should update a term in the database', function (done) {
    models.Term.create(mockTerm).then(function (term) {
      should.exist(term);
      term.name = 'Second';
      term.save().then(function (_term) {
        should.exist(_term);
        _term.name.should.equal('Second');
        done();
      });
    });
  });

  it('should delete a term from the database', function (done) {
    models.Term.create(mockTerm).then(function (term) {
      should.exist(term);
      models.Term.destroy({
        where: {
          id: term.id
        }
      }).then(function (affectedRows) {
        should.exist(affectedRows);
        affectedRows.should.equal(1);
        done();
      });
    });
  });
});
