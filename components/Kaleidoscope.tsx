import React, { useRef, useEffect } from 'react';

interface KaleidoscopeProps {
  imageSrc: string;
  isPlaying: boolean;
  speed?: number;
}

export const Kaleidoscope: React.FC<KaleidoscopeProps> = ({ imageSrc, isPlaying, speed = 0.002 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const angleRef = useRef<number>(0);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    // Reset image ref when src changes so we don't show old image immediately
    imgRef.current = null;
    
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
    };
  }, [imageSrc]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Schedule next frame immediately so loop doesn't die if image isn't ready
    requestRef.current = requestAnimationFrame(draw);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.max(w, h) * 0.7; // Size of segments

    // Update state only if playing
    if (isPlaying) {
      angleRef.current += speed;
    }

    // Always clear/draw background
    ctx.fillStyle = '#0f172a'; // Dark background
    ctx.fillRect(0, 0, w, h);

    // If image hasn't loaded yet, stop drawing content
    if (!imgRef.current) return;

    // Slices
    const slices = 12;
    const step = (Math.PI * 2) / slices;

    for (let i = 0; i < slices; i++) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(i * step);
      
      // Create triangular clipping path
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, -step / 2, step / 2);
      ctx.closePath();
      ctx.clip();

      // Rotate image inside the slice
      // We flip every other slice to make it seamless
      if (i % 2 === 0) {
        ctx.scale(1, -1);
      }
      
      // Moving the image pattern
      const imgSize = 400; // Assuming square tile from picsum
      // Move image based on time to create flow
      const movement = Math.sin(angleRef.current) * 50;
      
      ctx.rotate(angleRef.current);
      ctx.drawImage(imgRef.current, -imgSize/2 + movement, -imgSize/2, imgSize, imgSize);

      ctx.restore();
    }
  };

  useEffect(() => {
    const handleResize = () => {
        if(canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    // Start loop
    requestRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, imageSrc]); // Re-bind if deps change

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full object-cover z-0"
    />
  );
};