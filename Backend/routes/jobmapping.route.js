const express = require("express");

const JobMappingRoute = express.Router();
const JobMappingController = require("../controllers/jobmapping.controller.js");

JobMappingRoute.post("/job-mapping", JobMappingController);

module.exports = JobMappingRoute;
