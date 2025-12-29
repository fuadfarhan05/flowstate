//Instantiate an Express App for backend.
// this will be the main server file here as such
const express = require("express");
const cors = require('cors');

const app = express();

app.use(cors({ 
  origin: 'http://localhost:3000'  
}));

//Importing routes here as such
const ResumeRoute = require("./routes/resumeRoute.js");

//basic middleware
app.use(express.json());

const PORT = process.env.PORT || 4000; 

app.get("/", (req, res) => {
  res.json({
    BackendServer: 'Running Successfully',
  });
});

//calling the routes here as such
app.use("/api/v1/", ResumeRoute);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
