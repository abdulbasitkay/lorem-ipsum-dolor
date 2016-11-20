
require('dotenv').load();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./server/routes');
const models = require('./server/models');
const cors = require('cors');
const logger = require('express-logger');


var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname  + './app'));
app.use(logger({path: './logs/express.log'}));

function start() {
  routes(app);
  app.use('*', function (req, res) {
    return res.status(404).json({message: 'route not found'});
  });

  const port = process.env.port;
  models.sequelize.sync({ force: true }).then(function () {
    app.listen(port, function () {
      console.log('Server is listening at port ' + port);
    });
  });
}

start();
