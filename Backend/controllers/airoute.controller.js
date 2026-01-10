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
        You are an expert interview coach. Turn the following resume experience into a concise, confident, and natural spoken interview answer.

        Role:
        ${title}

        Resume bullets:
        ${bullets.map(b => `- ${b}`).join("\n")}

        Instructions:
        - Speak conversationally (not robotic)
        - Focus on **impact, decisions, and outcomes**
        - Strictly **1-3 sentences**
        - Time-limited to ~45 seconds if spoken aloud
        - No repetition of bullets
        - Never ramble or add filler
        - Keep the wordcount STRICTLY 80 words
        - Do not include introductions like "Sure" or "Here’s an example"
        - Avoid restating bullet text word-for-word
        - Output **only the spoken response**, nothing else

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
