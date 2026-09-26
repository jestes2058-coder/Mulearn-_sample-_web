import React from 'react';
import { Heart, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" style={{ padding: '100px 0', position: 'relative' }}>
      <div className="max-w-container">
        <div
          className="glass-panel"
          style={{
            padding: '72px 48px',
            maxWidth: '1080px',
            margin: '0 auto',
            background: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(6, 11, 24, 0.95) 100%)',
            border: '1px solid var(--border-active)',
          }}
        >
          <div className="badge-pill badge-indigo" style={{ marginBottom: '20px' }}>
            <Sparkles size={14} /> CORE PHILOSOPHY
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)',
              color: '#FFF',
              lineHeight: 1.1,
              marginBottom: '36px',
              maxWidth: '820px',
            }}
          >
            Technology should <span className="text-gradient-cyan">feel human.</span>
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              fontSize: '1.05rem',
              color: 'var(--text-high)',
              lineHeight: 1.7,
            }}
          >
            <div>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                We believe artificial intelligence is not meant to constrain human ingenuity, but to expand our cognitive reach. Software must adapt seamlessly to intention—removing mechanical friction so creators can build what comes next.
              </p>
            </div>

            <div>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                By harmonizing sparse neural reasoning, hardware-attested privacy, and sub-millisecond edge synchronization, we create systems that feel intuitive, responsive, and remarkably alive.
              </p>
            </div>

            <div>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                From high-frequency financial telemetry to autonomous spatial robotics, AETHERIS provides the unified bedrock that turns complex problems into elegant, reliable technology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
