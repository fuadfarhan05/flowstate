import { useScribe } from "@elevenlabs/react";
import { useRef, useEffect } from "react";

export default function ElevenLabs() {
  const silenceTimeoutRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const currentAnswerRef = useRef("");

  const SILENCE_DURATION = 5000; // ms

  

  const clearSilenceTimer = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  };

  const handleSilence = () => {
    if (!isSpeakingRef.current) return;

    console.log("Silence detected — answer finalized");

    isSpeakingRef.current = false;
    clearSilenceTimer();

    const finalAnswer = currentAnswerRef.current.trim();
    if (!finalAnswer) return;


    // reset buffer
    currentAnswerRef.current = "";
  };

  const resetSilenceTimer = () => {
    clearSilenceTimer();
    silenceTimeoutRef.current = setTimeout(handleSilence, SILENCE_DURATION);
  };

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",

    onPartialTranscript: (data) => {
      if (!isSpeakingRef.current) {
        console.log("User started speaking");
        isSpeakingRef.current = true;
      }

      resetSilenceTimer();
    },

    onCommittedTranscript: (data) => {
      currentAnswerRef.current += " " + data.text;
      resetSilenceTimer();
    },
  });

  /* -------------------- CONNECTION -------------------- */

  async function fetchTokenFromServer() {
    const res = await fetch("http://localhost:5434/api/v1/scribe-token");
    const data = await res.json();
    return data.token;
  }

  const handleStart = async () => {
    if (scribe.isConnected) return;

    const token = await fetchTokenFromServer();

    await scribe.connect({
      token,
      microphone: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    console.log("🎙️ Continuous listening started");
  };

  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (scribe.isConnected) {
        scribe.disconnect();
      }
    };
  }, []);

  handleStart();

  return (
    <div style={{ padding: 20 }}>

      <p className="listening-tag" style={{color:"white"}}> {scribe.isConnected ? "Listening" : "start speaking when ready"}</p>

      {scribe.partialTranscript && (
        <p style={{color:"white"}}><strong>Live:</strong> {scribe.partialTranscript}</p>
      )}

      <button
      onClick={() => {
        clearSilenceTimer();
        scribe.disconnect();
        handleStart();
      }}
    >
      Next Question
    </button>

    <button onClick={async () => {
      await scribe.disconnect();
    }}>
      End
    </button>




    </div>
  );
}
