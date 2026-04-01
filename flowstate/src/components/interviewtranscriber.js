import { useEffect, useMemo, useRef, useState } from "react";
import BarVisualizer from "./barvisualizer";
import "../styles/elevenstyle.css";

export default function InterviewTranscriber({
  title = "reduce filler words",
  prompt = "Speak freely about anything you want.",
  onTranscriptChange,
  onStop,
  maxDurationSeconds = null,
  fillerDensityPercent = 0,
  topics = null,
}) {
  const defaultTopics = [
    "Describe a mistake you made and what you learned from it.",
    "Explain a hobby you enjoy to someone who has never tried it.",
    "Talk about a goal you want to achieve this year.",
    "Describe your ideal weekend from morning to night.",
    "Share a time you handled pressure well.",
    "Explain a skill you are currently trying to improve.",
    "Talk about a challenge you overcame recently.",
    "Describe a place you would recommend visiting and why.",
    "Explain a daily habit that helps you stay productive.",
    "Talk about a project you are proud of.",
  ];
  const practiceTopics = topics || defaultTopics;

  const [transcriptHidden, setTranscriptHidden] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");
  const [practiceMode, setPracticeMode] = useState("topic");
  const [freestyleDurationMode, setFreestyleDurationMode] = useState("timed");
  const [activeTopic, setActiveTopic] = useState("");
  const committedTranscriptRef = useRef("");
  const [committedTranscript, setCommittedTranscript] = useState("");
  const [partialTranscript, setPartialTranscript] = useState("");
  const effectiveMaxDurationSeconds =
    practiceMode === "freestyle" && freestyleDurationMode === "untimed"
      ? null
      : maxDurationSeconds;
  const hasTimer =
    Number.isFinite(effectiveMaxDurationSeconds) && effectiveMaxDurationSeconds > 0;
  const [secondsLeft, setSecondsLeft] = useState(
    hasTimer ? effectiveMaxDurationSeconds : null,
  );

  const socketRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const processorNodeRef = useRef(null);

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
      const s = Math.max(-1, Math.min(1, floatBuffer[i]));
      int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return int16.buffer;
  };

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
    committedTranscriptRef.current = "";
    setCommittedTranscript("");
    setPartialTranscript("");
    if (hasTimer) {
      setSecondsLeft(effectiveMaxDurationSeconds);
    }
    setIsConnecting(true);

    try {
      const token = await fetchTokenFromServer();
      const prompt =
        "Transcribe verbatim and preserve disfluencies. Include filler words such as um, uh, er, ah, like, you know, and I mean exactly as spoken.";
      const wsParams = new URLSearchParams({
        sample_rate: "16000",
        format_turns: "true",
        encoding: "pcm_s16le",
        speech_model: "u3-rt-pro",
        prompt,
        token,
      });

      const socket = new WebSocket(
        `wss://streaming.assemblyai.com/v3/ws?${wsParams.toString()}`,
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
          const downsampled = downsampleBuffer(
            inputData,
            audioContext.sampleRate,
            16000,
          );
          const payload = float32ToInt16Buffer(downsampled);
          socket.send(payload);
        };

        sourceNode.connect(processorNode);
        processorNode.connect(audioContext.destination);
        await audioContext.resume();
        setIsConnected(true);
      };

      socket.onmessage = (msg) => {
        let data;
        try {
          data = JSON.parse(msg.data);
        } catch {
          return;
        }

        const text = (data.transcript || "").trim();
        if (!text) return;

        if (data.type === "Turn" && data.end_of_turn) {
          const updated = committedTranscriptRef.current
            ? `${committedTranscriptRef.current} ${text}`
            : text;

          committedTranscriptRef.current = updated;
          setCommittedTranscript(updated);
          setPartialTranscript("");
          return;
        }

        if (data.type === "Turn") {
          setPartialTranscript(text);
        }
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
    if (typeof onStop === "function") onStop();
  };

  const handleClear = () => {
    committedTranscriptRef.current = "";
    setCommittedTranscript("");
    setPartialTranscript("");
    setError("");
    if (hasTimer) {
      setSecondsLeft(effectiveMaxDurationSeconds);
    }
  };

  const handleLoadRandomTopic = () => {
    if (!practiceTopics.length) return;
    let nextTopic = practiceTopics[Math.floor(Math.random() * practiceTopics.length)];
    if (practiceTopics.length > 1 && nextTopic === activeTopic) {
      nextTopic = practiceTopics[Math.floor(Math.random() * practiceTopics.length)];
    }
    setActiveTopic(nextTopic);
  };

  useEffect(() => {
    if (hasTimer) {
      setSecondsLeft(effectiveMaxDurationSeconds);
    } else {
      setSecondsLeft(null);
    }
  }, [hasTimer, effectiveMaxDurationSeconds]);

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
      `Reached ${effectiveMaxDurationSeconds} seconds. Transcription stopped automatically.`,
    );
  }, [hasTimer, isConnected, effectiveMaxDurationSeconds, secondsLeft]);

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
        <div className="fillerwords-mode-toggle">
          <button
            className={`fillerwords-mode-btn ${
              practiceMode === "topic" ? "active" : ""
            }`}
            onClick={() => setPracticeMode("topic")}
            type="button"
          >
            Topic
          </button>
          <button
            className={`fillerwords-mode-btn ${
              practiceMode === "freestyle" ? "active" : ""
            }`}
            onClick={() => setPracticeMode("freestyle")}
            type="button"
          >
            Freestyle
          </button>
        </div>

        {practiceMode === "freestyle" && (
          <div className="fillerwords-time-toggle">
            <button
              className={`fillerwords-mode-btn ${
                freestyleDurationMode === "timed" ? "active" : ""
              }`}
              onClick={() => setFreestyleDurationMode("timed")}
              type="button"
              disabled={isConnected}
            >
              90 Seconds
            </button>
            <button
              className={`fillerwords-mode-btn ${
                freestyleDurationMode === "untimed" ? "active" : ""
              }`}
              onClick={() => setFreestyleDurationMode("untimed")}
              type="button"
              disabled={isConnected}
            >
              No Timer
            </button>
          </div>
        )}

        {practiceMode === "topic" ? (
          <>
            <p className="fillerwords-prompt">
              {activeTopic || "click random topic and speak for 90 SECONDS"}
            </p>
          </>
        ) : (
          <p className="fillerwords-prompt">{prompt}</p>
        )}
        <button
          className="fillerwords-topic-btn"
          onClick={handleLoadRandomTopic}
          type="button"
          disabled={practiceMode !== "topic"}
        >
          Random Topic
        </button>
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
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="end-btn fillerwords-clear-btn"
              onClick={() => setTranscriptHidden((h) => !h)}
              type="button"
            >
              {transcriptHidden ? "Show" : "Hide"}
            </button>
            <button className="end-btn fillerwords-clear-btn" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
        {!transcriptHidden && (
          <p>
            {liveTranscript ||
              "Your words will appear here when you start speaking"}
          </p>
        )}
      </section>

      {error && <p className="fillerwords-error">{error}</p>}
    </div>
  );
}
