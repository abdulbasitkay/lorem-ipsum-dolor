'use strict';

var bcrypt = require('bcrypt');
var Q = require('q');


module.exports = function (Sequelize, DataTypes) {
    var User = Sequelize.define('User', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
        username: { type:DataTypes.STRING },
        password: { type: DataTypes.STRING },
        emailAddress: { type: DataTypes.STRING },
        firstName: { type: DataTypes.STRING },
        lastName: { type: DataTypes.STRING },
    }, {
        instanceMethods: {
            toJSON: function () {
                var value = this.get();
                delete value.password;
                return value;
            },
            matchPasswords: function (candidatePassword, hash) {
              var deferred = Q.defer();
              bcrypt.compare(candidatePassword, hash, function (err, matched) {
                if (err) {
                  deferred.reject(err);
                } else {
                  deferred.resolve(matched);
                }
              });

              return deferred.promise;
            }
        },
        classMethods: {
            associate: function (models) {
                User.belongsTo(models.Role, {
                    onDelete: 'CASCADE',
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });

    User.beforeCreate(function (user, options,next) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hashed) {
          if(err) {
            next(err);
          } 
          user.password = hashed;
          next();
        });
      });
    });

    return User;
};
