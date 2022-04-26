const express = require('express');
const routes = express.Router();

const Managers = require('./modules/managers');
const Partners = require('./modules/partners');
const Recipients = require('./modules/recipient');

routes.get('/', (req, res) => {
  res.status(200).send({ message: 'Welcome to Seven Seguros API' });
});

routes.get('/managers', Managers.getList);
routes.get('/export-managers', Managers.exportManagers);
routes.post('/new-manager', Managers.create);
routes.post('/new-partner', Partners.create);
routes.get('/export-partners', Partners.exportPartners);
routes.post('/add-recipient', Recipients.create);
routes.delete('/delete-recipient', Recipients.delete);

module.exports = routes;
