//Controller handle file 

const interviewController = async (req, res) => { 
    // get the frontend data here as such first i implement try and catch case since that is best practice 
    //goal of this controller is to just have it where it just recieves the data from the frontend.  
    try { 
        const {question_and_answers} = req.body;  
        if (!question_and_answers){ 
            return res.status(400).json({ 
                error: 'No Q&A data received in the backend through this POST request'
            }); 
        }  
        return res.status(200).json({ 
            message: 'Data received successfully',
            data: question_and_answers
        });
    } catch(error) { 
        console.error('Error retrieving data:', error); 
        return res.status(500).json({ 
            error: 'Server error processing data', 
            details: error.message
        }); 
    }
} 

module.exports = interviewController; 