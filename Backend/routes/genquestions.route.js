const express = require('express'); 
const GenerateQuestionsRoute = express.Router();  

const GenerateQuestions = require('../controllers/generatequestion.controller.js'); 


GenerateQuestionsRoute.post('/generate-questions', GenerateQuestions); 

module.exports = GenerateQuestionsRoute;