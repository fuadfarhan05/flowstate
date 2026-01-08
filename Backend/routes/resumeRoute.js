const express = require("express");
const resumeRoute = express.Router();
const multer = require("multer"); 
const resumeparsing = require("../controllers/resumeparselogic.controller.js"); 

// handle the uploads here
const upload = multer({
  dest: "uploads/", // right now this is local disk so it just creates a folder called uploads holding all folders we can transfer this to our database later.
});

resumeRoute.post("/Resumeparse", upload.single("upload"), resumeparsing);

module.exports = resumeRoute;
