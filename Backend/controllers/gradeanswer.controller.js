const OpenAi = require('openai'); 
const client = new OpenAi({ 
    apiKey: process.env.OPENAI_API_KEY,
}); 

const GradeAnswer = async (req, res) => {
  try {
    const { transcriptlog } = req.body;
        if (!transcriptlog?.trim()) {
            return res.status(400).json(
                { 
                    error: "No Transcript Log has been provided" 
                }
            );
        }
    console.log("recieved, ready to grade"); 

    const prompt = `
        You are an interview communication evaluator.
        You will be given a whole interview transcript log with a collection of questions and answers,
        your job is to evaluate it on how well a user communicated their answers.

        You will be given:
        - The interview questions
        - The user's spoken answers (transcribed)

        Focus on communication quality, clarity, and structure.
        Do NOT penalize normal human speech patterns.

        ––––––––––––––––––––
        GRADING DIMENSIONS
        ––––––––––––––––––––

        1. CLARITY (0–10)
        Evaluate how easy the answer was to understand.
        Consider:
        - Clear sentences vs run-on or fragmented speech
        - Logical flow of ideas
        - Overuse of filler words that interrupt understanding

        Filler words:
        - Identify filler words such as "um", "uh", "like", "you know"
        - Count "like" as a filler ONLY when it is used as hesitation, not when it has semantic meaning
        - Some filler words are normal; only penalize excessive or disruptive usage

        2. STRUCTURE (0–10)
        Evaluate whether the answer followed an appropriate structure for the question type.

        First, identify the question type:
        - Behavioral / experience-based
        - Self-introduction
        - Opinion or hypothetical
        - Technical explanation

        Then evaluate structure accordingly:
        - Behavioral questions: Look for elements of STAR (Situation, Task, Action, Result), but do not require perfect labeling
        - Self-introduction: Look for a clear beginning, middle, and end (past → present → future is acceptable)
        - Opinion questions: Look for a clear claim, reasoning, and example
        - Technical explanations: Look for step-by-step logical ordering

        Partial structure is acceptable. Do not grade strictly.

        3. RELEVANCE (0–10)
        Evaluate how directly the answer addressed the question.
        Consider:
        - Did the user stay on topic?
        - Did they meaningfully respond to what was asked?
        - Did they ramble or drift into unrelated details?

        Use conversation context if provided to judge relevance.

        Additionally, give a percentage grade as well from 0 - 100.

        ––––––––––––––––––––
        OUTPUT FORMAT
        ––––––––––––––––––––

        Return a JSON object with:

        {
        "clarity_score": number,
        "structure_score": number,
        "relevance_score": number,
        "filler_words": {
            "count": number,
            "examples": [list of example filler usages]
        },
        "strengths": [1–3 short bullet points],
        "improvements": [1–3 specific, actionable suggestions],
        "overall_feedback": "Short, encouraging summary focused on speaking improvement",
        "overall_percentage_grade: number
        }

        Tone:
        - Supportive and constructive
        - Assume the user is practicing and improving
        - Do not shame or over-criticize

        IMPORTANT:
        Return ONLY valid JSON.
        Do not include markdown, explanations, or extra text.
    `;


    const AIresponse = await client.chat.completions.create({  
        model: 'gpt-4o-mini',
        messages: [
            { 
                role: 'system',
                content: prompt
            }, 
            {
                role: 'user',
                content: transcriptlog
            }
        ] 
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
