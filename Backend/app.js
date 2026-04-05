const express = require("express");
const cors = require("cors");
const app = express();

/**
 * CORS Configuration
 */
const configuredOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://flowstatebetatesting.vercel.app",
  ...configuredOrigins,
]);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

/**
 * Middleware
 */
app.use(express.json());
app.use(cors(corsOptions)); 

/**
 * Routes
 */
const Airoute = require("./routes/AI.route.js");
const interviewsimRoute = require("./routes/interviewsim.route.js");
const GenerateQuestionsRoute = require("./routes/genquestions.route.js");
const GradeAnswerRoute = require("./routes/gradeanswer.route.js");
const userRoute = require("./routes/user.route.js");
const googleOauth = require("./routes/googleoauth.route.js");
const ExperienceQuestionRoute = require("./routes/experienceq.route.js");
const AssemblyRoute = require("./routes/assembly.route.js");
const AccessRoute = require("./routes/access.route.js");
//const ElevenLabsRoute = require("./routes/scribeToken.route.js");

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.json({
    server: "Successfully running",
  });
});

/**
 * API routes
 */
app.use("/api/v1/", Airoute);
app.use("/api/v1/", interviewsimRoute);
app.use("/api/v1/", GenerateQuestionsRoute);
app.use("/api/v1/", GradeAnswerRoute);
app.use("/api/v1/", ExperienceQuestionRoute);
app.use("/api/v1/", userRoute);
app.use("/api/v1/", AssemblyRoute);
//app.use("/api/v1/", ElevenLabsRoute);
app.use("/api/v1/", AccessRoute);

// OAuth routes (intentionally not under /api/v1)
app.use("/", googleOauth);

/**
 * Export app
 */
module.exports = app;