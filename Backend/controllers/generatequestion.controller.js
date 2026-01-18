const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const GenerateQuestions = async (req, res) => {
  try {
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({ error: "Answer is required" });
    }

    const prompt = `
      You are an AI interviewer.

      The candidate just gave the following answer:

      "${answer}"

      Your task:
      1. Identify the core topic of the answer
      2. Drill deeper into that topic
      3. Ask ONE clear, concise follow-up interview question
      4. Do NOT give feedback or explanations
      5. Only return the next question
      `;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const nextQuestion = response.output_text;

    res.json({
      question: nextQuestion,
    });
    console.log("answer recieved, generating new question")
  } catch (error) {
    console.error("Error generating question:", error);
    res.status(500).json({ error: "Failed to generate question" });
  }
};

module.exports = GenerateQuestions;
