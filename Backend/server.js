//Instantiate an Express App for backend.
// this will be the main server file here as such
const express = require("express");
const app = express();

//Importing routes here as such
const ResumeRoute = require("./routes/resumeRoute.js");

//basic middleware
app.use(express.json());

const PORT = 3500 || 6500;

app.get("/", (req, res) => {
  res.send({
    BackendRunning: true,
  });
});

//calling the routes here as such
app.use("/api/v1/", ResumeRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
