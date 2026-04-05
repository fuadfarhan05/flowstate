const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const JobMappingController = async (req, res) => {
  const { jobPosting, targetRole } = req.body;

  if (!jobPosting || typeof jobPosting !== "string" || jobPosting.trim() === "") {
    return res.status(400).json({
      errorMessage: "jobPosting must be a non-empty string",
    });
  }

  try {
    const roleContext = targetRole ? `The candidate is applying for: ${targetRole}.\n\n` : "";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a career coach helping candidates understand what a job truly needs. Given a job posting, identify the key pain points, challenges, or inferences about what the company is struggling with and needs help solving. Be concise and insight-driven.",
        },
        {
          role: "user",
          content: `${roleContext}Job Posting:\n${jobPosting.trim()}\n\nBased on this job posting, identify 4-6 inferences about what this company likely needs help with — the real problems or gaps they are trying to solve by hiring for this role. Return ONLY valid JSON in this exact shape:\n\n{\n  "inferences": [\n    { "title": "short label", "description": "1-2 sentence explanation" }\n  ]\n}`,
        },
      ],
      temperature: 0.7,
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

    if (!parsed || !Array.isArray(parsed.inferences)) {
      return res.status(500).json({
        errorMessage: "Model returned malformed inferences array",
        raw: parsed,
      });
    }

    res.json({ inferences: parsed.inferences });
  } catch (error) {
    console.error("Error generating job mapping:", error);
    res.status(500).json({
      errorMessage: "Failed to generate job mapping",
      detail: error.message,
    });
  }
};

module.exports = JobMappingController;
