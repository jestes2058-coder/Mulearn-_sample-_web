import React, { useState } from 'react';
import { Compass, Code, Network, Brain, Sparkles, ChevronRight, Check } from 'lucide-react';

interface Stage {
  number: string;
  name: string;
  headline: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  diagramDetails: string[];
}

export const StorySection: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const stages: Stage[] = [
    {
      number: '01',
      name: 'Discover',
      headline: 'Uncovering Hidden Latent Dimensions',
      description: 'Ingest unorganized data streams, documents, vision telemetry, and unstructured signals into unified high-dimensional vector embeddings.',
      icon: <Compass size={24} />,
      color: '#06B6D4',
      diagramDetails: ['50M Vectors/sec Ingestion', 'Semantic Clustering', 'Dimensionality Auto-reduction'],
    },
    {
      number: '02',
      name: 'Build',
      headline: 'Constructing Autonomous Neural Graph',
      description: 'Synthesize custom neural modules and multi-agent DAG pipelines tailored to execute your domain tasks with mathematical guarantees.',
      icon: <Code size={24} />,
      color: '#6366F1',
      diagramDetails: ['Mixture-of-Experts Graph', 'Zero-copy WASM Compilation', 'Hardware Tensor Tuning'],
    },
    {
      number: '03',
      name: 'Connect',
      headline: 'Seamless Multi-Cloud & Edge Ingress',
      description: 'Deploy instantly across web, mobile, IoT gateways, and private on-premise clusters with sub-5ms peer-to-peer sync.',
      icon: <Network size={24} />,
      color: '#38BDF8',
      diagramDetails: ['P2P Mesh Gossip Ring', 'Real-time WebSocket/gRPC Streams', 'Multi-region Fault Tolerance'],
    },
    {
      number: '04',
      name: 'Learn',
      headline: 'Continuous Cognitive Reinforcement',
      description: 'Feedback loops continuously refine decision boundaries through direct preference optimization (DPO) and real-time reflection.',
      icon: <Brain size={24} />,
      color: '#EC4899',
      diagramDetails: ['Active Reflection Memory', 'Few-shot Dynamic Cache', 'Drift Auto-compensation'],
    },
    {
      number: '05',
      name: 'Evolve',
      headline: 'Self-Optimizing Digital Intelligence',
      description: 'The system achieves self-sustaining autonomy—optimizing its own resource consumption, latency profiles, and predictive accuracy.',
      icon: <Sparkles size={24} />,
      color: '#10B981',
      diagramDetails: ['Autonomous Model Shrinking', 'Zero-downtime Kernel Swap', 'Infinite Scale Elasticity'],
    },
  ];

  const activeStage = stages[activeStageIndex];

  return (
    <section style={{ padding: '90px 0', position: 'relative' }}>
      <div className="max-w-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="badge-pill badge-indigo" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} /> THE EVOLUTION LIFECYCLE
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', color: '#FFF', marginBottom: '16px' }}>
            From Idea → <span className="text-gradient-cyan">Intelligence</span> → Impact
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Navigate the continuous lifecycle from raw conceptual ideation to self-healing autonomous systems.
          </p>
        </div>

        {/* Stage Navigation Pills */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '40px',
            flexWrap: 'wrap',
          }}
        >
          {stages.map((stage, idx) => {
            const isSelected = activeStageIndex === idx;
            return (
              <button
                key={stage.number}
                onClick={() => setActiveStageIndex(idx)}
                style={{
                  background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? `2px solid ${stage.color}` : '1px solid var(--border-subtle)',
                  color: isSelected ? '#FFF' : 'var(--text-muted)',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.25s ease',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: stage.color }}>
                  {stage.number}
                </span>
                <span>{stage.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Interactive Stage Viewer Card */}
        <div
          className="glass-panel"
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            padding: '48px',
            borderColor: `${activeStage.color}55`,
            background: `radial-gradient(circle at top right, ${activeStage.color}15 0%, rgba(6, 11, 24, 0.95) 100%)`,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          {/* Left: Stage Information */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: `${activeStage.color}22`,
                  border: `1px solid ${activeStage.color}55`,
                  color: activeStage.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {activeStage.icon}
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: activeStage.color,
                }}
              >
                {activeStage.number}
              </span>
            </div>

            <h3 style={{ fontSize: '1.8rem', color: '#FFF', marginBottom: '12px' }}>
              {activeStage.headline}
            </h3>

            <p style={{ color: 'var(--text-high)', fontSize: '1.02rem', lineHeight: 1.6, marginBottom: '24px' }}>
              {activeStage.description}
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setActiveStageIndex((prev) => (prev + 1) % stages.length)}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.88rem' }}
              >
                Next Evolution Stage <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Right: Interactive Architectural Diagram Preview */}
          <div
            style={{
              background: 'rgba(4, 8, 18, 0.9)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div className="flex-between">
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: activeStage.color, fontWeight: 700 }}>
                STAGE // {activeStage.name.toUpperCase()} KERNEL
              </span>
              <span className="badge-pill" style={{ color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                ACTIVE PROCESS
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeStage.diagramDetails.map((detail, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: `${activeStage.color}22`,
                      color: activeStage.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </div>
                  <span style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 500 }}>
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
