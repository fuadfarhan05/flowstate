import { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/elevenstyle.css";
import BarVisualizer from "./barvisualizer";

export default function AssemblyInterview() {
  const location = useLocation();
  const { questions, experiences } = location.state;
  const navigate = useNavigate();

  // 0 = opener, 1 = probe, 2 = closer
  const experienceIndexRef = useRef(0);
  const phaseRef = useRef(0);

  const socketRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const processorNodeRef = useRef(null);
  const currentAnswerRef = useRef("");
  const qaBufferRef = useRef([]);
  const sessionIdRef = useRef(null);
  const interviewStartedAtRef = useRef(null);

  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const downsampleBuffer = (buffer, inputSampleRate, outputSampleRate) => {
    if (outputSampleRate >= inputSampleRate) {
      return buffer;
    }
    const sampleRateRatio = inputSampleRate / outputSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0;
      let count = 0;

      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i += 1) {
        accum += buffer[i];
        count += 1;
      }

      result[offsetResult] = accum / count;
      offsetResult += 1;
      offsetBuffer = nextOffsetBuffer;
    }

    return result;
  };

  const float32ToInt16Buffer = (floatBuffer) => {
    const int16 = new Int16Array(floatBuffer.length);
    for (let i = 0; i < floatBuffer.length; i += 1) {
      const sample = Math.max(-1, Math.min(1, floatBuffer[i]));
      int16[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    }
    return int16.buffer;
  };

  async function fetchToken() {
    const response = await fetch("http://localhost:5434/api/v1/assembly-token", {
      credentials: "include",
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.details || body.error || "Token fetch failed");
    }

    const data = await response.json();
    sessionIdRef.current = data.sessionId;
    return data.token;
  }

  const cleanupAudio = (closeSocket = true) => {
    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (closeSocket && socketRef.current) {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: "Terminate" }));
      }
      socketRef.current.onclose = null;
      socketRef.current.close();
    }

    processorNodeRef.current = null;
    sourceNodeRef.current = null;
    audioContextRef.current = null;
    streamRef.current = null;
    socketRef.current = null;
  };

  const handleStart = async () => {
    if (socketRef.current) return;

    if (!interviewStartedAtRef.current) {
      interviewStartedAtRef.current = Date.now();
    }

    const token = await fetchToken();
    const socket = new WebSocket(
      `wss://streaming.assemblyai.com/v3/ws?sample_rate=16000&format_turns=true&encoding=pcm_s16le&token=${token}`,
    );

    socketRef.current = socket;

    socket.onopen = async () => {
      setIsConnected(true);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;
      const sourceNode = audioContext.createMediaStreamSource(stream);
      sourceNodeRef.current = sourceNode;
      const processorNode = audioContext.createScriptProcessor(4096, 1, 1);
      processorNodeRef.current = processorNode;

      processorNode.onaudioprocess = (event) => {
        if (socket.readyState !== WebSocket.OPEN) return;
        const inputData = event.inputBuffer.getChannelData(0);
        const downsampled = downsampleBuffer(inputData, audioContext.sampleRate, 16000);
        const payload = float32ToInt16Buffer(downsampled);
        socket.send(payload);
      };

      sourceNode.connect(processorNode);
      processorNode.connect(audioContext.destination);
      await audioContext.resume();
    };

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);

      if (data.type === "Turn" && data.transcript?.trim() && data.end_of_turn) {
        currentAnswerRef.current +=
          (currentAnswerRef.current ? " " : "") + data.transcript;
      }
    };

    socket.onerror = (error) => {
      console.error("AssemblyAI error:", error);
    };

    socket.onclose = () => {
      setIsConnected(false);
      cleanupAudio(false);
    };
  };

  const handleSaveAnswer = async (answerText) => {
    if (!answerText.trim()) return;

    const phase = phaseRef.current;

    qaBufferRef.current.push({
      question: currentQuestion,
      answer: answerText,
      phase,
    });
    const expIdx = experienceIndexRef.current;

    if (phase === 0) {
      // Generate one probing follow-up based on their answer
      const response = await fetch("http://localhost:5434/api/v1/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: answerText }),
      });
      const data = await response.json();
      phaseRef.current = 1;
      setCurrentQuestion(data.question);
      return;
    }

    if (phase === 1) {
      // Move to the closing question for this experience
      const expName = experiences[expIdx];
      phaseRef.current = 2;
      setCurrentQuestion(
        `How will your work at ${expName} make you a good candidate for this role?`
      );
      return;
    }

    // phase === 2: done with this experience, move to next
    experienceIndexRef.current += 1;
    phaseRef.current = 0;

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
      cleanupAudio();
      await new Promise((resolve) => setTimeout(resolve, 400));

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

  const handleEnd = async () => {
    const transcriptlog = qaBufferRef.current
      .map((qa) => `Interviewer: ${qa.question}\nCandidate: ${qa.answer}`)
      .join("\n\n");
    const fullTranscript = qaBufferRef.current.map((qa) => qa.answer).join(" ");
    const openerTranscript = qaBufferRef.current
      .filter((qa) => qa.phase === 0)
      .map((qa) => qa.answer)
      .join(" ");
    const elapsedSeconds = interviewStartedAtRef.current
      ? Math.max(1, Math.round((Date.now() - interviewStartedAtRef.current) / 1000))
      : null;

    const [gradeResponse, starResponse] = await Promise.all([
      fetch("http://localhost:5434/api/v1/grade-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcriptlog, fullTranscript, openerTranscript, elapsedSeconds }),
      }),
      fetch("http://localhost:8000/analyze-star", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: openerTranscript || fullTranscript }),
      }),
    ]);

    const data = await gradeResponse.json();
    const evaluation = data.evaluation;

    try {
      const starData = await starResponse.json();
      evaluation.star_analysis = starData;
    } catch {
      // star analysis is best-effort
    }

    return evaluation;
  };

  const finalizeInterview = async () => {
    if (isFinalizing) return;
    setIsFinalizing(true);

    try {
      cleanupAudio();
      const evaluation = await handleEnd();
      navigate("/results", { state: { evaluation } });
    } catch (error) {
      console.error("Finalization error:", error);
      setIsFinalizing(false);
    }
  };

  useEffect(() => {
    if (!questions?.length) return;

    setCurrentQuestion(questions[0]);
    handleStart();

    return () => cleanupAudio();
  }, []);

  useEffect(() => {
    if (isFinished) finalizeInterview();
  }, [isFinished]);

  if (isFinalizing) {
    return (
      <div className="finalizing-screen">
        <div className="finalizing-orb">
          <div className="finalizing-ring finalizing-ring--1" />
          <div className="finalizing-ring finalizing-ring--2" />
          <div className="finalizing-ring finalizing-ring--3" />
          <div className="finalizing-core" />
        </div>
        <p className="finalizing-title">Grading your interview</p>
        <p className="finalizing-sub">Analyzing your answers...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div className="question-card">
        <h3 style={{ color: "white", fontSize: "30px" }}>{currentQuestion}</h3>
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
