const OpenAi = require("openai");
const client = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
});

const GradeAnswer = async (req, res) => {
  try {
    const { transcriptlog } = req.body;
    if (!transcriptlog?.trim()) {
      return res.status(400).json({
        error: "No Transcript Log has been provided",
      });
    }
    console.log("recieved, ready to grade");


    const prompt = `
      You are an interview communication evaluator.

      You will be given a full interview transcript containing questions and the user's spoken answers (transcribed).

      Your job is to evaluate how well the user communicated their answers.
      Focus ONLY on communication quality — not correctness of content.

      Do NOT penalize normal human speech patterns.

      ––––––––––––––––––––––
      GRADING DIMENSIONS
      ––––––––––––––––––––––

      1. CLARITY
      Evaluate how easy the user's answers were to understand.
      Consider:
      - Sentence clarity and coherence
      - Logical flow of ideas
      - Whether filler words disrupted understanding

      Output exactly TWO sentences:
      - Sentence 1: One specific thing the user did well in clarity, referencing something they actually said
      - Sentence 2: One specific thing the user should improve in clarity, referencing their actual speech patterns

      2. STRUCTURE
      First identify the question type based on the transcript:
      - Behavioral / experience-based
      - Self-introduction
      - Opinion or hypothetical
      - Technical explanation

      Then evaluate structure accordingly:
      - Behavioral: elements of STAR (Situation, Task, Action, Result)
      - Self-intro: clear beginning, middle, end
      - Opinion: claim → reasoning → example
      - Technical: step-by-step explanation

      Output exactly TWO sentences:
      - Sentence 1: One specific structural strength in the user's answer
      - Sentence 2: One specific structural improvement they should make

      3. RELEVANCE
      Evaluate how directly the user answered the question.

      Output exactly TWO sentences:
      - Sentence 1: One specific way the user stayed relevant to the question
      - Sentence 2: One specific way they drifted, rambled, or could stay more focused

      4. FILLER WORDS
      Identify filler words used by the user such as:
      "um", "uh", "like", "you know"

      Rules:
      - Count "like" ONLY when used as hesitation, not semantic meaning
      - If none were used, return an empty string

      Output:
      - A single comma-separated string of filler words used (no explanations)

      ––––––––––––––––––––––
      FINAL OUTPUT
      ––––––––––––––––––––––

      Return ONLY valid JSON in this exact format:

      {
        "clarity_feedback": "sentence describing what was done well. sentence describing what to improve.",
        "structure_feedback": "sentence describing what was done well. sentence describing what to improve.",
        "relevance_feedback": "sentence describing what was done well. sentence describing what to improve.",
        "filler_words": "um, like, you know",
        "improvements": [
          "1–3 highly specific, actionable suggestions based on what the user actually said"
        ],
        "overall_percentage_grade": number
      }

      IMPORTANT RULES:
      - Use the transcript content directly in your feedback
      - NO generic advice
      - NO markdown
      - NO extra text
      - Output MUST be valid JSON only
      `;

        

    const AIresponse = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: transcriptlog,
        },
      ],
    });
    const content = AIresponse.choices[0]?.message?.content;
    if (!content) {
      return res.status(500).json({ error: "AI returned no evaluation" });
    }

    // parse the string JSON
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      console.error("Failed to parse AI JSON:", content);
      return res.status(500).json({ error: "AI returned invalid JSON" });
    }

    return res.status(200).json({ evaluation: parsed });
  } catch (error) {
    console.log("error with grade route", error);
    return res.status(500).json({ error: "grading failed" });
  }
};

module.exports = GradeAnswer;
