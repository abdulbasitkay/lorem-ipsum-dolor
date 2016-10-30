var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var moment = require('moment');
var Q = require('q');
var secret = process.env.APP_KEY;

module.exports = {
  createToken: createToken,
  createHash: createHash
};


function createToken(user) {
  var paylod = {
    sub: user.id,
    iat: moment.unix(),
    exp: moment.add(14, 'days').unix()
  };

  return jwt.encode(payload, secret);
}

function createHash(string) {
  var deferred = Q.defer();
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      deferred.reject(err);
    } else {
      bcrypt.hash(string, salt, function (err, hashed) {
        if(err) {
          deferred.reject(err);
        } else {
          deferred.resolve(hashed);
        }
      })
    }
  });
  return deferred.promise;
}

