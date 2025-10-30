const express = require('express'); 
const resumeRoute = express.Router(); 

//TODO: change route to a post request since we are uploading from client side as well. 
resumeRoute.get('/Resume', (req, res) => { 
    res.send({ 
        ResumeEndpoint: true
    }); 
}); 

module.exports = resumeRoute; 