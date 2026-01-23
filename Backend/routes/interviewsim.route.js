const express = require('express'); 
const interviewsim = express.Router();  
// import the controller here as such 
const interviewController = require('../controllers/interviewsim.controller.js'); 

const hivariabletest = "hi"; 

interviewsim.post('/grade-answers', interviewController); 

module.exports = interviewsim;