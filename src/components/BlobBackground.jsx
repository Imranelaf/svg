import { useEffect, useRef } from "react";

const BlobAnimation = ({color = null, text = "", imageSrc = "", randomness = 0.5}, size = 1) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const pointsRef = useRef([]);
  const imageRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const container = canvas.parentElement;
    
    // Load image if imageSrc is provided
    if (imageSrc && !imageRef.current) {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Handle CORS if needed
      img.onload = () => {
        imageRef.current = img;
      };
      img.onerror = () => {
        console.warn("Failed to load image:", imageSrc);
        imageRef.current = null;
      };
      img.src = imageSrc;
    } else if (!imageSrc) {
      imageRef.current = null;
    }
    
    // Set canvas size to match container
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * size;
      canvas.height = rect.height * size;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Define constants - center within the container
     const center = { x: canvas.width / 2, y: canvas.height / 2 };
    const baseRadius = Math.min(canvas.width, canvas.height) / 3 * size;// Base radius
    const pointCount = 40;
    const threshold = 80;
    
    // Mouse event handler - convert global coordinates to canvas-relative
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Create organic blob points with controllable randomness
    const createBlobPoints = () => {
      pointsRef.current = [];
      for (let i = 0; i < pointCount; i++) {
        const angle = (i / pointCount) * Math.PI * 2;
        
        // Clamp randomness between 0 and 1
        const clampedRandomness = Math.max(0, Math.min(1, randomness));
        
        // Add randomness to radius for organic shape
        // When randomness = 0: radiusVariation = 1 (perfect circle)
        // When randomness = 1: radiusVariation varies between 0.3 and 1.0
        const radiusVariation = clampedRandomness === 0 ? 1 : 
          (0.3 + Math.random() * 0.7) * clampedRandomness + (1 - clampedRandomness);
        
        // Sine wave distortion - scale with randomness
        const noiseOffset = clampedRandomness * (Math.sin(angle * 3) * 0.2 + Math.cos(angle * 5) * 0.15);
        const finalRadius = baseRadius * (radiusVariation + noiseOffset);
        
        const x = center.x + Math.cos(angle) * finalRadius;
        const y = center.y + Math.sin(angle) * finalRadius;
        
        pointsRef.current.push({
          x, y,
          originalX: x,
          originalY: y,
          vx: 0,
          vy: 0,
          baseRadius: finalRadius, // Store individual radius for each point
          angle: angle
        });
      }
    };

    // Distance function
    const distance = (a, b) => {
      return Math.hypot(a.x - b.x, a.y - b.y);
    };

    // Draw blob function with text or image
    const drawBlob = (points) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Check if we should use image as mask (no color provided) or traditional blob
      const useImageAsMask = !color && imageSrc && imageRef.current;
      
      if (useImageAsMask) {
        // IMAGE AS MASK MODE: Image becomes the blob shape
        ctx.save();
        
        // Create blob shape path
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const cx = (prev.x + curr.x) / 2;
          const cy = (prev.y + curr.y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
        }
        
        // Close shape
        const last = points[points.length - 1];
        const first = points[0];
        const cx = (last.x + first.x) / 2;
        const cy = (last.y + first.y) / 2;
        ctx.quadraticCurveTo(last.x, last.y, cx, cy);
        ctx.closePath();
        
        // Use blob shape as clipping mask
        ctx.clip();
        
        // Calculate image dimensions to cover the entire blob area
        const image = imageRef.current;
        const imageAspect = image.width / image.height;
        
        // Make image large enough to cover the blob completely
        const coverRadius = baseRadius * 1.2;
        let drawWidth, drawHeight;
        
        if (imageAspect > 1) {
          // Landscape image
          drawWidth = coverRadius * 2;
          drawHeight = drawWidth / imageAspect;
        } else {
          // Portrait or square image
          drawHeight = coverRadius * 2;
          drawWidth = drawHeight * imageAspect;
        }
        
        // Center the image
        const drawX = center.x - drawWidth / 2;
        const drawY = center.y - drawHeight / 2;
        
        // Draw the image (will be clipped to blob shape)
        ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
        
        ctx.restore();
        
      } else {
        // TRADITIONAL MODE: Draw colored blob background first
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const cx = (prev.x + curr.x) / 2;
          const cy = (prev.y + curr.y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
        }
        
        // Close shape
        const last = points[points.length - 1];
        const first = points[0];
        const cx = (last.x + first.x) / 2;
        const cy = (last.y + first.y) / 2;
        ctx.quadraticCurveTo(last.x, last.y, cx, cy);
        ctx.closePath();
        
        // Fill with color (default to cyan if no color and no image)
        ctx.fillStyle = color || "#0ff";
        ctx.fill();

        // Draw content inside the blob (prioritize image over text)
        if (imageSrc && imageRef.current) {
          // Draw image inside blob
          ctx.save();
          
          // Create clipping mask from the blob shape
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          
          for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const cx = (prev.x + curr.x) / 2;
            const cy = (prev.y + curr.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
          }
          
          const lastPoint = points[points.length - 1];
          const firstPoint = points[0];
          const cxClose = (lastPoint.x + firstPoint.x) / 2;
          const cyClose = (lastPoint.y + firstPoint.y) / 2;
          ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, cxClose, cyClose);
          ctx.closePath();
          ctx.clip();
          
          // Calculate image dimensions to fit inside blob while maintaining aspect ratio
          const image = imageRef.current;
          const blobRadius = baseRadius * 0.8; // Make image slightly smaller than blob
          const imageAspect = image.width / image.height;
          
          let drawWidth, drawHeight;
          if (imageAspect > 1) {
            // Landscape image
            drawWidth = blobRadius * 2;
            drawHeight = drawWidth / imageAspect;
          } else {
            // Portrait or square image
            drawHeight = blobRadius * 2;
            drawWidth = drawHeight * imageAspect;
          }
          
          // Center the image
          const drawX = center.x - drawWidth / 2;
          const drawY = center.y - drawHeight / 2;
          
          // Add subtle shadow/glow effect
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 10;
          
          ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
          
          ctx.restore();
          
        } else if (text) {
          // Draw text inside the blob if no image
          ctx.save();
          
          // Set text properties
          const fontSize = Math.min(canvas.width, canvas.height) / 8;
          ctx.font = `bold ${fontSize}px Arial`;
          ctx.fillStyle = 'white';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Add text shadow for better visibility
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          
          // Draw text at center
          ctx.fillText(text, center.x, center.y);
          
          ctx.restore();
        }
      }
    };

    // Animation function
    const animate = () => {
      const points = pointsRef.current;
      const mouse = mouseRef.current;
      const time = Date.now() * 0.002;
      
      // Scale oscillation with randomness
      const clampedRandomness = Math.max(0, Math.min(1, randomness));
      const oscillationStrength = clampedRandomness * 0.8; // Scale down oscillation for perfect circle

      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const dist = distance(mouse, point);
        
        // Mouse force interaction
        if (dist < threshold) {
          const force = (threshold - dist) / threshold;
          const angle = Math.atan2(point.y - mouse.y, point.x - mouse.x);
          point.vx += Math.cos(angle) * force * 5;
          point.vy += Math.sin(angle) * force * 5;
        }

        // Enhanced organic oscillation - scaled by randomness
        const primaryWave = Math.sin(time + point.angle * 2) * oscillationStrength;
        const secondaryWave = Math.cos(time * 1.5 + point.angle * 3) * oscillationStrength * 0.5;
        const tertiaryWave = Math.sin(time * 0.8 + point.angle * 5) * oscillationStrength * 0.3;
        
        const oscillationX = primaryWave + secondaryWave + 5;
        const oscillationY = Math.cos(time + point.angle * 2) * oscillationStrength + tertiaryWave;

        // Spring back to original position with oscillation
        point.vx += ((point.originalX + oscillationX) - point.x) * 0.08;
        point.vy += ((point.originalY + oscillationY) - point.y) * 0.08;

        // Apply damping
        point.vx *= 0.88;
        point.vy *= 0.88;
        
        // Update position
        point.x += point.vx;
        point.y += point.vy;
      }

      drawBlob(points);
      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize and start animation
    createBlobPoints();
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [color, text, imageSrc, randomness, size]);

  return (
    <canvas 
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        
      }}
    />
  );
};



export default BlobAnimation;