const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const Aicontroller = async (req, res) => {
  try {
    const { title, bullets } = req.body;

    if (!title || !Array.isArray(bullets) || bullets.length === 0) {
      return res.status(400).json({
        errorMessage: "Missing or invalid experience data",
      });
    }

    const prompt = `
        You are an interview coach. Turn this resume experience into a concise, confident, 
        and natural spoken interview response using STAR Method (Situation, Task, Action, Results)
        Use the given text to help you but don't generate interview responses are word for word of the
        text  
        Role:
        ${title}

        Resume bullets:
        ${bullets.map(b => `- ${b}`).join("\n")}

        Rules:
        - Conversational, not robotic
        - No bullet repetition
        - 30–60 seconds spoken
        - Must be 3-5 sentences
        - Focus on impact and decisions
        - Only generate what your asked to do not generate 
          affimative messages for requests 
        `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You help users explain resume experiences in interviews.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
    });

    res.json({
      message: "AI script generated successfully",
      script: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("AI Script Error:", error);

    res.status(500).json({
      errorMessage: "Failed to generate AI script",
      details: error.message,
    });
  }
};

module.exports = Aicontroller;
