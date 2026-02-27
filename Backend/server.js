require("dotenv").config();
const DBconnection = require("./config/dbconnection.js");
DBconnection(); // calls the connection here

const app = require("./app.js");
const PORT = process.env.PORT || 5000; // hardcoded port.

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
