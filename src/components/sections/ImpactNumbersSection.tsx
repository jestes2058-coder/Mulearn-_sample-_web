import React from 'react';
import { TrendingUp, ShieldCheck, Cpu, Zap, Activity } from 'lucide-react';

export const ImpactNumbersSection: React.FC = () => {
  const stats = [
    {
      value: '10K+',
      label: 'Telemetry Points / Sec',
      desc: 'Real-time vector ingestion & spatial processing.',
      color: 'var(--accent-cyan)',
    },
    {
      value: '99.99%',
      label: 'System Availability',
      desc: 'Byzantine fault-tolerant multi-cloud mesh.',
      color: '#10B981',
    },
    {
      value: '24/7',
      label: 'Autonomous Operation',
      desc: 'Self-healing infrastructure without human bottlenecks.',
      color: '#818CF8',
    },
    {
      value: '∞',
      label: 'Creative Possibilities',
      desc: 'From generative UI to physical edge robotics.',
      color: '#EC4899',
    },
  ];

  return (
    <section style={{ padding: '80px 0', position: 'relative' }}>
      <div className="max-w-container">
        <div
          className="glass-panel"
          style={{
            padding: '56px 40px',
            background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.12) 0%, rgba(6, 11, 24, 0.95) 100%)',
            border: '1px solid var(--border-active)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="badge-pill badge-cyan" style={{ marginBottom: '12px' }}>
              <TrendingUp size={14} /> BENCHMARK IMPACT
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3.2rem)', color: '#FFF' }}>
              Built for Scale.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '540px', margin: '8px auto 0' }}>
              Engineered to support global workloads with sub-millisecond precision.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '28px',
            }}
          >
            {stats.map((st, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: 'center',
                  padding: '24px 16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '3.2rem',
                    fontWeight: 900,
                    color: st.color,
                    lineHeight: 1.1,
                    marginBottom: '8px',
                  }}
                >
                  {st.value}
                </div>
                <h4 style={{ fontSize: '1.05rem', color: '#FFF', marginBottom: '6px' }}>
                  {st.label}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.5, margin: 0 }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
