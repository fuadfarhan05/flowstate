const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ExperienceqController = async (req, res) => {
  const { experiences, experienceDetails } = req.body;

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
    // Build a richer context string using bullet points when available
    const formattedExperiences = experiences
      .map((exp, i) => {
        const bullets = experienceDetails?.[exp];
        const bulletText =
          Array.isArray(bullets) && bullets.length > 0
            ? "\n" + bullets.filter((b) => b.trim()).map((b) => `  ${b}`).join("\n")
            : "";
        return `${i + 1}. ${exp}${bulletText}`;
      })
      .join("\n\n");

    const prompt = `
You are given a list of candidate work experiences, each with their resume bullet points.

Total experiences: ${experiences.length}

For EACH experience, generate EXACTLY ONE concise behavioral interview opener question.
Use the bullet points to make the question specific and relevant to what the candidate actually did.

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
