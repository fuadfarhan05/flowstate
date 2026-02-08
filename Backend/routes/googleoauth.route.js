const express = require("express");
const googleRoute = express.Router();
const googleRouteController = require("../controllers/googleauth.controller.js");

googleRoute.get("/googleauth", googleRouteController);

module.exports = googleRoute;
