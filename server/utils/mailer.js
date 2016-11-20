'use strict';

var Q = require('q');
var host = process.env.MAIL_HOST;
var port = process.env.MAIL_PORT;
var username = process.env.MAIL_USER;
var NodeMailer = require('nodemailer');
var password = process.env.MAIL_PASSWORD;
var protocol = process.env.MAIL_PROTOCOL;
var from = process.env.MAIL_FROM;


module.exports = {
  sendMail: sendMail
};


function sendMail(to, subject, text) {
  var deferred = Q.defer();
  var smtpConfig = {
    host: host,
    port: port,
    auth: {
      user: username,
      pass: password
    }
  };

  var mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: text
  };

  var transporter = NodeMailer.createTransport(protocol, smtpConfig);
  transporter.sendMail(mailOptions, function (err, res) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(res.response);
    }
  });
  return deferred.promise;
}
