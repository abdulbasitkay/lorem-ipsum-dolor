'use strict';

const Q = require('q');
const host = process.env.MAIL_HOST;
const port = process.env.MAIL_PORT;
const username = process.env.MAIL_USER;
const NodeMailer = require('nodemailer');
const password = process.env.MAIL_PASSWORD;
const protocol = process.env.MAIL_PROTOCOL;
const from = process.env.MAIL_FROM;


module.exports = {
  sendMail: sendMail
};


function sendMail(to, subject, text) {
  const deferred = Q.defer();
  const smtpConfig = {
    host: host,
    port: port,
    auth: {
      user: username,
      pass: password
    }
  };

  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: text
  };

  const transporter = NodeMailer.createTransport(protocol, smtpConfig);
  transporter.sendMail(mailOptions, function (err, res) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(res.response);
    }
  });
  return deferred.promise;
}
