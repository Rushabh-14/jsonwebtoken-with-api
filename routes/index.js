const express = require('express');

const routes = express.Router();

routes.use('/faculty',require('./faculty'));
routes.use('/student',require('./student'));

module.exports = routes;