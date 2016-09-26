var should = require('should'),
  models = require('../../../server/models');


describe('PaymetType model', function () {
  var mockPaymentType = {
    name: 'School fees'
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


  it('should create a payment type in the database', function (done) {
    models.PaymentType.create(mockPaymentType).then(function (type) {
      should.exist(type);
      type.name.should.equal(mockPaymentType.name);
      done();
    });
  });

  it('should update a record in the database', function (done) {
    models.PaymentType.create(mockPaymentType).then(function (type) {
      should.exist(type);
      type.name = 'Dues';
      type.save().then(function (_type) {
        should.exist(_type);
        _type.name.should.equal('Dues');
        done();
      });
    });
  });

  it('should find a record in the database', function (done) {
    models.PaymentType.create(mockPaymentType).then(function (type) {
      should.exist(type);
      models.PaymentType.findById(type.id).then(function (_type) {
        should.exist(_type);
        _type.name.should.equal(type.name);
        done();
      });
    });
  });

  it('should delete a record in the database', function (done) {
    models.PaymentType.create(mockPaymentType).then(function (type) {
      models.PaymentType.destroy({
        where: {
          id: type.id
        }
      }).then(function (rowCount) {
        should.exist(rowCount);
        rowCount.should.equal(1);
        done();
      });
    });
  });
});
