import { useScribe } from "@elevenlabs/react";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/elevenstyle.css";
import BarVisualizer from "./barvisualizer";
import { useLocation } from "react-router-dom";


export default function ElevenLabs() {

  const location = useLocation();
  const questions = location.state?.questions || [];

  const experienceIndexRef = useRef(0); // xp questions
  const followUpCountRef = useRef(0);   //drill questions based on answer
  const MAX_FOLLOWUPS = 2; //in the future this will be a user choice


  const navigate = useNavigate();
  const isSpeakingRef = useRef(false);
  const currentAnswerRef = useRef("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [evalData, setEvalData] = useState(null);
  const qaBufferRef = useRef([]);

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
    } else {
      // Move to next experience
      experienceIndexRef.current += 1;
      followUpCountRef.current = 0;

      if (experienceIndexRef.current < questions.length) {
        setCurrentQuestion(
          questions[experienceIndexRef.current]
        );
      } else {
        console.log("✅ Interview complete");
      }
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
      await new Promise((resolve) => setTimeout(resolve, 300));

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
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Reconnect
      await handleStart();
      console.log("🎙️ Reconnected");
    } catch (error) {
      console.error("❌ Error in handleNextQuestion:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnd = async () => {
    const transcriptlog = qaBufferRef.current
      .map((qa, i) => `Interviewer: ${qa.question}\nCandidate: ${qa.answer}`)
      .join("\n\n");

    try {
      const res = await fetch("http://localhost:5434/api/v1/grade-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcriptlog }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();

      setEvalData(data.evaluation); // store locally
      return data.evaluation;
    } catch (error) {
      console.error("unable to get a grade", error);
      return null;
    }
  };

  useEffect(() => {
    if (!questions.length) {
      console.warn("No questions passed to interview");
      return;
    }

    setCurrentQuestion(questions[0]);
    handleStart();

    return () => {
      if (scribe.isConnected) {
        scribe.disconnect();
      }
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <div className="question-card">
        <h3 id="question-gen" style={{ color: "white", fontSize: "30px" }}>{currentQuestion}</h3>
      </div>

      <button
          className="next-btn"
          onClick={handleNextQuestion}
          disabled={isProcessing}
          style={{ opacity: isProcessing ? 0.6 : 1 }}
        >
          {isProcessing ? "Processing..." : "Next Question"}
        </button>

      

      <div style={{marginTop: '100px'}}>
        <BarVisualizer
        isActive={scribe.isConnected}
        barCount={6}
        barGap={10}
        barWidth={15}
        barMaxHeight={80}
        primaryColor="#75a8ff"
        secondaryColor="#b0d4f4"
      />
      </div>

      <div style={{ marginTop: 20 }}>

        <button
          className="end-btn"
          onClick={async () => {
            const evaluation = await handleEnd();

            if (scribe.isConnected) {
              scribe.disconnect();
            }

            navigate("/results", { state: { evaluation } });
          }}
          disabled={isProcessing}
        >
          Finish Here
        </button>
      </div>
    </div>
  );
}
