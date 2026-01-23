// Skeleton route for AI implementation.
const express = require("express");

const AIroute = express.Router();
const Aicontroller = require("../controllers/airoute.controller.js");

//TODO: Set up Ai route to send data from the python service.
AIroute.post("/generate-script", Aicontroller);

module.exports = AIroute;
