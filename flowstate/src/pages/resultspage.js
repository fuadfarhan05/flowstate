import { useLocation } from "react-router-dom";
import "../styles/results.css";

function Results() {
  const location = useLocation();
  const { evaluation } = location.state || {};
  const fillerAnalysis = evaluation?.filler_analysis;
  const topFillers = Object.entries(fillerAnalysis?.filler_counts || {})
    .slice(0, 5)
    .map(([word, count]) => `${word} (${count})`)
    .join(", ");

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

            {fillerAnalysis && (
              <div className="fillerwords-summary">
                <p>
                  <strong>{fillerAnalysis.filler_density_percent}%</strong> | Speed:{" "}
                  <strong>{fillerAnalysis.speaking_speed_wpm ?? "N/A"} WPM</strong>
                </p>
                <p>
                  Top filler words: <strong>{topFillers || "none yet"}</strong>
                </p>
              </div>
            )}
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
