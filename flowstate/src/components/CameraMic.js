import { useEffect, useRef } from "react";

function CameraPreview() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    }

    startCamera();

    // Cleanup camera on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
       <div
        style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            top: "-60px",   // 👈 move down
            left: "30px",  // 👈 move right
        }}
        >
        <h3 style={{ color: "white", fontSize: "25px", margin: 0 }}>FlowState</h3>
        <h3 style={{ color: "#80e1f9", fontSize: "25px", marginLeft: "6px" }}>
            Interviews
        </h3>
        </div>

      <div>
        <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
            width: "800px",
            height: "500px",
            borderRadius: "50px",
            border: "5px solid #76e4ff",
            objectFit: "cover",
            boxShadow: `
                0 0 15px rgba(44, 155, 183, 0.6),
                0 0 40px rgba(44, 155, 183, 0.4)
                `,
            marginTop: '-50px',
        }}
        />
    </div> 
    


     <h2 style={{color: 'white', fontSize: '35px'}}>Tell us about your experience at FlowState</h2>
    </div>
  );
}

export default CameraPreview;
