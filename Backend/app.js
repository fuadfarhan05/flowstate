const express = require("express");
const cors = require("cors");
const app = express();

const envOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  ...envOrigins,
]);

//middle ware here
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no Origin header) and configured frontend origins.
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  }),
);

//Importing routes here as such
const Airoute = require("./routes/AI.route.js");
const interviewsimRoute = require("./routes/interviewsim.route.js");
const ElevenLabsRoute = require("./routes/scribeToken.route.js");
const GenerateQuestionsRoute = require("./routes/genquestions.route.js");
const GradeAnswerRoute = require("./routes/gradeanswer.route.js");
const userRoute = require("./routes/user.route.js");
const googleOauth = require("./routes/googleoauth.route.js");
const ExperienceQuestionRoute = require("./routes/experienceq.route.js");
const AccessRoute = require("./routes/access.route.js")

app.get("/", (req, res) => {
  res.json({
    Server: "Successfully running",
  });
});

//Initialize the routes to be called.
app.use("/api/v1/", Airoute);
app.use("/api/v1/", interviewsimRoute);
app.use("/api/v1/", ElevenLabsRoute);
app.use("/api/v1/", GenerateQuestionsRoute);
app.use("/api/v1/", GradeAnswerRoute);
app.use("/api/v1/", ExperienceQuestionRoute);
app.use("/api/v1/", userRoute);
app.use("/api/v1/", AccessRoute);
app.use("/", googleOauth);

module.exports = app;
