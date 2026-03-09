import { useEffect, useRef, useState } from "react";
import InterviewTranscriber from "../components/interviewtranscriber";

import { useNavigate } from "react-router-dom";

import "../styles/fillerword.css";

function FillerWordsPage() {
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [analysisError, setAnalysisError] = useState("");
  const analysisDebounceRef = useRef(null);
  const speechStartedAtRef = useRef(null);

  const navigate = useNavigate();

  const recentWindowDensity =
    analysis?.recent_windows?.length
      ? analysis.recent_windows[analysis.recent_windows.length - 1].density_percent
      : 0;
  const visualizerFillerDensity = recentWindowDensity || analysis?.filler_density_percent || 0;

    function goHome() {
        navigate('/dashboard');
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
          Math.round((Date.now() - speechStartedAtRef.current) / 1000),
        );

        const response = await fetch("http://localhost:8000/analyze-filler-words", {
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

  return (
    <div className="fillerwords-page">
      <InterviewTranscriber
        title="Reduced Your Filler Words"
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
        {analysisError && <p className="fillerwords-error">{analysisError}</p>}
      </section>
      <div>

        <button className="back-btn" onClick={goHome}> Back to Home </button>
        
    </div>
    </div>

    


  );
}

export default FillerWordsPage;
