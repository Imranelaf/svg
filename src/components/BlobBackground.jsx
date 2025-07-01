import { useEffect, useRef } from "react";

const BlobAnimation = ({color = "#0ff"}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const pointsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const container = canvas.parentElement;
    
    // Set canvas size to match container
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Define constants - center within the container
    const center = { x: canvas.width / 2, y: canvas.height / 2 };
    const radius = Math.min(canvas.width, canvas.height) / 3; // Responsive radius
    const pointCount = 40;
    const threshold = 80;
    
    // Mouse event handler - convert global coordinates to canvas-relative
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Create circle points
    const createCirclePoints = () => {
      pointsRef.current = [];
      for (let i = 0; i < pointCount; i++) {
        const angle = (i / pointCount) * Math.PI * 2;
        const x = center.x + Math.cos(angle) * radius;
        const y = center.y + Math.sin(angle) * radius;
        pointsRef.current.push({
          x, y,
          originalX: x,
          originalY: y,
          vx: 0,
          vy: 0,
        });
      }
    };

    // Distance function
    const distance = (a, b) => {
      return Math.hypot(a.x - b.x, a.y - b.y);
    };

    // Draw blob function
    const drawBlob = (points) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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
      
      ctx.fillStyle = color;
      ctx.fill();
    };

    // Animation function

const animate = () => {
  const points = pointsRef.current;
  const mouse = mouseRef.current;
  const time = Date.now() * 0.002; // Adjust speed multiplier

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

    // Add subtle oscillation for organic motion
    const angle = (i / points.length) * Math.PI * 2;
    const oscillation = Math.sin(time + angle) * 0.8; // 0.5 pixel amplitude
    const oscillationY = Math.cos(time + angle) * 0.8; // for Y axis variation

    // Spring back to original + oscillation
    point.vx += ((point.originalX + oscillation) - point.x) * 0.1;
    point.vy += ((point.originalY + oscillationY) - point.y) * 0.1;

    point.vx *= 0.85;
    point.vy *= 0.85;
    point.x += point.vx;
    point.y += point.vy;
  }

  drawBlob(points);
  animationRef.current = requestAnimationFrame(animate);
};


    // Initialize and start animation
    createCirclePoints();
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        
      }}
    />
  );
};

export default BlobAnimation;