import { useLocation } from "react-router-dom";
import "../styles/results.css";

function Results() {
  const location = useLocation();
  const { evaluation } = location.state || {};
  const fillerAnalysis = evaluation?.filler_analysis;
  const starAnalysis = evaluation?.star_analysis;
  const topFillers = Object.entries(fillerAnalysis?.filler_counts || {})
    .slice(0, 5)
    .map(([word, count]) => `${word} (${count})`)
    .join(", ");

  const STAR_COMPONENTS = [
    { key: "situation", label: "Situation" },
    { key: "task",      label: "Task" },
    { key: "action",    label: "Action" },
    { key: "result",    label: "Result" },
  ];

  console.log("evaluation:", evaluation);
  console.log("star_analysis:", starAnalysis);

  if (!evaluation) {
    return <h1 style={{ color: "white", fontSize: '19px'}}>There was an issue.No results available</h1>;
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
            {starAnalysis ? (
              <div className="star-breakdown">
                {STAR_COMPONENTS.map(({ key, label }) => {
                  const component = starAnalysis[key];
                  const filled = component?.state === "FILLED";
                  return (
                    <div key={key} className={`star-row ${filled ? "star-row--filled" : "star-row--missing"}`}>
                      <div className="star-row-header">
                        <span className="star-row-label">{label}</span>
                        <span className={`star-row-badge ${filled ? "star-row-badge--filled" : "star-row-badge--missing"}`}>
                          {filled ? "✓ Filled" : "Missing"}
                        </span>
                      </div>
                      {filled && component.quote && (
                        <p className="star-row-quote">"{component.quote}"</p>
                      )}
                      {component?.note && (
                        <p className="star-row-note">{component.note}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>there was an issue. No data available.</p>
            )}

            <h2 style={{ marginTop: "20px" }}>
              Filler Words Used
            </h2>

            {fillerAnalysis && (
              <div className="fillerwords-summary">
                <p>
                  {" "}Speaking pace: <strong>{fillerAnalysis.speaking_speed_wpm ?? "N/A"} WPM</strong>
                </p>
                <p>
                  Top filler words: <strong>{topFillers || "none"}</strong>
                </p>
              </div>
            )}

            <h2 style={{ marginTop: "20px" }}>Job Mapping</h2>
            <p>{evaluation.relevance_feedback}</p>

            
          </div>

          <div className="glass-line" />

          {/* Improvements */}
          
          <button className="save-btn">
            Save Grade
          </button>

        </div>
      </div>
    </div>
  );
}

export default Results;
