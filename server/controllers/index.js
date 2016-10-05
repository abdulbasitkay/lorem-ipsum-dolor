'use strict';

var userController = require('./user.server.controller');
var rolesController = require('./role.server.controller');
var termController = require('./term.server.controller');

module.exports = {
  userController: userController,
  rolesController: rolesController,
  termController: termController
};
