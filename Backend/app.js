const express = require("express");
const cors = require('cors');
const app = express(); 

//middle ware here 
app.use(express.json()); 
app.use(cors({ 
  origin: 'http://localhost:3000'  
}));

//Importing routes here as such
const ResumeRoute = require("./routes/resumeRoute.js");  
const Airoute = require('./routes/AIroute.js');  
const interviewsimRoute = require('./routes/interviewsim.route.js'); 
const ElevenLabsRoute = require('./routes/scribeToken.js');

app.get('/', (req, res) => { 
  res.json({ 
    Server: "Successfully running"
  }); 
}); 

//console.log("ResumeRoute:", ResumeRoute);
//console.log("Airoute:", Airoute);
//console.log("interviewsimRoute:", interviewsimRoute);
//console.log("ElevenLabsRoute:", ElevenLabsRoute);

//Initialize the routes to be called. 
app.use("/api/v1/", ResumeRoute);    
app.use("/api/v1/", Airoute);  
app.use("/api/v1/", interviewsimRoute); 
app.use("/api/v1/", ElevenLabsRoute);
app.use("api/v1/");
 
module.exports = app; 