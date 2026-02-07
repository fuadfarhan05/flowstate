// google auth controller here 
// call the user model here as such 
const userModel = require('../Model/users.js'); 

const authController = async (req, res) => { 
    const { code } = req.query; 

    // handle some basic error handling here as such 
    if (!code) { 
        return res.status(400).json({ 
            Error: 'No google Auth code provided'
        }); 
    }  

    const client_id = process.env.CLIENTID; 
    const client_secret = process.env.CLIENTSECRET;  
    const redirect_uri = process.env.RDURI;
    const grant_type = 'authorization_code'; 

    const sendtogoogleapi = await fetch(`https://oauth2.googleapis.com/token`, { 
        method: "POST", 
        headers: { 
            "Content-type": "application/json"
        }, 
        body: JSON.stringify({ 
            code, 
            client_id, 
            client_secret, 
            redirect_uri, 
            grant_type,
        }),
    })

    if (!sendtogoogleapi.ok){ 
        return res.status(500).json({ 
            Error: 'Error sending data to google oAuth API'
        }); 
    } 

    const token = await sendtogoogleapi.json(); 

}  


module.exports = authController; 