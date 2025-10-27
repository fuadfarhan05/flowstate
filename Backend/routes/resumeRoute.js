const express = require('express'); 
const resumeRoute = express.Router(); 

resumeRoute.get('/Resume', (req, res) => { 
    res.send({ 
        ResumeEndpoint: true
    }); 
}); 

module.exports = resumeRoute; 