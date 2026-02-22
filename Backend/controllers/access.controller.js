
const CODE = process.env.ACCESS_CODE;

const accessController = (req, res) => { 
    const { accessCode } = req.body; 

    if (!accessCode || accessCode === "") { 
       return res.status(400).json({ 
        validation: "Error, not a valid access code please enter a valid code"
       }); 
    } 

    try {  
        if (accessCode === CODE) { 
            res.status(200).json({ 
                Validation: 'Access Code valid user allowed for beta testing'
            }); 
        } else { 
            return res.status(401).json({
                  Validation: "Failed, Invalid Access Code entered"
            });
        }
    } catch(error) { 
        res.status(500).json({ 
            Validation: "Server Error"
        }); 
    }
}; 

module.exports = accessController; 