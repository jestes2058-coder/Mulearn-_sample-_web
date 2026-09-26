import React, { useEffect } from 'react';

/**
 * Global 3D Interactive Tilt Manager for Buttons, Tiles, Glass Cards & Date/Time Countdown Bars
 * Provides buttery smooth perspective tilt and dynamic specular glare effects with configurable intensity.
 */
export const TiltManager: React.FC = () => {
  useEffect(() => {
    // Check if device supports hover/fine pointer
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const targets = new Map<
      HTMLElement,
      {
        rafId: number | null;
        targetX: number;
        targetY: number;
        currentX: number;
        currentY: number;
        isHovered: boolean;
        maxTilt: number;
        perspective: number;
        scaleFactor: number;
      }
    >();

    const updateTilt = (el: HTMLElement) => {
      const state = targets.get(el);
      if (!state) return;

      // Smooth damping lerp
      state.currentX += (state.targetX - state.currentX) * 0.18;
      state.currentY += (state.targetY - state.currentY) * 0.18;

      const scale = state.isHovered ? state.scaleFactor : 1;
      const rotX = state.currentY * state.maxTilt;
      const rotY = state.currentX * state.maxTilt;

      el.style.transform = `perspective(${state.perspective}px) rotateX(${-rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;

      // Continue animation loop if still moving or not yet settled at 0
      if (
        state.isHovered ||
        Math.abs(state.currentX) > 0.003 ||
        Math.abs(state.currentY) > 0.003
      ) {
        state.rafId = requestAnimationFrame(() => updateTilt(el));
      } else {
        el.style.transform = `perspective(${state.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        state.rafId = null;
      }
    };

    const onMouseEnter = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      let state = targets.get(el);

      const isTimeOrDateBar = el.classList.contains('countdown-segment') || 
                              el.classList.contains('countdown-row') || 
                              el.classList.contains('countdown-hero-card') ||
                              el.getAttribute('data-tilt-intensity') === 'high';

      const isButton = el.classList.contains('btn-primary') || 
                       el.classList.contains('btn-secondary') || 
                       el.classList.contains('btn-gold');

      // Much higher intensity for time/date bars
      const maxTilt = isTimeOrDateBar ? 26 : isButton ? 14 : 9;
      const perspective = isTimeOrDateBar ? 600 : 900;
      const scaleFactor = isTimeOrDateBar ? 1.08 : isButton ? 1.04 : 1.02;

      if (!state) {
        state = {
          rafId: null,
          targetX: 0,
          targetY: 0,
          currentX: 0,
          currentY: 0,
          isHovered: true,
          maxTilt,
          perspective,
          scaleFactor,
        };
        targets.set(el, state);
      } else {
        state.isHovered = true;
        state.maxTilt = maxTilt;
        state.perspective = perspective;
        state.scaleFactor = scaleFactor;
      }

      el.style.willChange = 'transform';
      el.style.transformStyle = 'preserve-3d';
      el.style.transition = 'box-shadow 0.25s ease, border-color 0.25s ease';

      if (!state.rafId) {
        state.rafId = requestAnimationFrame(() => updateTilt(el));
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      const state = targets.get(el);
      if (!state) return;

      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

      state.targetX = x * 2; // -1 to 1
      state.targetY = y * 2; // -1 to 1

      if (!state.rafId) {
        state.rafId = requestAnimationFrame(() => updateTilt(el));
      }
    };

    const onMouseLeave = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      const state = targets.get(el);
      if (!state) return;

      state.isHovered = false;
      state.targetX = 0;
      state.targetY = 0;

      if (!state.rafId) {
        state.rafId = requestAnimationFrame(() => updateTilt(el));
      }
    };

    // Attach listeners to all eligible tiles, buttons and high-intensity countdown elements
    const attachListeners = () => {
      const selector = '.glass-panel, .glass-panel-glow, .stat-card, .btn-primary, .btn-secondary, .btn-gold, .countdown-segment, .countdown-row, .countdown-hero-card, [data-tilt]';
      const elements = document.querySelectorAll<HTMLElement>(selector);

      elements.forEach((el) => {
        // Skip if already bound or if modal content card
        if (el.hasAttribute('data-tilt-bound') || el.classList.contains('modal-content-card')) return;
        el.setAttribute('data-tilt-bound', 'true');
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mousemove', onMouseMove);
        el.addEventListener('mouseleave', onMouseLeave);
      });
    };

    attachListeners();

    // Observe DOM mutations to bind new elements when tabs/views switch
    const observer = new MutationObserver(() => {
      attachListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      targets.forEach((state, el) => {
        if (state.rafId) cancelAnimationFrame(state.rafId);
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mousemove', onMouseMove);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
      targets.clear();
    };
  }, []);

  return null;
};
