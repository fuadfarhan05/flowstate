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
You are an expert interview coach.

Return ONLY valid JSON in this exact shape:

{
  "openingLine": "",
  "tasks": [],
  "impact": ""
}

Rules:
- openingLine: 1 sentence
- tasks: ONLY 3 bullet items, simple but specific
- impact: 1 concrete outcome

Role:
${title}

Resume bullets:
${bullets.map((b) => `- ${b}`).join("\n")}
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

    // 🔹 1. Get raw text
    const rawOutput = completion.choices[0].message.content;

    // 🔹 2. Parse JSON safely
    let parsedScript;
    try {
      parsedScript = JSON.parse(rawOutput);
    } catch (parseError) {
      console.error("JSON Parse Error:", rawOutput);

      return res.status(500).json({
        errorMessage: "AI returned invalid JSON",
        rawOutput,
      });
    }

    // 🔹 3. Return structured data
    res.json({
      message: "AI script generated successfully",
      script: parsedScript,
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
