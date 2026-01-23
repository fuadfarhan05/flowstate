const express = require('express');
const GradeAnswerRoute = express.Router();

const GradeAnswer = require('../controllers/gradeanswer.controller.js');

GradeAnswerRoute.post('/grade-answer', GradeAnswer);

module.exports = GradeAnswerRoute;
