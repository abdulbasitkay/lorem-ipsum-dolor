'use strict';

var userController = require('./user.server.controller');
var rolesController = require('./role.server.controller');
var termController = require('./term.server.controller');
var studentController = require('./student.server.controller');
var paymentsController = require('./payment.server.controller');
var paymenttypeController = require('./payment-type.server.controller');

module.exports = {
  userController: userController,
  rolesController: rolesController,
  termController: termController,
  studentController: studentController,
  paymentsController: paymentsController,
  paymenttypeController: paymenttypeController
};
