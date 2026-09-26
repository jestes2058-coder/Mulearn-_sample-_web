import React from 'react';
import { ArrowRight, Sparkles, Terminal, Shield } from 'lucide-react';

interface CtaSectionProps {
  onStartBuilding: () => void;
  onExploreTech: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onStartBuilding, onExploreTech }) => {
  return (
    <section style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
      <div className="max-w-container" style={{ position: 'relative', zIndex: 10 }}>
        <div
          className="glass-panel"
          style={{
            padding: '80px 48px',
            textAlign: 'center',
            background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.28) 0%, rgba(6, 11, 24, 0.95) 100%)',
            border: '1.5px solid var(--border-active)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(99, 102, 241, 0.3)',
            maxWidth: '1080px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          {/* Ambient Glowing Orb backdrop */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '450px',
              height: '450px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />

          <div className="badge-pill badge-cyan" style={{ marginBottom: '20px', position: 'relative', zIndex: 2 }}>
            <Sparkles size={14} /> ENTERPRISE INTELLIGENCE
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.6rem, 5.8vw, 4.8rem)',
              color: '#FFF',
              marginBottom: '20px',
              lineHeight: 1.1,
              position: 'relative',
              zIndex: 2,
            }}
          >
            Ready to <span className="text-gradient-aurora">Build the Future?</span>
          </h2>

          <p
            style={{
              color: 'var(--text-high)',
              fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
              maxWidth: '620px',
              margin: '0 auto 40px',
              lineHeight: 1.6,
              position: 'relative',
              zIndex: 2,
            }}
          >
            Turn your next idea into an intelligent digital experience. Deploy autonomous pipelines with zero friction.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <button
              onClick={onStartBuilding}
              className="btn-cyan"
              style={{ padding: '16px 36px', fontSize: '1.05rem', gap: '10px' }}
            >
              Start Building Now <ArrowRight size={18} />
            </button>
            <button
              onClick={onExploreTech}
              className="btn-secondary"
              style={{ padding: '16px 32px', fontSize: '1.05rem' }}
            >
              Explore Technology
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
