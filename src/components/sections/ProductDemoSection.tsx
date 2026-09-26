import React, { useState } from 'react';
import { Play, Sparkles, Terminal, Activity, CheckCircle2, RefreshCw, Layers, Cpu, ArrowRight } from 'lucide-react';

interface ScenarioPreset {
  title: string;
  prompt: string;
  confidence: number;
  latency: string;
  tokens: string;
  resultSummary: string;
  points: { label: string; value: number }[];
}

export const ProductDemoSection: React.FC = () => {
  const presets: ScenarioPreset[] = [
    {
      title: 'Latency Bottlenecks',
      prompt: 'Analyze system memory & microservice latency bottlenecks',
      confidence: 99.6,
      latency: '8.4 ms',
      tokens: '3,840 t/s',
      resultSummary: 'Identified 3 unbounded async promise chains in edge ingress router. Recommended zero-copy WASM buffer pool, recovering 64% memory headroom.',
      points: [
        { label: 'Router Ingress', value: 92 },
        { label: 'Worker Queue', value: 74 },
        { label: 'DB Pool', value: 45 },
        { label: 'Edge Cache', value: 88 },
      ],
    },
    {
      title: 'Vision Telemetry',
      prompt: 'Synthesize real-time multi-spectral computer vision telemetry',
      confidence: 99.8,
      latency: '11.2 ms',
      tokens: '4,100 t/s',
      resultSummary: 'Spatial depth reconstruction complete. Segmented 142 discrete foreground dynamic entities with zero bounding box jitter at 120 FPS.',
      points: [
        { label: 'Depth Resolution', value: 98 },
        { label: 'Occlusion Match', value: 95 },
        { label: 'Tracking Stability', value: 99 },
        { label: 'Color Space', value: 91 },
      ],
    },
    {
      title: 'Edge Anomaly Vectors',
      prompt: 'Predict anomaly vectors across 10,000 distributed edge gateways',
      confidence: 98.9,
      latency: '14.1 ms',
      tokens: '5,200 t/s',
      resultSummary: 'Forecasting 99.2% cluster stability. Pre-empted memory leakage in 12 nodes by triggering automated rolling zero-downtime hot swap.',
      points: [
        { label: 'Cluster Health', value: 99 },
        { label: 'Traffic Anomaly', value: 12 },
        { label: 'Hot-swap Speed', value: 96 },
        { label: 'Sync Fidelity', value: 94 },
      ],
    },
  ];

  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [customPrompt, setCustomPrompt] = useState(presets[0].prompt);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(true);

  const currentPreset = presets[activePresetIndex];

  const steps = [
    'Initializing Neural Core v5.2...',
    'Ingesting multi-modal telemetry streams...',
    'Detecting latent topological patterns...',
    'Optimizing decision weights & verifying enclaves...',
    'Analysis Complete.',
  ];

  const handleRunAnalysis = (overridePrompt?: string) => {
    const promptToUse = overridePrompt || customPrompt;
    if (!promptToUse.trim() || isProcessing) return;

    setIsProcessing(true);
    setHasCompleted(false);
    setProcessingStep(0);

    let stepCounter = 0;
    const interval = setInterval(() => {
      stepCounter++;
      if (stepCounter < steps.length) {
        setProcessingStep(stepCounter);
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setHasCompleted(true);
      }
    }, 550);
  };

  const handleSelectPreset = (idx: number) => {
    setActivePresetIndex(idx);
    setCustomPrompt(presets[idx].prompt);
    handleRunAnalysis(presets[idx].prompt);
  };

  return (
    <section id="demo" style={{ padding: '90px 0', position: 'relative' }}>
      <div className="max-w-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="badge-pill badge-cyan" style={{ marginBottom: '14px' }}>
            <Activity size={14} /> LIVE REASONING SIMULATION
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', color: '#FFF', marginBottom: '16px' }}>
            See Intelligence <span className="text-gradient-cyan">in Motion.</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Interact with the simulated neural engine. Test multi-modal reasoning and examine real-time decision synthesis.
          </p>
        </div>

        {/* Product Sandbox Interface */}
        <div
          className="glass-panel"
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            border: '1px solid var(--border-active)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(6, 182, 212, 0.2)',
            overflow: 'hidden',
          }}
        >
          {/* Top Mock Window Title Bar */}
          <div
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'rgba(4, 8, 18, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginLeft: '10px' }}>
                aetheris-neural-terminal // session_id: #9024-QX
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="badge-pill" style={{ padding: '3px 8px', fontSize: '0.68rem', color: '#10B981' }}>
                ● REASONING CORE READY
              </span>
            </div>
          </div>

          <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Preset Selector Buttons */}
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '10px', fontWeight: 600 }}>
                Choose Execution Scenario
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {presets.map((p, idx) => (
                  <button
                    key={p.title}
                    onClick={() => handleSelectPreset(idx)}
                    disabled={isProcessing}
                    style={{
                      background: activePresetIndex === idx ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      border: activePresetIndex === idx ? '1px solid #06B6D4' : '1px solid var(--border-subtle)',
                      color: activePresetIndex === idx ? '#FFF' : 'var(--text-muted)',
                      borderRadius: '10px',
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Input & Execution Bar */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Enter custom analysis query..."
                className="input-field"
                style={{ flex: 1, minWidth: '260px' }}
                disabled={isProcessing}
              />
              <button
                onClick={() => handleRunAnalysis()}
                disabled={isProcessing}
                className="btn-cyan"
                style={{ padding: '12px 24px', fontSize: '0.95rem' }}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Play size={16} /> Analyze
                  </>
                )}
              </button>
            </div>

            {/* Processing State Stream */}
            {isProcessing && (
              <div
                style={{
                  background: 'rgba(4, 8, 18, 0.95)',
                  border: '1px solid var(--border-cyan)',
                  borderRadius: '14px',
                  padding: '20px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.84rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#38BDF8', marginBottom: '12px' }}>
                  <RefreshCw size={16} className="animate-spin" />
                  <strong>{steps[processingStep]}</strong>
                </div>

                <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${((processingStep + 1) / steps.length) * 100}%`,
                      background: 'linear-gradient(90deg, #06B6D4 0%, #6366F1 100%)',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Completed Results Display */}
            {hasCompleted && !isProcessing && (
              <div
                style={{
                  background: 'rgba(6, 11, 24, 0.85)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                {/* Result Top Metric Bar */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '12px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingBottom: '16px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      Confidence Index
                    </span>
                    <strong style={{ fontSize: '1.25rem', color: '#10B981', display: 'block' }}>
                      {currentPreset.confidence}%
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      Neural Latency
                    </span>
                    <strong style={{ fontSize: '1.25rem', color: '#38BDF8', display: 'block' }}>
                      {currentPreset.latency}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      Token Generation
                    </span>
                    <strong style={{ fontSize: '1.25rem', color: '#818CF8', display: 'block' }}>
                      {currentPreset.tokens}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      Status
                    </span>
                    <span className="badge-pill" style={{ color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.4)', marginTop: '2px' }}>
                      ✓ SYNTHESIZED
                    </span>
                  </div>
                </div>

                {/* Synthesis Output Summary */}
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: '#FFF', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="var(--accent-cyan)" /> AI Reasoning Output
                  </h4>
                  <p style={{ color: 'var(--text-high)', fontSize: '0.94rem', lineHeight: 1.6, margin: 0 }}>
                    {currentPreset.resultSummary}
                  </p>
                </div>

                {/* Subsystem Telemetry Chart Bars */}
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '10px', fontWeight: 600 }}>
                    Subsystem Feature Allocations
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    {currentPreset.points.map((pt, i) => (
                      <div
                        key={i}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          padding: '10px 14px',
                          borderRadius: '10px',
                        }}
                      >
                        <div className="flex-between" style={{ fontSize: '0.78rem', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>{pt.label}</span>
                          <strong style={{ color: '#FFF' }}>{pt.value}%</strong>
                        </div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pt.value}%`, background: 'var(--accent-cyan)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
