require("dotenv").config();
const DBconnection = require("./config/dbconnection.js");
DBconnection(); // calls the connection here

const app = require("./app.js");
const PORT = 5434; // hardcoded port.

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
