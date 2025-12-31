require('dotenv').config(); 
//call db connection later on in the server.js file JUST the connection   

const app = require("./app.js"); 
const PORT = process.env.PORT || 6000; 

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
