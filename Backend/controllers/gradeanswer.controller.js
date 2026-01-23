const GradeAnswer = async (req, res) => {
    try { 
        const { question, answer } = req.body;
        if (!question || !answer) {
            return res.status(400).json({error: "both question and answer are required for grade"});
        }

        console.log("recieved, ready to grade");
        res.status(200).send();
    } catch(error) {
        console.log("error with grade route", error);
        res.status(500).json({ error: "grading failed" });
    }
};

module.exports = GradeAnswer;