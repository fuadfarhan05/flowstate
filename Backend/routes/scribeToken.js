const express = require('express');
const scribetoken = express.Router();

const scribeController = require('../controllers/scribetoken.controller.js');

scribetoken.get('/scribe-token', scribeController);

module.exports = scribetoken;