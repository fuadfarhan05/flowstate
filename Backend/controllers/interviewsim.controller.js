//Controller handle file 

const interviewController = async (req, res) => { 
    // get the frontend data here as such first i implement try and catch case since that is best practice 
    //goal of this controller is to just have it where it just recieves the data from the frontend.  
    try { 
        const {question_and_answers} = req.body;  
        if (!question_and_answers){ 
            return res.status(400).json({ 
                Error: 'No Array - object data recieved in the backend through this POST request'
            }); 
        }  
        return res.status(200),json({ 
            backendRecieved: question_and_answers
        }); 
        // for now I will just output the data that is sent from the frontend here as such 
        console.log(question_and_answers); 
    } catch(error) { 
        console.log('Error retrieving data', error); 
        res.status(500).json({ 
            Message: 'No data recieved in backend server', 
            DetailedError: error
        }); 
    }
} 

module.exports = interviewController; 