import { useState } from "react";
import { useLocation } from "react-router-dom";
import ElevenLabs from "../components/elevenlabcomp";
import '../styles/App.css';

function InterviewSimulation() {
  return (
    <div className="App">
  
        <ElevenLabs />
    </div>
  );
}

export default InterviewSimulation;
