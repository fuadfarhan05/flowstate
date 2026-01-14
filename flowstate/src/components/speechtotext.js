// hooks/useContinuousSpeech.js
import { useState, useEffect, useRef } from "react";

export default function useContinuousSpeech() {
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const listeningRef = useRef(true);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition. Use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript((prev) => prev + " " + finalTranscript);
    };

    recognition.onend = () => {
      if (listeningRef.current) recognition.start(); // auto-restart
    };

    recognitionRef.current = recognition;
    recognition.start(); // start automatically

    return () => {
      listeningRef.current = false;
      recognition.stop();
    };
  }, []);

  return { transcript };
}
