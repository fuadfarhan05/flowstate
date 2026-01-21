import { useEffect, useRef, useState } from 'react';

export default function BarVisualizer({ 
  barCount = 40, 
  barGap = 4, 
  barWidth = 8, 
  barMaxHeight = 80,
  primaryColor = "#6989f2",
  secondaryColor = "#0088ff",
  isActive = true 
}) {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const [bars, setBars] = useState(Array(barCount).fill(5));

  useEffect(() => {
    if (!isActive) {
      // Reset bars to minimum height when inactive
      setBars(Array(barCount).fill(5));
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      return;
    }

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;
        
        const analyser = audioContext.createAnalyser();
        analyserRef.current = analyser;
        analyser.fftSize = 512; // Increased for better frequency resolution
        analyser.smoothingTimeConstant = 0.6; // Less smoothing for more responsiveness
        analyser.minDecibels = -80; // Increased sensitivity
        analyser.maxDecibels = -20; // Better dynamic range
        
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateBars = () => {
          animationRef.current = requestAnimationFrame(updateBars);
          
          analyser.getByteFrequencyData(dataArray);
          
          const newBars = [];
          
          // Human voice is typically 85-255 Hz (fundamental) and harmonics up to ~4000 Hz
          // We want to emphasize the middle frequencies for voice
          const startFreq = 50; // Hz
          const endFreq = 4000; // Hz
          const sampleRate = audioContext.sampleRate;
          const frequencyStep = sampleRate / analyser.fftSize;
          
          for (let i = 0; i < barCount; i++) {
            // Map bars to voice frequency range (emphasize middle)
            const frequency = startFreq + (endFreq - startFreq) * (i / barCount);
            const dataIndex = Math.floor(frequency / frequencyStep);
            
            const value = dataArray[Math.min(dataIndex, bufferLength - 1)];
            
            // Increase sensitivity with a multiplier and add boost for middle frequencies
            const position = i / barCount;
            const middleBoost = 1 + (1 - Math.abs(position - 0.5) * 2) * 0.5; // 1.0 to 1.5x boost in middle
            const sensitivity = 1.8; // Overall sensitivity multiplier
            
            const height = Math.max(5, Math.min(barMaxHeight, (value / 255) * barMaxHeight * sensitivity * middleBoost));
            newBars.push(height);
          }
          
          setBars(newBars);
        };

        updateBars();
      } catch (error) {
        console.error('Microphone access error:', error);
      }
    };

    initAudio();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [isActive, barCount, barMaxHeight]);

  const totalWidth = barCount * (barWidth + barGap) - barGap;

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: `${barMaxHeight}px`,
        gap: `${barGap}px`,
        padding: '20px 0',
        width: '100%',
        maxWidth: `${totalWidth}px`,
        margin: '0 auto',
      }}
    >
      {bars.map((height, index) => {
        // Create gradient effect across bars
        const colorRatio = index / barCount;
        const color = secondaryColor 
          ? `color-mix(in srgb, ${primaryColor} ${(1 - colorRatio) * 100}%, ${secondaryColor} ${colorRatio * 100}%)`
          : primaryColor;

        return (
          <div
            key={index}
            style={{
              width: `${barWidth}px`,
              height: `${height}px`,
              backgroundColor: color,
              borderRadius: `${barWidth / 2}px`,
              transition: 'height 0.08s ease-out',
              boxShadow: `0 0 10px ${primaryColor}40`,
            }}
          />
        );
      })}
    </div>
  );
}