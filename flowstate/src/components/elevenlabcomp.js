import { useScribe } from "@elevenlabs/react";

export default function ElevenLabs() {
    const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    onPartialTranscript: (data) => {
      console.log("Partial:", data.text);
    },
    onCommittedTranscript: (data) => {
      console.log("Committed:", data.text);
    },

    //may not need time stamp but will use for testing
    onCommittedTranscriptWithTimestamps: (data) => {
      console.log("Committed with timestamps:", data.text);
      console.log("Timestamps:", data.words);
    },
  });

  async function fetchTokenFromServer() {
    try {
      const res = await fetch("http://localhost:5434/api/v1/scribe-token");
      const data = await res.json();

      return data.token;
    }catch (error) {
      console.error("Failed to fetch token:", error);
    }
    
  }


  const handleStart = async () => {
    // Fetch a single use token from the server
    const token = await fetchTokenFromServer();
    await scribe.connect({
      token,
      microphone: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
  };

  return (
    <div>
      <button onClick={handleStart} disabled={scribe.isConnected}>
        Start Recording
      </button>
      <button onClick={scribe.disconnect} disabled={!scribe.isConnected}>
        Stop
      </button>
      {scribe.partialTranscript && <p>Live: {scribe.partialTranscript}</p>}
      <div>
        {scribe.committedTranscripts.map((t) => (
          <p key={t.id}>{t.text}</p>
        ))}
      </div>
    </div>

  );
}

