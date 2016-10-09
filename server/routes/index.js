'use strict';

var controllers = require('./../controllers');

module.exports = function (app) {


  /* user routes */
  app.get('/users', controllers.userController.index);
  app.post('/users', controllers.userController.save);
  app.put('/users/:id', controllers.userController.update);
  app.get('/users/:id', controllers.userController.find);
  app.delete('/users/:id', controllers.userController.destroy);

  /* Payment routes */
  app.get('/payments', controllers.paymentsController.index);
  app.post('/payments', controllers.paymentsController.save);
  app.put('/payments/:id', controllers.paymentsController.update);
  app.get('/payments/:id', controllers.paymentsController.find);
  app.delete('/payments', controllers.paymentsController.destroy);

  /* payment type routes */
  app.get('/payment-type', controllers.paymenttypeController.index);
  app.post('/payment-type', controllers.paymenttypeController.save);
  app.put('/payment-type/:id', controllers.paymenttypeController.update);
  app.get('/payment-type/:id', controllers.paymenttypeController.find);
  app.delete('/payment-type', controllers.paymenttypeController.destroy);

  /* role routes */
  app.get('/roles', controllers.rolesController.index);
  app.post('/roles', controllers.rolesController.save);
  app.put('/roles/:id', controllers.rolesController.update);
  app.get('/roles/:id', controllers.rolesController.find);
  app.delete('/roles/:id', controllers.rolesController.destroy);

  /* student routes */
  app.get('/students', controllers.studentController.index);
  app.post('/students', controllers.studentController.save);
  app.put('/students/:id', controllers.studentController.update);
  app.get('/students/:id', controllers.studentController.find);
  app.delete('/students/:id', controllers.studentController.destroy);

  /* term routes */
  app.get('/terms', controllers.termController.index);
  app.post('/terms', controllers.termController.save);
  app.put('/terms/:id', controllers.termController.update);
  app.get('/terms/:id', controllers.termController.find);
  app.delete('/terms/:id', controllers.termController.destroy);
}