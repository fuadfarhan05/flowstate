const express = require('express'); 
const genQuestions = express.Router();  

const generateQuestions = require('../controllers/interviewsim.controller.js'); 


genQuestions.post('/grade-answers', generateQuestions); 

module.exports = genQuestions;