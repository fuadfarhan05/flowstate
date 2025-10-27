//Instantiate an Express App for backend.  
// this will be the main server file here as such 
const express = require('express'); 
const app = express(); 

//basic middleware 
app.use(express.json());  

const PORT = 3500 || 6500; 

app.get('/', (req, res) => { 
    res.send({ 
        BackendRunning: true
    }); 
}); 

app.listen(PORT, () => { 
    console.log(`Server running on http://localhost:${PORT}`); 
});