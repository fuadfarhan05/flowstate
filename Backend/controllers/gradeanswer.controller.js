const OpenAi = require('openai'); 
const client = new OpenAi({ 
    apiKey: process.env.OPENAIAPIKEY
}); 

const GradeAnswer = async (req, res) => {
  //for now route just takes in response.
  try {
    const { question, answer } = req.body;
        if (!question || question.trim() === "" || !answer || answer.trim() === "") {
            return res.status(400).json(
                { 
                    error: "both question and answer are required for grade" 
                }
            );
        }
    console.log("recieved, ready to grade"); 
    console.log("sending grade to the backend now"); 

    const AIresponse = await client.chat.completions.create({  
        model: 'gpt-4o-mini',
        messages: [
            { 
            role: 'system',
            content: 'Fuad enter research here about prompt'
            }, 
            { 
                role: 'user', 
                content: `Question asked: ${question}\n\n Answer Given: ${answer}` 
            }
        ] 
    }); 
    const AiEvaluation = { evaluation: AIresponse.choices[0].message.content }; // in the frontend remember to call the Evaluation key to get the AI data to show in the frontend.  
    console.log(AiEvaluation); 
    return res.status(200).json({ 
        AiEvaluation // remember this is already an object. 
    }); 
  } catch (error) {
    console.log("error with grade route", error);
    return res.status(500).json({ error: "grading failed" });
  }
};

module.exports = GradeAnswer;
