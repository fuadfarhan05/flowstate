const jwt = require("jsonwebtoken");

const tokenCheck = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // check token
  if (token == null) {
    return res.status(401).json({
      Error: "No valid token to validate",
    });
  }

  // use the verify function to verify the tokens
  jwt.verify(token, process.env.JWT_SECRET, (err, email) => {
    if (err) {
      return res.status(403).json({
        invalidToken: "No Access",
      });
    }
    req.email = email;
    next();
  });
};

module.exports = tokenCheck;
