import { useEffect, useMemo, useRef, useState } from "react";
import BarVisualizer from "./barvisualizer";
import "../styles/elevenstyle.css";

export default function InterviewTranscriber({
  title = "Filler Word Practice",
  prompt = "Tell me about yourself.",
  onTranscriptChange,
  maxDurationSeconds = null,
  fillerDensityPercent = 0,
}) {
  const hasTimer = Number.isFinite(maxDurationSeconds) && maxDurationSeconds > 0;
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");
  const committedTranscriptRef = useRef("");
  const [committedTranscript, setCommittedTranscript] = useState("");
  const [partialTranscript, setPartialTranscript] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(
    hasTimer ? maxDurationSeconds : null,
  );

  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const liveTranscript = useMemo(() => {
    const partial = partialTranscript.trim();

    if (!partial) {
      return committedTranscript;
    }

    return committedTranscript
      ? `${committedTranscript} ${partial}`
      : partial;
  }, [committedTranscript, partialTranscript]);

  useEffect(() => {
    if (typeof onTranscriptChange === "function") {
      onTranscriptChange(liveTranscript);
    }
  }, [liveTranscript, onTranscriptChange]);

  const cleanupAudio = (closeSocket = true) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (closeSocket && socketRef.current) {
      socketRef.current.onclose = null;
      socketRef.current.close();
    }

    mediaRecorderRef.current = null;
    streamRef.current = null;
    socketRef.current = null;
    setIsConnected(false);
  };

  async function fetchTokenFromServer() {
    const res = await fetch("http://localhost:5434/api/v1/assembly-token");
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.details || body.error || "Failed to fetch AssemblyAI token");
    }
    const data = await res.json();
    return data.token;
  }

  const handleStart = async () => {
    if (isConnecting || isConnected || socketRef.current) return;

    setError("");
    if (hasTimer) {
      setSecondsLeft(maxDurationSeconds);
    }
    setIsConnecting(true);

    try {
      const token = await fetchTokenFromServer();

      const socket = new WebSocket(
        `wss://streaming.assemblyai.com/v3/ws?sample_rate=16000&format_turns=true&token=${token}`,
      );
      socketRef.current = socket;

      socket.onopen = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        });

        streamRef.current = stream;
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        };

        recorder.start(250);
        setIsConnected(true);
      };

      socket.onmessage = (msg) => {
        const data = JSON.parse(msg.data);

        if (data.type !== "Turn") return;

        const text = (data.transcript || "").trim();
        if (!text) return;

        const updated = committedTranscriptRef.current
          ? `${committedTranscriptRef.current} ${text}`
          : text;

        committedTranscriptRef.current = updated;
        setCommittedTranscript(updated);
        setPartialTranscript("");
      };

      socket.onerror = (socketError) => {
        console.error("AssemblyAI error:", socketError);
        setError("Transcription failed. Please reconnect and try again.");
      };

      socket.onclose = () => {
        cleanupAudio(false);
      };
    } catch (startError) {
      console.error("Failed to connect to AssemblyAI:", startError);
      setError("Unable to connect to transcription service.");
      cleanupAudio();
    } finally {
      setIsConnecting(false);
    }
  };

  const handleStop = () => {
    cleanupAudio();
  };

  const handleClear = () => {
    committedTranscriptRef.current = "";
    setCommittedTranscript("");
    setPartialTranscript("");
    setError("");
    if (hasTimer) {
      setSecondsLeft(maxDurationSeconds);
    }
  };

  useEffect(() => {
    if (hasTimer) {
      setSecondsLeft(maxDurationSeconds);
    } else {
      setSecondsLeft(null);
    }
  }, [hasTimer, maxDurationSeconds]);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  useEffect(() => {
    if (!hasTimer || !isConnected) return;
    if (secondsLeft === null || secondsLeft <= 0) return;

    const timerId = setInterval(() => {
      setSecondsLeft((previous) => {
        if (previous === null || previous <= 0) {
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [hasTimer, isConnected, secondsLeft]);

  useEffect(() => {
    if (!hasTimer || !isConnected || secondsLeft !== 0) return;

    cleanupAudio();
    setError(
      `Reached ${maxDurationSeconds} seconds. Transcription stopped automatically.`,
    );
  }, [hasTimer, isConnected, maxDurationSeconds, secondsLeft]);

  const formattedTimeLeft =
    hasTimer && secondsLeft !== null
      ? `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(
          secondsLeft % 60,
        ).padStart(2, "0")}`
      : null;

  const visualizerColors = useMemo(() => {
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const density = clamp(Number(fillerDensityPercent) || 0, 0, 25);
    const intensity = density / 25;

    const start = { r: 117, g: 168, b: 255 }; // #75a8ff
    const end = { r: 255, g: 214, b: 76 }; // warm yellow
    const mixed = {
      r: Math.round(start.r + (end.r - start.r) * intensity),
      g: Math.round(start.g + (end.g - start.g) * intensity),
      b: Math.round(start.b + (end.b - start.b) * intensity),
    };

    const primary = `rgb(${mixed.r}, ${mixed.g}, ${mixed.b})`;
    const secondary = `color-mix(in srgb, ${primary} 75%, white 25%)`;

    return { primary, secondary };
  }, [fillerDensityPercent]);

  return (
    <div className="fillerwords-shell">
      <div className="question-card">
        <h3 id="question-gen" style={{ color: "white", fontSize: "30px" }}>
          {title}
        </h3>
        <p className="fillerwords-prompt">{prompt}</p>
      </div>

      <div className="fillerwords-controls">
        <button
          className="next-btn"
          onClick={handleStart}
          disabled={isConnecting || isConnected}
        >
          {isConnecting ? "Connecting..." : isConnected ? "Listening" : "Start"}
        </button>

        <button className="next-btn" onClick={handleStop} disabled={!isConnected}>
          Stop
        </button>

        {formattedTimeLeft && (
          <span className="fillerwords-timer">Time Left: {formattedTimeLeft}</span>
        )}
      </div>

      <div style={{ marginTop: "50px" }}>
        <BarVisualizer
          isActive={isConnected}
          barCount={6}
          barGap={10}
          barWidth={15}
          barMaxHeight={80}
          primaryColor={visualizerColors.primary}
          secondaryColor={visualizerColors.secondary}
        />
      </div>

      <section className="fillerwords-transcript-box">
        <div className="fillerwords-transcript-header">
          <h4>Live Transcript</h4>
          <button className="end-btn fillerwords-clear-btn" onClick={handleClear}>
            Clear
          </button>
        </div>
        <p>
          {liveTranscript ||
            "Your words will appear here when you start speaking"}
        </p>
      </section>

      {error && <p className="fillerwords-error">{error}</p>}
    </div>
  );
}
