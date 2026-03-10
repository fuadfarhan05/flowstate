import { useEffect, useRef, useState } from "react";
import InterviewTranscriber from "../components/interviewtranscriber";
import { useNavigate } from "react-router-dom";
import "../styles/fillerword.css";

function FillerWordsPage() {
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [analysisError, setAnalysisError] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const analysisDebounceRef = useRef(null);
  const speechStartedAtRef = useRef(null);

  const API_BASE_URL = process.env.REACT_APP_PYTHON_URL;

  const navigate = useNavigate();

  const recentWindowDensity =
    analysis?.recent_windows?.length
      ? analysis.recent_windows[analysis.recent_windows.length - 1]
          .density_percent
      : 0;

  const visualizerFillerDensity =
    recentWindowDensity || analysis?.filler_density_percent || 0;

  function goHome() {
    navigate("/features");
  }

  useEffect(() => {
    const cleanTranscript = transcript.trim();

    if (!cleanTranscript) {
      setAnalysis(null);
      setAnalysisError("");
      speechStartedAtRef.current = null;

      if (analysisDebounceRef.current) {
        clearTimeout(analysisDebounceRef.current);
      }
      return;
    }

    if (!speechStartedAtRef.current) {
      speechStartedAtRef.current = Date.now();
    }

    if (analysisDebounceRef.current) {
      clearTimeout(analysisDebounceRef.current);
    }

    analysisDebounceRef.current = setTimeout(async () => {
      try {
        const elapsedSeconds = Math.max(
          1,
          Math.round((Date.now() - speechStartedAtRef.current) / 1000)
        );

        const response = await fetch(`${API_BASE_URL}/analyze-filler-words`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transcript: cleanTranscript,
            window_size_words: 20,
            step_words: 5,
            elapsed_seconds: elapsedSeconds,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to analyze transcript");
        }

        const json = await response.json();
        setAnalysis(json);
        setAnalysisError("");
      } catch (err) {
        console.error("Filler analysis error:", err);
        setAnalysisError("Issue with tracking filler words");
      }
    }, 350);

    return () => {
      if (analysisDebounceRef.current) {
        clearTimeout(analysisDebounceRef.current);
      }
    };
  }, [transcript]);

  /* Tally feedback loader */
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

  return (
    <div className="fillerwords-page">
      <InterviewTranscriber
        title="Reduce Your Filler Words"
        onTranscriptChange={setTranscript}
        maxDurationSeconds={90}
        fillerDensityPercent={visualizerFillerDensity}
      />

      <section className="fillerwords-notes">
        <p>
          {transcript.trim() ? transcript.trim().split(/\s+/).length : 0} words.
        </p>

        {analysis && (
          <div className="fillerwords-metrics">
            <p>
              <strong>{analysis.filler_density_percent}%</strong> | Speed:{" "}
              <strong>{analysis.speaking_speed_wpm ?? "N/A"} WPM</strong>
            </p>

            <p>
              Top filler words:{" "}
              <strong>
                {Object.entries(analysis.filler_counts || {})
                  .slice(0, 5)
                  .map(([word, count]) => `${word} (${count})`)
                  .join(", ") || "none yet"}
              </strong>
            </p>
          </div>
        )}

        {analysisError && (
          <p className="fillerwords-error">{analysisError}</p>
        )}
      </section>

      <div>
        <button className="back-btn" onClick={goHome}>
          Back to Home
        </button>

        <button
          className="save-btn"
          onClick={() => setShowFeedbackForm(true)}
        >
          Give us Your Feedback!
        </button>
      </div>

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
  );
}

export default FillerWordsPage;