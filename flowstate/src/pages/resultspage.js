import { useLocation } from "react-router-dom";
import "../styles/results.css";

function Results() {
  const location = useLocation();
  const { evaluation } = location.state || {};

  if (!evaluation) {
    return <h1 style={{ color: "white", fontSize: '19px'}}>No results available</h1>;
  }

  return (
    <div className="body">
      <div className="results-card">
        <div className="results-card-content">
          
          {/* Overall Grade */}
          <div className="results">
            <p
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              Your Grade
            </p>
            <h1>{evaluation.overall_percentage_grade}%</h1>
          </div>

          <div className="glass-line" />

          {/* Feedback */}
          <div className="feedback-section">
            <h2>Clarity</h2>
            <p>{evaluation.clarity_feedback}</p>

            <h2 style={{ marginTop: "20px" }}>Structure</h2>
            <p>{evaluation.structure_feedback}</p>

            <h2 style={{ marginTop: "20px" }}>Relevance</h2>
            <p>{evaluation.relevance_feedback}</p>

            <h2 style={{ color: "#fffeb1", marginTop: "20px" }}>
              Filler Words Used
            </h2>
            <p>{evaluation.filler_words}</p>
          </div>

          <div className="glass-line" />

          {/* Improvements */}
          <h2 style={{ textAlign: "center" }}>
            Actionable Improvements
          </h2>

          <ul style={{color: 'white'}}>
            {evaluation.improvements?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <button className="save-btn">
            Save Grade
          </button>

        </div>
      </div>
    </div>
  );
}

export default Results;
