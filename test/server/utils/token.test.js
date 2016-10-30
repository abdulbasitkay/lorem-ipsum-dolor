var should = require('should');
var token = require('../../../server/utils/token');


describe('Token generator', function () {
  var hashString = '4434verem.dugeri@gmail.com45434';
  var user = {
    id: 1
  };

  it('should create a hash', function (done) {
    token.createHash(hashString).then(function (hash) {
      should.exist(hash);
      done();
    });
  });

  it('should fail to create a hash with null value', function (done) {
    hashString = null;
    token.createHash(hashString).then(function (hash) {
      throw new Error('hash string should not be null');
    }).catch(function (err) {
      should.exist(err);
      done();
    });
  });

  it('should create a token', function (done) {
    var craetedToken = token.createToken(user)
    should.exist(craetedToken);
    done();
  });
});