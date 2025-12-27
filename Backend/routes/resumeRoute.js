const express = require("express");
const multer = require("multer");
const resumeRoute = express.Router();
const resumeparsing = require("../controllers/resumeparselogic.js");  

const upload = multer({
  dest: "uploads/", // right now this is local disk so it just creates a folder called uploads holding all folders we can transfer this to our database later.
});   

resumeRoute.post("/Resumeparse", upload.single("ResumeFile"), resumeparsing);   

module.exports = resumeRoute;
