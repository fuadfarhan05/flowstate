import { useLocation } from "react-router-dom";
import "../styles/results.css";

function Results() {
  const location = useLocation();
  const { evaluation } = location.state || {};

  if (!evaluation) {
    return <h1 style={{ color: "white" }}>No results available.</h1>;
  }

  return (
    <div className="body">
      <div className="results-card">
        <div className="results-card-content">
          
          {/* Overall Grade */}
          <div className="results">
            <p style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>
              Your Grade:
            </p>
            <h1 style={{ marginLeft: "10px", fontSize: "50px" }}>
              {evaluation.overall_percentage_grade}%
            </h1>
          </div>

          <div className="glass-line"></div>

          {/* Feedback Sections */}
          <div style={{ color: "white", width: "600px", margin: "0 auto" }}>
            
            <h2 style={{ color: "#6bb4fd" }}>Clarity</h2>
            <p>{evaluation.clarity_feedback}</p>

            <h2 style={{ color: "#6bb4fd", marginTop: "20px" }}>Structure</h2>
            <p>{evaluation.structure_feedback}</p>

            <h2 style={{ color: "#6bb4fd", marginTop: "20px" }}>Relevance</h2>
            <p>{evaluation.relevance_feedback}</p>

            <h2 style={{ color: "#fffeb1", marginTop: "20px" }}>Filler Words Used</h2>
            <p>{evaluation.filler_words}</p>

          </div>

          <div className="glass-line"></div>

          {/* Improvements */}
          <h2
            style={{
              color: "#6bb4fd",
              marginTop: "20px",
            }}
          >
            Actionable Improvements
          </h2>

          <ul
            style={{
              color: "white",
              width: "600px",
              margin: "0 auto",
              textAlign: "left",
            }}
          >
            {evaluation.improvements &&
              evaluation.improvements.map((item, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  {item}
                </li>
              ))}
          </ul>

          <button
            style={{
              marginTop: "40px",
              width: "200px",
              height: "50px",
              borderRadius: "30px",
              fontSize: "20px",
              border: "none",
              backgroundColor: "#6bb4fd",
              color: "black",
            }}
          >
            Save Grade
          </button>

        </div>
      </div>
    </div>
  );
}

export default Results;
