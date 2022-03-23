const express = require('express');
const routes = express.Router();

const Managers = require('./modules/managers');
const Partners = require('./modules/partners');

routes.get('/', (req, res) => {
  res.status(200).send({ message: 'Welcome to Seven Seguros API' });
});

routes.post('/new-manager', Managers.create);
routes.post('/new-partner', Partners.create);

module.exports = routes;
