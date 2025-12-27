//Instantiate an Express App for backend.
// this will be the main server file here as such
require('dotenv').config(); 
const app = require('./app.js');  

const PORT = process.env.PORT || 4000; 

app.get("/", (req, res) => {
  res.json({
    BackendServer: 'Running Successfully',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
