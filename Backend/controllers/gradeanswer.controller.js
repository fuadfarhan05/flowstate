const GradeAnswer = async (req, res) => {
  //for now route just takes in response.
  try {
    const { question, answer } = req.body;
    if (
      !question ||
      question.trim() === "" ||
      !answer ||
      answer.trim() === ""
    ) {
      return res
        .status(400)
        .json({ error: "both question and answer are required for grade" });
    }

    console.log("recieved, ready to grade");
    return res.status(200).send();
  } catch (error) {
    console.log("error with grade route", error);
    return res.status(500).json({ error: "grading failed" });
  }
};

module.exports = GradeAnswer;
