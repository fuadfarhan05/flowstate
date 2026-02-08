// google auth controller here 
// call the user model here as such 
const userModel = require('../Model/users.js');
const jwt = require('jsonwebtoken'); 

const authController = async (req, res) => {  

    try { 
    const { code } = req.query; 

    // handle some basic error handling here as such 
    if (!code) { 
        return res.status(400).json({ 
            Error: 'No google Auth code provided'
        }); 
    }   

    // define the things we need here as such 
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

    if (!token){ 
        return res.status(400).json({ 
            Error: "No Token returned from backend call"
        });
    }  

    // now we need another call here to get the details and then set up a token 
    const userDetails = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo`, { 
        method: "GET", 
        headers: { 
            "Authorization": `Bearer ${token.access_token}`
        }
    }); 

    if (!userDetails.ok){ 
        return res.status(500).json({ 
            Error: 'Invalid token recieved'
        }); 
    }  

    const detailsfromtoken = await userDetails.json(); 

    if (!detailsfromtoken.id || !detailsfromtoken.email || !detailsfromtoken.name ){ 
        return res.status(400).json({ 
            Error: 'user details missing'
        }); 
    } 

    // defined empty for now. 
    let user;
    const checkExistingUser = await userModel.findOne({ email: detailsfromtoken.email });
    if (checkExistingUser) {
        checkExistingUser.googleid = detailsfromtoken.id;
        await checkExistingUser.save();
        user = checkExistingUser;
    } else {
        const newUser = new userModel({
            name: detailsfromtoken.name,
            email: detailsfromtoken.email,
            googleid: detailsfromtoken.id,
        });
        await newUser.save();
        user = newUser;
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "2d",
    });

    return res.status(200).json({
        token: jwtToken,
        message: "Google authentication successful",
    });
    } catch (error) { 
        return res.status(500).json({ 
            Error: "Getting token data from the google api failed, try again"
        }); 
    }
}  

module.exports = authController; 