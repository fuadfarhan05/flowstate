import { useEffect, useRef, useState } from "react";
import InterviewTranscriber from "../components/interviewtranscriber";

import { useNavigate } from "react-router-dom";

import "../styles/fillerword.css";

const COMMON_FILLER_WORDS = new Set([
  "um", "uh", "like", "basically", "literally", "actually",
  "honestly", "right", "okay", "so", "well", "anyway",
  "you know", "i mean", "kind of", "sort of",
]);

const WORDS_PER_VIEW = 4;

function FillerWordsPage() {
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [analysisError, setAnalysisError] = useState("");
  const analysisDebounceRef = useRef(null);
  const speechStartedAtRef = useRef(null);

  const [currentWords, setCurrentWords] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const prevBatchStartRef = useRef(0);

  const navigate = useNavigate();

  const recentWindowDensity =
    analysis?.recent_windows?.length
      ? analysis.recent_windows[analysis.recent_windows.length - 1].density_percent
      : 0;
  const visualizerFillerDensity = recentWindowDensity || analysis?.filler_density_percent || 0;

  const fillerWordSet = new Set([
    ...COMMON_FILLER_WORDS,
    ...Object.keys(analysis?.filler_counts || {}),
  ]);

  function goHome() {
    navigate('/dashboard');
  }

  // Word batch display logic
  useEffect(() => {
    const words = transcript.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) {
      setCurrentWords([]);
      prevBatchStartRef.current = 0;
      return;
    }

    const batchStart = Math.floor((words.length - 1) / WORDS_PER_VIEW) * WORDS_PER_VIEW;

    if (batchStart !== prevBatchStartRef.current) {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentWords(words.slice(batchStart, batchStart + WORDS_PER_VIEW));
        prevBatchStartRef.current = batchStart;
        setIsVisible(true);
      }, 250);
    } else {
      setCurrentWords(words.slice(batchStart, batchStart + WORDS_PER_VIEW));
    }
  }, [transcript]);

  // Filler word analysis
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

      <div className="fillerwords-word-display">
        <div className={`fillerwords-word-row ${isVisible ? "fw-fade-in" : "fw-fade-out"}`}>
          {currentWords.length === 0 ? (
            <span className="fw-placeholder">Start speaking…</span>
          ) : (
            currentWords.map((word, i) => {
              const lower = word.replace(/[^a-z']/gi, "").toLowerCase();
              const isFiller = fillerWordSet.has(lower);
              return (
                <span
                  key={i}
                  className={isFiller ? "fw-word fw-filler" : "fw-word"}
                >
                  {word}
                </span>
              );
            })
          )}
        </div>
      </div>

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
