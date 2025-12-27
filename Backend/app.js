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

//Initialize the routes to be called. 
app.use("/api/v1/", ResumeRoute);   
 
module.exports = app; 