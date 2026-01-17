import { useState } from 'react'
import { useLocation } from "react-router-dom";
import ElevenLabs from '../components/elevenlabcomp';

function InterviewSimulation() {

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: "#05080d"
      }}
    >
      {/* 🌌 Background Aurora */}
      

      {/* 🔝 Foreground Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            left: "30px",
          }}
        >
          <h3 style={{ color: "white", fontSize: "25px", margin: 0 }}>
            FlowState
          </h3>
          <h3
            style={{
              color: "#80e1f9",
              fontSize: "25px",
              marginLeft: "6px",
            }}
          >
            Interviews
          </h3>
        </div>
        <h2
          style={{
            color: "white",
            fontSize: "30px",
            textAlign: "center",
            marginTop: "-15px",
          }}
        >
          Q:
        </h2>

        <ElevenLabs/>
      </div>
      
    </div>
  );
}

export default InterviewSimulation;
