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
            border: "5px solid #ffffff",
            objectFit: "cover",
            boxShadow: `
                0 0 15px rgba(44, 155, 183, 0.6),
                0 0 40px rgba(44, 155, 183, 0.4)
                `,
            marginTop: '0px',
        }}
        />
    </div> 
    


    </div>
  );
}

export default CameraPreview;
