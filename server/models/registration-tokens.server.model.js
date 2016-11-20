'use strict';
var bcrypt = require('bcrypt');

module.exports = function (Sequelize, DataTypes) {
  var RegToken = Sequelize.define('RegToken', {
    id: { type: DataTypes.INTEGER, required: true, autoIncrement: true, primaryKey: true},
    email: { type: DataTypes.STRING, required: true, unique: true},
    token: { type: DataTypes.STRING, required: true, unique: true},
    role: { type: DataTypes.INTEGER, required: true},
  });

  return RegToken;
};
