import CameraPreview from "../components/CameraMic";
import useContinuousSpeech from "../components/speechtotext";
import Aurora from "../backgrounds/auroura";

function InterviewSimulation() {
  const question = "Tell us about your experience at FlowState";
  const { transcript } = useContinuousSpeech();

  const question_and_answers = {
    qa_pairs: [
      {
        question: question,
        answer: transcript
      }
    ]
  };
 
  // route set up in the backend check backend -> 
  // incorrect backend port and instantiation  
  // recommendation suggested on PR check 
  fetch("http://localhost:5434/api/v1/grade-answers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(question_and_answers)
  })
  .then(res => res.json())
  .then(result => console.log(result))
  .catch(err => console.error(err));


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

        <CameraPreview />

        <h2
          style={{
            color: "white",
            fontSize: "30px",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          {question}
        </h2>
      </div>
      <Aurora />
    </div>
  );
}

export default InterviewSimulation;
