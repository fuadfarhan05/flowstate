
const CODE = process.env.ACCESS_CODE || "";

const accessController = (req, res) => { 
    const submittedCode = typeof req.body?.accessCode === "string"
      ? req.body.accessCode.trim()
      : "";
    const expectedCode = CODE.trim();

    if (!submittedCode) { 
       return res.status(400).json({ 
        validation: "Error, not a valid access code please enter a valid code"
       }); 
    } 

    try {  
        if (submittedCode === expectedCode) { 
            res.status(200).json({ 
                validation: "Access code valid. User allowed for beta testing."
            }); 
        } else { 
            return res.status(401).json({
                  validation: "Failed, invalid access code entered."
            });
        }
    } catch(error) { 
        res.status(500).json({ 
            validation: "Server error"
        }); 
    }
}; 

module.exports = accessController; 
