'use strict';
var bcrypt = require('bcrypt');

module.exports = function (Sequelize, DataTypes) {
  var RegToken = Sequelize.define('RegToken', {
    email: { type: DataTypes.STRING, required: true, unique: true, primaryKey: true},
    token: { type: DataTypes.STRING, required: true, unique: true}
  }, {
    instanceMethods: {
      decryptHash: function (hash) {
        bcrypt.compare(hash, this.token, function (err, decrypted) {
          if (err) {
            deferred.reject(err);
          } else {
            deferred.resolve(decrypted);
          }
        })
        return deferred.promise;
      }
    }
  });

  return RegToken;
}