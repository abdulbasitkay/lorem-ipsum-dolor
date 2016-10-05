'use strict';

var should = require('should'),
  models = require('../../../server/models');

describe('Payments Model', function () {
  var mockStudent = {
    parentName: 'Kay Terrence',
    address: '23rd & West, some place',
    parentPhone: '897878878'
  };

  var mockUser = {
    username: 'kellybone',
    password: 'testpasword',
    emailAddress: 'kellybone@example.com',
    firstName: 'Kelly',
    lastName: 'Bone'
  };

  var mockTerm = {
    name: 'First Term',
    session: '2016/2017'
  };

  var paymentType = {
    name: 'school fee'
  };

  var mockPayment = {
    amount: 2000,
    receiverId: 1
  };

  var mockRole = {
    'name': 'cashier'
  };

  beforeEach(function (done) {
    models.sequelize.sync({ force: true }).then(function () {
      models.Role.create(mockRole).then(function (role) {
        mockUser.RoleId = role.id;
        models.User.create(mockUser).then(function (user) {
          mockStudent.UserId = user.id;
          models.Student.create(mockStudent).then(function (student) {
            mockPayment.StudentId = student.id;
            models.Term.create(mockTerm).then(function (term) {
              mockPayment.TermId = term.id;
              models.PaymentType.create(paymentType).then(function (type) {
                mockPayment.PaymentTypeId = type.id;
                done();
              });
            });
          });
        });
      })
    });
  });

  afterEach(function (done) {
    models.sequelize.sync({ force: true }).then(function () {
      done();
    });
  });

  it('should create a payment record in the database', function (done) {
    models.Payment.create(mockPayment).then(function (payment) {
      should.exist(payment);
      payment.StudentId.should.equal(mockPayment.StudentId);
      done();
    });
  });

  it('should update a payment record in the database', function (done) {
    models.Payment.create(mockPayment).then(function (payment) {
      should.exist(payment);
      payment.type = 'Dues';
      payment.save().then(function (_payment) {
        should.exist(_payment);
        payment.type.should.equal('Dues');
        done();
      });
    });
  });

  it('should find a record in the database', function (done) {
    models.Payment.create(mockPayment).then(function (payment) {
      should.exist(payment);
      models.Payment.findOne({
        where: {
          id: payment.id
        }
      }).then(function (_payment) {
        should.exist(_payment);
        _payment.PaymentTypeId.should.equal(payment.PaymentTypeId);
        done();
      });
    });
  });

  it('should delete a record in the database', function (done) {
    models.Payment.create(mockPayment).then(function (payment) {
      should.exist(payment);
      models.Payment.destroy({
        where: { id: payment.id }
      }).then(function (affectedRows) {
        should.exist(affectedRows);
        affectedRows.should.equal(1);
        done();
      });
    });
  });
});
