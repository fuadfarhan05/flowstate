const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ExperienceqController = async (req, res) => {
  const { experiences } = req.body;

  // 🔒 Hard validation
  if (
    !Array.isArray(experiences) ||
    experiences.length === 0 ||
    !experiences.every((e) => typeof e === "string")
  ) {
    return res.status(400).json({
      errorMessage: "Experiences must be a non-empty array of strings",
    });
  }

  try {
    const formattedExperiences = JSON.stringify(experiences, null, 2);

    const prompt = `
You are given an array of candidate experiences.

Array length: ${experiences.length}

For EACH experience, generate EXACTLY ONE concise behavioral interview question.
Each question must clearly relate to the corresponding experience.

Return ONLY valid JSON in this exact shape:

{
  "questions": []
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an interview question generator. Generate one concise behavioral interview question per experience.",
        },
        {
          role: "user",
          content: `Experiences:\n${formattedExperiences}\n\n${prompt}`,
        },
      ],
      temperature: 0.6,
    });

    const output = completion.choices[0].message.content.trim();

    let parsed;
    try {
      parsed = JSON.parse(output);
    } catch {
      console.error("Raw model output:", output);
      return res.status(500).json({
        errorMessage: "Invalid JSON returned from model",
        raw: output,
      });
    }

    if (
      !parsed ||
      !Array.isArray(parsed.questions) ||
      parsed.questions.length !== experiences.length
    ) {
      return res.status(500).json({
        errorMessage: "Model returned malformed questions array",
        raw: parsed,
      });
    }

    res.json({
      message: "Generated one question per experience",
      questions: parsed.questions,
    });
  } catch (error) {
    console.error("Error generating questions:", error);

    res.status(500).json({
      errorMessage: "Failed to generate questions",
      detail: error.message,
    });
  }
};

module.exports = ExperienceqController;
