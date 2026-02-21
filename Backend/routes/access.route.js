// Skeleton route for AI implementation.
const express = require("express");

const AccessRoute = express.Router();
const AccessController = require("../controllers/access.controller.js");

//TODO: Set up Ai route to send data from the python service.
AccessRoute.post("/generate-script", AccessController);

module.exports = AccessRoute;
