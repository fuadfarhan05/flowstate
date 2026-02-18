import { useScribe } from "@elevenlabs/react";
import { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/elevenstyle.css";
import BarVisualizer from "./barvisualizer";

export default function ElevenLabs() {
  const location = useLocation();

  const { questions, maxFollowUps } = location.state;

  const navigate = useNavigate();

  // Interview flow refs
  const experienceIndexRef = useRef(0);
  const followUpCountRef = useRef(0);
  const maxFollowUpsSafe = maxFollowUps ?? 2;

  const MAX_FOLLOWUPS = maxFollowUpsSafe;


  // Audio / transcript refs
  const isSpeakingRef = useRef(false);
  const currentAnswerRef = useRef("");
  const qaBufferRef = useRef([]);

  // UI state
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",

    onPartialTranscript: () => {
      if (!isSpeakingRef.current) {
        isSpeakingRef.current = true;
      }
    },

    onCommittedTranscript: (data) => {
      currentAnswerRef.current = currentAnswerRef.current
        ? `${currentAnswerRef.current} ${data.text}`
        : data.text;
    },

    onError: (error) => {
      console.error("❌ Scribe error:", error);
    },
  });

  async function fetchTokenFromServer() {
    const res = await fetch("http://localhost:5434/api/v1/scribe-token");
    const data = await res.json();
    return data.token;
  }

  const handleStart = async () => {
    const token = await fetchTokenFromServer();
    await scribe.connect({
      token,
      microphone: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
  };

  const handleSaveAnswer = async (answerText) => {
    if (!answerText.trim()) return;

    qaBufferRef.current.push({
      question: currentQuestion,
      answer: answerText,
    });

    if (followUpCountRef.current < MAX_FOLLOWUPS) {
      try {
        const res = await fetch(
          "http://localhost:5434/api/v1/generate-questions",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answer: answerText }),
          }
        );

        const data = await res.json();
        followUpCountRef.current += 1;
        setCurrentQuestion(data.question);
      } catch (err) {
        console.error("Failed to generate follow-up", err);
      }
      return;
    }

    experienceIndexRef.current += 1;
    followUpCountRef.current = 0;

    if (experienceIndexRef.current < questions.length) {
      setCurrentQuestion(questions[experienceIndexRef.current]);
    } else {
      setIsFinished(true);
    }
  };

  const handleNextQuestion = async () => {
    if (isProcessing || isFinished || isFinalizing) return;

    setIsProcessing(true);

    try {
      let fullAnswer = currentAnswerRef.current.trim();

      if (!fullAnswer && scribe.partialTranscript) {
        fullAnswer = scribe.partialTranscript.trim();
      }

      if (scribe.isConnected) {
        scribe.disconnect();
      }

      await new Promise((r) => setTimeout(r, 300));

      if (fullAnswer) {
        await handleSaveAnswer(fullAnswer);
      }

      currentAnswerRef.current = "";
      isSpeakingRef.current = false;

      await new Promise((r) => setTimeout(r, 300));

      if (!isFinished) {
        await handleStart();
      }
    } catch (error) {
      console.error("❌ Next question error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnd = async () => {
    const transcriptlog = qaBufferRef.current
      .map(
        (qa) => `Interviewer: ${qa.question}\nCandidate: ${qa.answer}`
      )
      .join("\n\n");

    const res = await fetch("http://localhost:5434/api/v1/grade-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcriptlog }),
    });

    const data = await res.json();
    return data.evaluation;
  };

  const finalizeInterview = async () => {
    if (isFinalizing) return;

    setIsFinalizing(true);

    try {
      if (scribe.isConnected) {
        scribe.disconnect();
      }

      const evaluation = await handleEnd();

      await new Promise((r) => setTimeout(r, 800));

      navigate("/results", { state: { evaluation } });
    } catch (err) {
      console.error("❌ Finalization error:", err);
      setIsFinalizing(false);
    }
  };

  useEffect(() => {
    if (!questions.length) return;

    setCurrentQuestion(questions[0]);
    handleStart();

    return () => {
      if (scribe.isConnected) {
        scribe.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (isFinished) {
      finalizeInterview();
    }
  }, [isFinished]);

  return (
    <div style={{ padding: 20 }}>
      <div className="question-card">
        <h3
          id="question-gen"
          style={{ color: "white", fontSize: "30px" }}
        >
          {currentQuestion}
        </h3>
      </div>

      <button
        className="next-btn"
        onClick={handleNextQuestion}
        disabled={isProcessing || isFinished || isFinalizing}
        style={{
          opacity:
            isProcessing || isFinished || isFinalizing ? 0.6 : 1,
          cursor: isFinished ? "not-allowed" : "pointer",
        }}
      >
        {isFinalizing
          ? "Finalizing..."
          : isFinished
          ? "Interview Complete"
          : isProcessing
          ? "Processing..."
          : "Next Question"}
      </button>


      <div style={{ marginTop: "100px" }}>
        <BarVisualizer
          isActive={scribe.isConnected && !isFinalizing}
          barCount={6}
          barGap={10}
          barWidth={15}
          barMaxHeight={80}
          primaryColor="#75a8ff"
          secondaryColor="#b0d4f4"
        />
      </div>

      <button
        className="end-btn"
        onClick={finalizeInterview}
        disabled={isFinalizing}
        style={{
          marginTop: "20px",
          opacity: isFinalizing ? 0.6 : 1,
        }}
      >
        Finish Here
      </button>

      {isFinalizing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 15, 40, 0.85)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            flexDirection: "column",
            color: "white",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              border: "5px solid rgba(255,255,255,0.2)",
              borderTop: "5px solid #75a8ff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: 20,
            }}
          />

          <h2>Grading your interview…</h2>
          <p style={{ opacity: 0.7 }}>
            In a moment you will get an analysis report on your speech performance
          </p>
        </div>
      )}
    </div>
  );
}
