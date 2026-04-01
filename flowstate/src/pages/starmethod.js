import { useState, useEffect, useRef } from "react";
import InterviewTranscriber from "../components/interviewtranscriber";
import { useNavigate } from "react-router-dom";
import "../styles/fillerword.css";
import "../styles/starmethod.css";

const starTopics = [
  "Tell us about a challenge you faced this week. Walk us through it using the STAR method.",
  "Describe a time you had to meet a tight deadline. Use the STAR method.",
  "Tell us about a time you disagreed with someone on your team. Walk us through it using the STAR method.",
  "Describe a moment you had to learn something new quickly. Use the STAR method.",
  "Tell us about a time you failed at something. Walk us through it using the STAR method.",
  "Describe a situation where you had to make a difficult decision. Use the STAR method.",
  "Tell us about a time you went above and beyond what was expected. Walk us through it using the STAR method.",
  "Describe a time you had to adapt to a big change. Use the STAR method.",
];

const STAR_KEYS = ["situation", "task", "action", "result"];
const STAR_LABELS = { situation: "Situation", task: "Task", action: "Action", result: "Result" };

const DEFAULT_STAR = {
  situation: { state: "MISSING" },
  task: { state: "MISSING" },
  action: { state: "MISSING" },
  result: { state: "MISSING" },
};

function StarMethodPage() {
  const [transcript, setTranscript] = useState("");
  const [star, setStar] = useState(DEFAULT_STAR);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [stopped, setStopped] = useState(false);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

  useEffect(() => {
    if (wordCount < 5) {
      setStar(DEFAULT_STAR);
      setStopped(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/analyze-star", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript }),
        });
        if (res.ok) {
          const data = await res.json();
          setStar({ ...DEFAULT_STAR, ...data });
        }
      } catch (_) {
        // silently ignore network errors during live analysis
      } finally {
        setLoading(false);
      }
    }, 1800);

    return () => clearTimeout(debounceRef.current);
  }, [transcript]);

  function goHome() {
    navigate("/dashboard");
  }

  return (
    <div className="fillerwords-page">
      <InterviewTranscriber
        title="S.T.A.R. Stories"
        prompt="Speak freely using the STAR method: Situation, Task, Action, Result."
        onTranscriptChange={setTranscript}
        onStop={() => setStopped(true)}
        maxDurationSeconds={120}
        topics={starTopics}
      />

      <section className="star-tracker fillerwords-notes">
        <div className="star-tracker-header">
          <h4>STAR Tracker</h4>
          {loading && <span className="star-tracker-loading">analyzing…</span>}
        </div>
        <div className="star-tracker-grid">
          {STAR_KEYS.map((key) => {
            const filled = star[key]?.state === "FILLED";
            const isOpen = expanded === key;
            return (
              <div
                key={key}
                className={`star-card ${filled ? "filled" : "missing"} ${filled ? "clickable" : ""} ${!filled && stopped ? "alert" : ""}`}
                onClick={() => filled && setExpanded(isOpen ? null : key)}
              >
                <span className="star-card-label">{STAR_LABELS[key]}</span>
                <span className="star-card-status">{filled ? "✓ Filled" : "Not filled"}</span>
                {filled && isOpen && star[key]?.quote && (
                  <span className="star-card-quote">"{star[key].quote}"</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div>
        <button className="back-btn" onClick={goHome}>Back to Home</button>
      </div>
    </div>
  );
}

export default StarMethodPage;
