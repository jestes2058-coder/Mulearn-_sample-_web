import React, { useState } from 'react';
import { Play, Sparkles, Terminal, Sliders, Cpu, Activity, Check, RefreshCw } from 'lucide-react';

export const PlaygroundSection: React.FC = () => {
  const [activeAction, setActiveAction] = useState<'Analyze' | 'Generate' | 'Predict' | 'Connect'>('Generate');
  const [temperature, setTemperature] = useState(0.7);
  const [depth, setDepth] = useState(48);
  const [isExecuting, setIsExecuting] = useState(false);
  const [outputLog, setOutputLog] = useState<string>('');

  const playgroundData = {
    Analyze: {
      input: 'Deconstruct semantic anomalies in distributed ledger payload #8812',
      reasoning: 'Constructing topological simplicial complexes across block transactions... Found zero collision vectors. Formal verification passed.',
      result: 'Payload verified with 100% mathematical integrity across all 4 validators.',
    },
    Generate: {
      input: 'Synthesize low-latency WASM-SIMD matrix multiplier with AVX-512 fallback',
      reasoning: 'Compiling vectorized intrinsics... Aligning 64-byte memory boundaries... Unrolling 8-wide loop registers.',
      result: 'Generated 42 LOC of optimal zero-overhead Rust kernel achieving 98.4% peak theoretical FLOPs.',
    },
    Predict: {
      input: 'Forecast edge cluster throughput across the next 24-hour cycle',
      reasoning: 'Ingesting historical seasonal manifolds... Accounting for cyclic user ingress surges at 09:00 UTC.',
      result: 'Projected peak demand at 14.8M req/s (+38%). Auto-scaling provisions staged seamlessly.',
    },
    Connect: {
      input: 'Establish Byzantine fault-tolerant gossip consensus across 1,024 nodes',
      reasoning: 'Broadcasting cryptographic threshold signatures... Validating zero-knowledge state root hashes.',
      result: 'Consensus achieved in 3.4ms across 1,024 global peer gateways.',
    },
  };

  const handleRun = () => {
    setIsExecuting(true);
    setOutputLog('Initiating tensor pipeline execution...');

    setTimeout(() => {
      setOutputLog(playgroundData[activeAction].reasoning);
    }, 400);

    setTimeout(() => {
      setIsExecuting(false);
    }, 900);
  };

  return (
    <section id="playground" style={{ padding: '90px 0', position: 'relative' }}>
      <div className="max-w-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="badge-pill badge-cyan" style={{ marginBottom: '14px' }}>
            <Terminal size={14} /> INTERACTIVE DEVELOPER PLAYGROUND
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', color: '#FFF', marginBottom: '16px' }}>
            Try the <span className="text-gradient-aurora">Intelligence.</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Experiment with neural actions in real time. Adjust hyperparameters and watch cognitive synthesis live.
          </p>
        </div>

        {/* Playground Card */}
        <div
          className="glass-panel"
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            padding: '36px',
            border: '1px solid var(--border-active)',
          }}
        >
          {/* Action Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {(['Analyze', 'Generate', 'Predict', 'Connect'] as const).map((act) => (
              <button
                key={act}
                onClick={() => {
                  setActiveAction(act);
                  setOutputLog('');
                }}
                style={{
                  background: activeAction === act ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : 'rgba(255, 255, 255, 0.04)',
                  border: activeAction === act ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid var(--border-subtle)',
                  color: '#FFF',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                [{act}]
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {/* Left Controls & Parameters */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Target Query
                </label>
                <div
                  style={{
                    background: 'rgba(4, 8, 18, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '14px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: '#38BDF8',
                    lineHeight: 1.5,
                  }}
                >
                  "{playgroundData[activeAction].input}"
                </div>
              </div>

              {/* Sliders */}
              <div>
                <div className="flex-between" style={{ fontSize: '0.82rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Sampling Temperature</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#FFF' }}>{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#06B6D4', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div className="flex-between" style={{ fontSize: '0.82rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Reasoning Depth</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#FFF' }}>{depth}-Hop</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="64"
                  step="4"
                  value={depth}
                  onChange={(e) => setDepth(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#6366F1', cursor: 'pointer' }}
                />
              </div>

              <button
                onClick={handleRun}
                disabled={isExecuting}
                className="btn-cyan"
                style={{ width: '100%', padding: '14px', marginTop: '8px' }}
              >
                {isExecuting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Synthesizing...
                  </>
                ) : (
                  <>
                    <Play size={16} /> Execute Action
                  </>
                )}
              </button>
            </div>

            {/* Right Execution Flow & Output */}
            <div
              style={{
                background: 'rgba(4, 8, 18, 0.95)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
              }}
            >
              <div>
                <div style={{ color: 'var(--text-dim)', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  // EXECUTION PIPELINE
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)' }}>
                  <div>
                    <span style={{ color: '#818CF8' }}>INPUT:</span> {activeAction.toUpperCase()}
                  </div>
                  <div>
                    <span style={{ color: '#06B6D4' }}>STATUS:</span> {isExecuting ? 'COMPUTING' : 'COMPLETED'}
                  </div>
                  {outputLog && (
                    <div style={{ color: 'var(--text-high)', marginTop: '8px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                      <span style={{ color: '#EC4899' }}>REASONING:</span> {outputLog}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#10B981', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  ✓ SYNTHESIZED RESULT:
                </span>
                <span style={{ color: '#FFF' }}>
                  {playgroundData[activeAction].result}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
