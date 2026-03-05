import { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/elevenstyle.css";
import BarVisualizer from "./barvisualizer";

export default function AssemblyInterview() {
  const location = useLocation();
  const { questions, maxFollowUps } = location.state;
  const navigate = useNavigate();

  // Interview flow refs
  const experienceIndexRef = useRef(0);
  const followUpCountRef = useRef(0);
  const MAX_FOLLOWUPS = maxFollowUps ?? 2;

  // Audio / transcript refs
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const currentAnswerRef = useRef("");
  const qaBufferRef = useRef([]);
  const sessionIdRef = useRef(null);

  // UI state
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  /* ---------------- PRODUCTION TOKEN FETCH ---------------- */

  async function fetchToken() {
    const res = await fetch(
      `http://localhost:5434/api/v1/assembly-token`,
      { credentials: "include" }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.details || body.error || "Token fetch failed");
    }

    const data = await res.json();
    sessionIdRef.current = data.sessionId;
    return data.token;
  }

  /* ---------------- START RECORDING ---------------- */

  const handleStart = async () => {
    if (socketRef.current) return;

    const token = await fetchToken();

    const socket = new WebSocket(
      `wss://streaming.assemblyai.com/v3/ws?sample_rate=16000&format_turns=true&token=${token}`
    );

    socketRef.current = socket;

    socket.onopen = async () => {
      setIsConnected(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socket.readyState === 1) {
          socket.send(event.data);
        }
      };

      mediaRecorder.start(250);
    };

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.type === "Turn" && data.transcript?.trim()) {
        currentAnswerRef.current +=
          (currentAnswerRef.current ? " " : "") + data.transcript;
      }
    };

    socket.onerror = (err) => {
      console.error("AssemblyAI error:", err);
    };

    socket.onclose = () => {
      setIsConnected(false);
      cleanupAudio(false);
    };
  };

  /* ---------------- CLEANUP ---------------- */

  const cleanupAudio = (closeSocket = true) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (closeSocket && socketRef.current) {
      socketRef.current.onclose = null;
      socketRef.current.close();
    }

    mediaRecorderRef.current = null;
    streamRef.current = null;
    socketRef.current = null;
  };

  /* ---------------- SAVE ANSWER ---------------- */

  const handleSaveAnswer = async (answerText) => {
    if (!answerText.trim()) return;

    qaBufferRef.current.push({
      question: currentQuestion,
      answer: answerText,
    });

    if (followUpCountRef.current < MAX_FOLLOWUPS) {
      const res = await fetch(
        `http://localhost:5434/api/v1/generate-questions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer: answerText }),
          //in here we will also pass in question along with answer from now on from now
        }
      );

      const data = await res.json();
      followUpCountRef.current += 1;
      setCurrentQuestion(data.question);
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

  /* ---------------- NEXT QUESTION ---------------- */

  const handleNextQuestion = async () => {
    if (isProcessing || isFinished || isFinalizing) return;

    setIsProcessing(true);

    try {
      cleanupAudio();
      await new Promise((r) => setTimeout(r, 400));

      const fullAnswer = currentAnswerRef.current.trim();

      if (fullAnswer) {
        await handleSaveAnswer(fullAnswer);
      }

      currentAnswerRef.current = "";

      if (!isFinished) {
        await handleStart();
      }
    } catch (error) {
      console.error("Next question error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  /* ---------------- FINALIZE ---------------- */

  const handleEnd = async () => {
    const transcriptlog = qaBufferRef.current
      .map((qa) => `Interviewer: ${qa.question}\nCandidate: ${qa.answer}`)
      .join("\n\n");

    const res = await fetch(
      `http://localhost:5434/api/v1/grade-answer`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcriptlog }),
      }
    );

    const data = await res.json();
    return data.evaluation;
  };

  const finalizeInterview = async () => {
    if (isFinalizing) return;
    setIsFinalizing(true);

    try {
      cleanupAudio();
      const evaluation = await handleEnd();
      navigate("/results", { state: { evaluation } });
    } catch (err) {
      console.error("Finalization error:", err);
      setIsFinalizing(false);
    }
  };

  /* ---------------- LIFECYCLE ---------------- */

  useEffect(() => {
    if (!questions?.length) return;

    setCurrentQuestion(questions[0]);
    handleStart();

    return () => cleanupAudio();
  }, []);

  useEffect(() => {
    if (isFinished) finalizeInterview();
  }, [isFinished]);

  /* ---------------- UI ---------------- */

  return (
    <div style={{ padding: 20 }}>
      <div className="question-card">
        <h3 style={{ color: "white", fontSize: "30px" }}>
          {currentQuestion}
        </h3>
      </div>

      <button
        className="next-btn"
        onClick={handleNextQuestion}
        disabled={isProcessing || isFinished || isFinalizing}
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
          isActive={isConnected && !isFinalizing}
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
        style={{ marginTop: 20 }}
      >
        Finish Here
      </button>
    </div>
  );
}
