const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const DBconnection = require("./config/dbconnection.js");
DBconnection(); // calls the connection here

const app = require("./app.js");
const PORT = 5434; // hardcoded port.

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
