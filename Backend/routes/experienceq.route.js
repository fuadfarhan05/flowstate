const express = require("express");

const ExperienceQuestionRoute = express.Router();
const ExperienceqController = require("../controllers/experienceq.controller.js");

ExperienceQuestionRoute.post("/generate-experiencequestions", ExperienceqController);

module.exports = ExperienceQuestionRoute;
