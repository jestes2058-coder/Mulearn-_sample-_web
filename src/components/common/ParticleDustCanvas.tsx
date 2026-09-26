import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  color: string;
  isAmbient?: boolean;
  angle?: number;
  speed?: number;
}

const SPARKLE_COLORS = [
  '#06B6D4', // Cyan
  '#38BDF8', // Sky Blue
  '#818CF8', // Indigo
  '#FBBF24', // Stardust Gold
  '#FFFFFF', // Pure White Sparkle
  '#EC4899', // Aurora Pink
];

export const ParticleDustCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles: Particle[] = [];
    let ambientParticles: Particle[] = [];
    let mouse = { x: -1000, y: -1000, lastX: -1000, lastY: -1000, speed: 0 };
    let animationFrameId: number;

    // Initialize ambient floating dust particles
    const ambientCount = Math.min(100, Math.floor((width * height) / 14000));
    for (let i = 0; i < ambientCount; i++) {
      ambientParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.15 - Math.random() * 0.35,
        size: 0.8 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.5,
        maxLife: 1000,
        life: 1000,
        color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
        isAmbient: true,
      });
    }

    // Spawn sparkling dust trail on cursor movement
    const spawnCursorDust = (x: number, y: number, count = 3) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 2.2;
        const color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
        const maxLife = 35 + Math.floor(Math.random() * 35);

        particles.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.5,
          vy: Math.sin(angle) * speed - 0.4, // subtle upward buoyancy
          size: 1 + Math.random() * 2.5,
          alpha: 0.9,
          maxLife,
          life: maxLife,
          color,
          isAmbient: false,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - (mouse.lastX === -1000 ? e.clientX : mouse.lastX);
      const dy = e.clientY - (mouse.lastY === -1000 ? e.clientY : mouse.lastY);
      const dist = Math.sqrt(dx * dx + dy * dy);

      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.speed = dist;
      mouse.lastX = e.clientX;
      mouse.lastY = e.clientY;

      // Spawn more sprinkles when moving faster
      const spawnCount = Math.min(6, Math.max(2, Math.floor(dist / 8)));
      spawnCursorDust(e.clientX, e.clientY, spawnCount);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
        spawnCursorDust(touch.clientX, touch.clientY, 3);
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // Main 60fps Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      ctx.clearRect(0, 0, width, height);

      // 1. Render Ambient Background Dust
      for (let i = 0; i < ambientParticles.length; i++) {
        const p = ambientParticles[i];

        // Gentle cursor magnetic push/repulsion wave
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around borders
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        // Ambient gentle twinkle
        const twinkleAlpha = p.alpha * (0.6 + 0.4 * Math.sin(Date.now() * 0.003 + i));

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, twinkleAlpha);
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Render Interactive Cursor Dust Sprinkles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life--;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94; // air resistance drag
        p.vy *= 0.94;
        p.vy -= 0.02; // soft float upward

        const progress = p.life / p.maxLife;
        const alpha = p.alpha * progress;
        const currentSize = Math.max(0.5, p.size * (0.4 + 0.6 * progress));

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;

        // Draw diamond/sparkle star
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fill();

        // Extra tiny starlight cross shimmer for larger particles
        if (p.size > 2 && progress > 0.4) {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.6;
          ctx.globalAlpha = alpha * 0.7;
          ctx.beginPath();
          ctx.moveTo(p.x - currentSize * 1.8, p.y);
          ctx.lineTo(p.x + currentSize * 1.8, p.y);
          ctx.moveTo(p.x, p.y - currentSize * 1.8);
          ctx.lineTo(p.x, p.y + currentSize * 1.8);
          ctx.stroke();
        }

        ctx.restore();
      }

      // Cap maximum trail particles for optimal 60fps performance
      if (particles.length > 200) {
        particles.splice(0, particles.length - 200);
      }
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
};
