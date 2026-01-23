import { useScribe } from "@elevenlabs/react";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/elevenstyle.css';
import BarVisualizer from './barvisualizer'


export default function ElevenLabs() {
  const navigate = useNavigate();
  const isSpeakingRef = useRef(false);
  const currentAnswerRef = useRef("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",

    onPartialTranscript: (data) => {
      console.log("📝 Partial:", data.text);
      if (!isSpeakingRef.current) {
        console.log("🎤 User started speaking");
        isSpeakingRef.current = true;
      }
    },

    onCommittedTranscript: (data) => {
      console.log("✅ Committed:", data.text);
      if (currentAnswerRef.current) {
        currentAnswerRef.current += " " + data.text;
      } else {
        currentAnswerRef.current = data.text;
      }
      console.log("💾 Full answer so far:", currentAnswerRef.current);
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
    try {
      const token = await fetchTokenFromServer();

      await scribe.connect({
        token,
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      console.log("🎙️ Continuous listening started");
    } catch (error) {
      console.error("❌ Failed to start listening:", error);
    }
  };

  const handleSaveAnswer = async (answerText) => {
    if (!answerText || answerText.trim() === "") {
      console.log("⚠️ No answer provided, skipping save");
      return;
    }

    console.log("💾 Saving answer:", answerText);
    try {
      const res = await fetch("http://localhost:5434/api/v1/grade-answer", {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion,
          answer: answerText
        })
      });
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      console.log("sending answers to grade");
    } catch(error) {
      console.log("unable to get a grade for answer", error);
    }

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

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ Received new question:", data);
      setCurrentQuestion(data.question);
    } catch (error) {
      console.error("❌ Failed to send to server:", error);
      alert("Failed to generate next question. Please try again.");
    }
  };

  const handleNextQuestion = async () => {
    if (isProcessing) {
      console.log("⏳ Already processing, please wait");
      return;
    }

    setIsProcessing(true);
    console.log("🔵 Next Question clicked");

    try {
      // Get committed transcript
      let fullAnswer = currentAnswerRef.current.trim();
      
      // Fallback to partial transcript if committed is empty
      if (!fullAnswer && scribe.partialTranscript) {
        fullAnswer = scribe.partialTranscript.trim();
        console.log("⚠️ Using partial transcript as fallback");
      }

      console.log("📋 Full answer:", fullAnswer);
      console.log("📏 Answer length:", fullAnswer.length);

      // Disconnect
      if (scribe.isConnected) {
        scribe.disconnect();
        console.log("🔌 Disconnected");
      }

      // Small delay to ensure disconnect completes
      await new Promise(resolve => setTimeout(resolve, 300));

      // Save the answer
      if (fullAnswer) {
        await handleSaveAnswer(fullAnswer);
        console.log("💾 Answer saved");
      } else {
        console.log("❌ No answer to save");
      }

      // Reset for next question
      currentAnswerRef.current = "";
      isSpeakingRef.current = false;
      console.log("🔄 Reset answer ref");

      // Small delay before reconnecting
      await new Promise(resolve => setTimeout(resolve, 300));

      // Reconnect
      await handleStart();
      console.log("🎙️ Reconnected");
    } catch (error) {
      console.error("❌ Error in handleNextQuestion:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    setCurrentQuestion("Tell me about yourself.");
    handleStart();
    
    return () => {
      if (scribe.isConnected) {
        scribe.disconnect();
      }
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h3 style={{ color: "white", fontSize: "30px" }}>Q: {currentQuestion}</h3>

      <p className="listening-tag">
        {scribe.isConnected ? "Listening..." : "Start speaking when ready"}
      </p>

      <BarVisualizer 
        isActive={scribe.isConnected}
        barCount={6}
        barGap={10}
        barWidth={15}
        barMaxHeight={80}
        primaryColor="#75a8ff"
        secondaryColor="#b0d4f4"
      />

      <div style={{ marginTop: 20 }}>
        <button
          className="next-btn"
          onClick={handleNextQuestion}
          disabled={isProcessing}
          style={{ opacity: isProcessing ? 0.6 : 1 }}
        >
          {isProcessing ? "Processing..." : "Next Question"}
        </button>

        <button
          className="end-btn"
          onClick={async () => {
            if (scribe.isConnected) {
              scribe.disconnect();
            }
            navigate("/");
          }}
          disabled={isProcessing}
        >
          End
        </button>
      </div>
    </div>
  );
}