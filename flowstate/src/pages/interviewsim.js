import CameraPreview from "../components/CameraMic";
import useContinuousSpeech from "../components/speechtotext";
import {useState} from 'react'
import Aurora from "../backgrounds/auroura";
import { useLocation } from "react-router-dom";

function InterviewSimulation() {

  const location = useLocation();
  const experienceTitle = location.state?.experienceTitle;
  
  const [count, setCount] = useState(0);
  const questionList = [
  `Tell me about your experience at ${experienceTitle}`,
  "What challenges did you face during this experience?",
  "What impactful contributions did you make in this experience?"
];

  
  const { transcript } = useContinuousSpeech();

  const questionrender =
  count < questionList.length
    ? questionList[count]
    : "You're Done";

  function nextQuestion() {
    if (count < questionList.length) {
      gradeAnswer(count);
      setCount(prev => prev + 1);
    }
  }


  const gradeAnswer = async () => {
      const question_and_answers = {
      qa_pairs: [
        {
          question: questionList[count],
          answer: transcript
        }
      ]
    };
      try {
        const res = await fetch("http://localhost:5434/api/v1/grade-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question_and_answers)

      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      console.log(result);


      } catch(error) {
        console.log("failed to retrieve your answer", error);
      }
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: "#05080d"
      }}
    >
      {/* 🌌 Background Aurora */}
      

      {/* 🔝 Foreground Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            left: "30px",
          }}
        >
          <h3 style={{ color: "white", fontSize: "25px", margin: 0 }}>
            FlowState
          </h3>
          <h3
            style={{
              color: "#80e1f9",
              fontSize: "25px",
              marginLeft: "6px",
            }}
          >
            Interviews
          </h3>
        </div>
        <h2
          style={{
            color: "white",
            fontSize: "30px",
            textAlign: "center",
            marginTop: "-15px",
          }}
        >
          Q: {questionrender}
        </h2>

        <CameraPreview />
        
        <p style={{color:'white'}}>{transcript}</p>
        <button className="next-button" onClick={nextQuestion}>Next Question</button>
      </div>
      
    </div>
  );
}

export default InterviewSimulation;
