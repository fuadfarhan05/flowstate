const express = require("express");
const userRoute = express.Router();

//call both functions from the controller
const {
  loginFunction,
  signUpFunction,
} = require("../controllers/userslogsignup.controller.js");

//call the middleware function
const checkToken = require("../middleware/checktoken.middleware.js");

// set up two routes here one for login and one for sign up
userRoute.post("/login", loginFunction);
userRoute.post("/signup", signUpFunction);

userRoute.get("/confirm", checkToken, (req, res) => {
  res.json({
    message: "User details protected",
    user: req.email,
  });
});

module.exports = userRoute;
