'use strict';

require('dotenv').load();
var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./server/routes');
var models = require('./server/models');
var cors = require('cors');
var logger = require('express-logger');


var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname  = './app'));
app.use(logger({path: './logs/express.log'}));

function start() {
  routes(app);
  
  app.use('*', function (req, res, next) {
    return res.status(404).json({message: 'route not found'});
  });

  var port = process.env.port;
  models.sequelize.sync({ force: true}).then(function () {
    app.listen(port, function () {
      console.log('Server is listening at port ' + port);
    });
  });
}

start();
