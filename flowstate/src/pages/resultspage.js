import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/results.css";

function Results() {
  const location = useLocation();
  const { evaluation } = location.state || {};
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    if (!showFeedbackForm) return;

    const doc = document;
    const scriptSrc = "https://tally.so/widgets/embed.js";

    const loadEmbeds = () => {
      if (typeof window.Tally !== "undefined") {
        window.Tally.loadEmbeds();
        return;
      }

      doc
        .querySelectorAll("iframe[data-tally-src]:not([src])")
        .forEach((iframe) => {
          iframe.src = iframe.dataset.tallySrc;
        });
    };

    if (typeof window.Tally !== "undefined") {
      loadEmbeds();
      return;
    }

    const existingScript = doc.querySelector(`script[src="${scriptSrc}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", loadEmbeds);
      existingScript.addEventListener("error", loadEmbeds);
      return () => {
        existingScript.removeEventListener("load", loadEmbeds);
        existingScript.removeEventListener("error", loadEmbeds);
      };
    }

    const script = doc.createElement("script");
    script.src = scriptSrc;
    script.onload = loadEmbeds;
    script.onerror = loadEmbeds;
    doc.body.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, [showFeedbackForm]);

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

          <button
            className="save-btn"
            onClick={() => setShowFeedbackForm(true)}
          >
            Save Grade
          </button>

          {showFeedbackForm && (
            <div
              className="tally-modal-overlay"
              onClick={() => setShowFeedbackForm(false)}
            >
              <div
                className="tally-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="tally-close-btn"
                  onClick={() => setShowFeedbackForm(false)}
                >
                  Close
                </button>

                <iframe
                  data-tally-src="https://tally.so/embed/rjAl8o?alignLeft=1&hideTitle=1&transparentBackground=1"
                  loading="lazy"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  marginHeight="0"
                  marginWidth="0"
                  title="Beta Testing Feedback"
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Results;
