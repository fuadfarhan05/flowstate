const express = require("express");
const AssemblyRoute = express.Router();

const createAssemblyToken = require("../controllers/assembly.controller.js");

AssemblyRoute.get("/assembly-token", createAssemblyToken);

module.exports = AssemblyRoute;
