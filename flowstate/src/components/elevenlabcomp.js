import { useScribe } from "@elevenlabs/react";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ElevenLabs() {
  const navigate = useNavigate();
  const silenceTimeoutRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const currentAnswerRef = useRef("");
  const [currentQuestion, setCurrentQuestion] = useState("");

  const SILENCE_DURATION = 5000; 

  

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

    console.log("🎙️ Continuous listening started");
  };


  const handleSaveAnswer = async (answerText) => {
    if(!answerText) return;
    try {
      const res = await fetch("http://localhost:5434/api/v1/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer: answerText,
      }),
      });

      const data = await res.json();
      console.log(data);
      setCurrentQuestion(data.question);
    } catch (error) {
      console.log("Failed to send to server", error);
    }

  };

  useEffect(() => {
    setCurrentQuestion("Tell me about yourself.");
    handleStart();
    return () => {
      clearSilenceTimer();
      if (scribe.isConnected) {
        scribe.disconnect();
      }
    };
  }, []);

 

  return (
    <div style={{ padding: 20 }}>

      <h3 style={{color:"white", fontSize: "30px"}}>Q: {currentQuestion}</h3>

      <p className="listening-tag" style={{color:"white"}}> {scribe.isConnected ? "Listening" : "start speaking when ready"}</p>

      {scribe.partialTranscript && (
        <p style={{color:"white"}}><strong>Live:</strong> {scribe.partialTranscript}</p>
      )}


    <button
      onClick={() => {
        clearSilenceTimer();
        scribe.disconnect();
        handleSaveAnswer(scribe.partialTranscript);
        handleStart();
      }}
    >
      Next Question
    </button>

    <button onClick={async () => {
      scribe.disconnect();
      navigate("/home");

    }}>
      End
    </button>
    </div>
  );
}
