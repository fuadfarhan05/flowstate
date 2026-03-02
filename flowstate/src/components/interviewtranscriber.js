import { useEffect, useMemo, useRef, useState } from "react";
import { useScribe } from "@elevenlabs/react";
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
  const [secondsLeft, setSecondsLeft] = useState(
    hasTimer ? maxDurationSeconds : null,
  );

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    onCommittedTranscript: (data) => {
      const updated = committedTranscriptRef.current
        ? `${committedTranscriptRef.current} ${data.text}`
        : data.text;

      committedTranscriptRef.current = updated;
      setCommittedTranscript(updated);
    },
    onError: (scribeError) => {
      console.error("Scribe error:", scribeError);
      setError("Transcription failed. Please reconnect and try again.");
    },
  });

  const liveTranscript = useMemo(() => {
    const partial = scribe.partialTranscript?.trim();

    if (!partial) {
      return committedTranscript;
    }

    return committedTranscript
      ? `${committedTranscript} ${partial}`
      : partial;
  }, [committedTranscript, scribe.partialTranscript]);

  useEffect(() => {
    if (typeof onTranscriptChange === "function") {
      onTranscriptChange(liveTranscript);
    }
  }, [liveTranscript, onTranscriptChange]);

  async function fetchTokenFromServer() {
    const res = await fetch("http://localhost:5434/api/v1/scribe-token");
    const data = await res.json();
    return data.token;
  }

  const handleStart = async () => {
    if (isConnecting || scribe.isConnected) return;

    setError("");
    if (hasTimer) {
      setSecondsLeft(maxDurationSeconds);
    }
    setIsConnecting(true);

    try {
      const token = await fetchTokenFromServer();
      await scribe.connect({
        token,
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      setIsConnected(true);
    } catch (startError) {
      console.error("Failed to connect to scribe:", startError);
      setError("Unable to connect to transcription service.");
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleStop = () => {
    if (scribe.isConnected) {
      scribe.disconnect();
    }
    setIsConnected(false);
  };

  const handleClear = () => {
    committedTranscriptRef.current = "";
    setCommittedTranscript("");
    setError("");
    if (hasTimer) {
      setSecondsLeft(maxDurationSeconds);
    }
  };

  useEffect(() => {
    setIsConnected(scribe.isConnected);
  }, [scribe.isConnected]);

  useEffect(() => {
    if (hasTimer) {
      setSecondsLeft(maxDurationSeconds);
    } else {
      setSecondsLeft(null);
    }
  }, [hasTimer, maxDurationSeconds]);

  useEffect(() => {
    return () => {
      if (scribe.isConnected) {
        scribe.disconnect();
      }
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

    if (scribe.isConnected) {
      scribe.disconnect();
    }

    setIsConnected(false);
    setError(
      `Reached ${maxDurationSeconds} seconds. Transcription stopped automatically.`,
    );
  }, [hasTimer, isConnected, maxDurationSeconds, scribe, secondsLeft]);

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
