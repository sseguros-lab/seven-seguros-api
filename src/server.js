const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.listen({ port: process.env.PORT || 4001 });
console.clear();
console.log('Running...');
