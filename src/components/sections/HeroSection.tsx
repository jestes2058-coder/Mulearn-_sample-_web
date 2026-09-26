import React from 'react';
import { HeroAiCore3D } from '../canvas/HeroAiCore3D';
import { Sparkles, ArrowRight, Play, Zap, Shield, Activity, Terminal } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onOpenDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onOpenDemo }) => {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '60px',
        paddingBottom: '40px',
        overflow: 'hidden',
      }}
    >
      <div className="max-w-container" style={{ width: '100%', position: 'relative', zIndex: 10 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Typography & CTAs */}
          <div>
            {/* Small Eyebrow */}
            <div
              className="badge-pill badge-cyan"
              style={{ marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Sparkles size={14} /> INTELLIGENCE, REIMAGINED
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.8rem, 6.2vw, 5.2rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                marginBottom: '22px',
                letterSpacing: '-0.04em',
              }}
            >
              <span className="text-gradient-hero">Build What</span>
              <br />
              <span className="text-gradient-aurora">Comes Next.</span>
            </h1>

            {/* Supporting Text */}
            <p
              style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.3rem)',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                maxWidth: '540px',
                marginBottom: '36px',
                fontWeight: 400,
              }}
            >
              An intelligent digital experience built to transform ideas into powerful technology.
            </p>

            {/* Call To Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <button onClick={onExplore} className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.02rem' }}>
                Explore Platform <ArrowRight size={18} />
              </button>
              <button onClick={onOpenDemo} className="btn-secondary" style={{ padding: '16px 28px', fontSize: '1.02rem' }}>
                <Play size={16} color="var(--accent-cyan)" /> See How It Works
              </button>
            </div>

            {/* Quick Live Telemetry Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginTop: '48px',
                paddingTop: '24px',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  Active Neural Nodes
                </span>
                <strong style={{ fontSize: '1.25rem', color: '#FFF', display: 'block', marginTop: '2px' }}>
                  256,000+
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  Inference Latency
                </span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--accent-cyan)', display: 'block', marginTop: '2px' }}>
                  3.8 ms
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  System Availability
                </span>
                <strong style={{ fontSize: '1.25rem', color: '#10B981', display: 'block', marginTop: '2px' }}>
                  99.99%
                </strong>
              </div>
            </div>
          </div>

          {/* Right Column: 3D AI Core Canvas Visual */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '520px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Ambient Background Glow Backdrop */}
            <div
              style={{
                position: 'absolute',
                width: '380px',
                height: '380px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 70%)',
                filter: 'blur(50px)',
                pointerEvents: 'none',
              }}
            />

            {/* Interactive Three.js 3D Core Canvas */}
            <HeroAiCore3D />

            {/* Overlay Status Tag */}
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                bottom: '12px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                borderColor: 'var(--border-cyan)',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10B981',
                  boxShadow: '0 0 8px #10B981',
                }}
              />
              <span style={{ color: 'var(--text-high)' }}>NEURAL ENGINE v5.2 ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
