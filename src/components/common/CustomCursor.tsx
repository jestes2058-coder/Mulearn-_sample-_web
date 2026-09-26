import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for touch device
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check hover targets
      const target = e.target as HTMLElement | null;
      const interactiveEl = target?.closest('button, a, input, [data-cursor], .glass-card-interactive');

      if (interactiveEl) {
        setIsHovered(true);
        const label = interactiveEl.getAttribute('data-cursor') || 
                      (interactiveEl.tagName === 'BUTTON' ? 'EXPLORE' : interactiveEl.tagName === 'A' ? 'OPEN' : 'VIEW');
        setCursorLabel(label);
      } else {
        setIsHovered(false);
        setCursorLabel(null);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    // Smooth spring follower loop
    const followLoop = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setFollowerPos({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(followLoop);
    };

    animationFrameId = requestAnimationFrame(followLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Central Cursor Dot */}
      <div
        className="custom-cursor-dot"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          opacity: isHovered ? 0 : 1,
        }}
      />

      {/* Outer Magnetic Follower */}
      <div
        className={`custom-cursor-follower ${isHovered ? 'hovered' : ''}`}
        style={{
          left: `${followerPos.x}px`,
          top: `${followerPos.y}px`,
        }}
      >
        {cursorLabel && <span className="custom-cursor-label">{cursorLabel}</span>}
      </div>
    </>
  );
};
