//Controller handle file 

const interviewController = async (req, res) => { 
    // get the frontend data here as such first i implement try and catch case since that is best practice 
    //goal of this controller is to just have it where it just recieves the data from the frontend.  
    try { 
        const { qa_pairs } = req.body;

        if (!qa_pairs || !Array.isArray(qa_pairs) || qa_pairs.length === 0) {
            return res.status(400).json({
                error: "No Q&A pairs received"
            });
        }  
        return res.status(200).json({ 
            message: 'Data received successfully',
            data: qa_pairs
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