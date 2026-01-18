const express = require("express");
const cors = require('cors');
const app = express(); 

//middle ware here 
app.use(express.json()); 
app.use(cors({ 
  origin: 'http://localhost:3000'  
}));

//Importing routes here as such
const Airoute = require('./routes/AI.route.js');  
const interviewsimRoute = require('./routes/interviewsim.route.js'); 
const ElevenLabsRoute = require('./routes/scribeToken.route.js');
const GenQuestionsRoute = require('./routes/genquestions.route.js');

app.get('/', (req, res) => { 
  res.json({ 
    Server: "Successfully running"
  }); 
});  


//Initialize the routes to be called.  
app.use("/api/v1/", Airoute);  
app.use("/api/v1/", interviewsimRoute); 
app.use("/api/v1/", ElevenLabsRoute);
app.use("/api/v1/", GenQuestionsRoute);
 
module.exports = app; 