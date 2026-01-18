const express = require('express'); 
const GenQuestionsRoute = express.Router();  

const GenerateQuestions = require('../controllers/generatequestion.controller.js'); 


GenQuestionsRoute.post('/generate-questions', GenerateQuestions); 

module.exports = GenQuestionsRoute;