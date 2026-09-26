import React, { useState } from 'react';
import { Eye, Database, Cpu, Brain, Shield, Radio, Globe, BarChart2, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface NodeData {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  x: number; // percentage from center
  y: number;
  description: string;
  metrics: { label: string; value: string }[];
  capabilities: string[];
}

export const InteractiveNetworkGraph: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string>('intelligence');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const nodes: NodeData[] = [
    {
      id: 'vision',
      name: 'Vision',
      category: 'Perception',
      icon: <Eye size={20} />,
      color: '#06B6D4',
      x: 0,
      y: -150,
      description: 'Zero-latency spatial segmentation, object localization, and multi-spectral environment parsing at 120 FPS.',
      metrics: [
        { label: 'Latency', value: '4.2ms' },
        { label: 'Precision', value: '99.8%' },
      ],
      capabilities: ['Dynamic 3D Occlusion', 'Sub-pixel Edge Tracking', 'Facial & Gesture Synthesis'],
    },
    {
      id: 'data',
      name: 'Data',
      category: 'Ingestion',
      icon: <Database size={20} />,
      color: '#38BDF8',
      x: 120,
      y: -100,
      description: 'Distributed vector database ingestion processing 50M embeddings/second with lossless semantic indexing.',
      metrics: [
        { label: 'Throughput', value: '50M/s' },
        { label: 'Index Type', value: 'HNSW-Q' },
      ],
      capabilities: ['Adaptive Dimensionality', 'Zero-copy Pipeline', 'Streaming Quantization'],
    },
    {
      id: 'automation',
      name: 'Automation',
      category: 'Execution',
      icon: <Cpu size={20} />,
      color: '#818CF8',
      x: 160,
      y: 30,
      description: 'Autonomous multi-agent task execution and self-healing cloud infrastructure orchestration without human bottlenecks.',
      metrics: [
        { label: 'Autonomous Rate', value: '99.9%' },
        { label: 'Tasks/min', value: '180K' },
      ],
      capabilities: ['DAG Dependency Resolution', 'Fault Auto-remediation', 'Multi-Agent Consensus'],
    },
    {
      id: 'intelligence',
      name: 'Intelligence',
      category: 'Core Reasoning',
      icon: <Brain size={20} />,
      color: '#6366F1',
      x: 100,
      y: 130,
      description: 'Hybrid reasoning architecture blending dense neural transformers with discrete symbolic logic graphs for explainable AI.',
      metrics: [
        { label: 'Context Window', value: '2.5M Tokens' },
        { label: 'Reasoning Depth', value: '64-Hop' },
      ],
      capabilities: ['Chain-of-Logic Verification', 'Few-shot Generalization', 'Cognitive Reflection'],
    },
    {
      id: 'security',
      name: 'Security',
      category: 'Protection',
      icon: <Shield size={20} />,
      color: '#EC4899',
      x: 0,
      y: 160,
      description: 'Hardware-enforced confidential computing enclaves with homomorphic encryption ensuring inputs remain private even in memory.',
      metrics: [
        { label: 'Encryption', value: 'FHE 256-bit' },
        { label: 'Enclave Verify', value: 'Hardware-attested' },
      ],
      capabilities: ['Zero-Knowledge Proofs', 'Differential Privacy', 'Adversarial Defense'],
    },
    {
      id: 'iot',
      name: 'IoT',
      category: 'Edge Mesh',
      icon: <Radio size={20} />,
      color: '#F472B6',
      x: -110,
      y: 120,
      description: 'Micro-watt quantized models executing on microcontrollers and distributed edge nodes with microsecond sync.',
      metrics: [
        { label: 'Model Size', value: '450 KB' },
        { label: 'Power Draw', value: '1.2 mW' },
      ],
      capabilities: ['TinyML Quantization', 'P2P Mesh Gossip', 'Offline Local Inference'],
    },
    {
      id: 'web',
      name: 'Web',
      category: 'Interfaces',
      icon: <Globe size={20} />,
      color: '#10B981',
      x: -150,
      y: 20,
      description: 'Dynamic real-time generative UI engine that continuously synthesizes tailored digital interfaces matching user intent.',
      metrics: [
        { label: 'Render Target', value: 'WebGL/WASM' },
        { label: 'Frame Rate', value: '60 FPS' },
      ],
      capabilities: ['Component Auto-layout', 'Predictive Pre-render', 'Fluid Micro-interactions'],
    },
    {
      id: 'analytics',
      name: 'Analytics',
      category: 'Telemetry',
      icon: <BarChart2 size={20} />,
      color: '#F59E0B',
      x: -110,
      y: -100,
      description: 'Continuous latent anomaly discovery and predictive time-series forecasting across petabyte telemetry streams.',
      metrics: [
        { label: 'Prediction Horizon', value: '72 Hours' },
        { label: 'False Alarm Rate', value: '< 0.01%' },
      ],
      capabilities: ['Latent Manifold Tracking', 'Causal Root Cause Analysis', 'Drift Detection'],
    },
  ];

  const activeNode = nodes.find((n) => n.id === (hoveredNodeId || activeNodeId)) || nodes[3];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center' }}>
      {/* Visual Network Canvas */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          height: '460px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* SVG Connection Lines */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          viewBox="-260 -230 520 460"
        >
          {/* Subtle Ambient Orbit Rings */}
          <circle cx="0" cy="0" r="110" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="0" cy="0" r="160" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />

          {nodes.map((node) => {
            const isSelected = activeNode.id === node.id;
            return (
              <g key={node.id}>
                <line
                  x1="0"
                  y1="0"
                  x2={node.x}
                  y2={node.y}
                  stroke={isSelected ? node.color : 'rgba(255, 255, 255, 0.12)'}
                  strokeWidth={isSelected ? 2 : 1}
                  strokeDasharray={isSelected ? 'none' : '2 4'}
                  style={{ transition: 'all 0.3s ease' }}
                />
                {isSelected && (
                  <circle
                    cx={node.x * 0.5}
                    cy={node.y * 0.5}
                    r="3"
                    fill={node.color}
                    style={{ filter: `drop-shadow(0 0 6px ${node.color})` }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Central Core Node */}
        <div
          style={{
            position: 'absolute',
            width: '94px',
            height: '94px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #818CF8 0%, #312E81 70%, #030712 100%)',
            border: '2px solid rgba(129, 140, 248, 0.6)',
            boxShadow: '0 0 35px rgba(99, 102, 241, 0.5), inset 0 0 20px rgba(129, 140, 248, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            cursor: 'pointer',
          }}
          className="animate-pulse-glow"
        >
          <Sparkles size={20} color="#FFFFFF" />
          <span style={{ fontSize: '0.72rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#FFFFFF', letterSpacing: '0.08em', marginTop: '2px' }}>
            AI CORE
          </span>
        </div>

        {/* Orbiting Satellite Nodes */}
        {nodes.map((node) => {
          const isSelected = activeNode.id === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setActiveNodeId(node.id)}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              style={{
                position: 'absolute',
                transform: `translate(${node.x}px, ${node.y}px)`,
                width: isSelected ? '54px' : '44px',
                height: isSelected ? '54px' : '44px',
                borderRadius: '50%',
                background: isSelected ? 'rgba(10, 17, 40, 0.95)' : 'rgba(6, 11, 24, 0.85)',
                border: isSelected ? `2px solid ${node.color}` : '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: isSelected ? `0 0 25px ${node.color}66` : '0 4px 15px rgba(0,0,0,0.5)',
                color: isSelected ? node.color : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 20,
              }}
              title={node.name}
            >
              {node.icon}
            </button>
          );
        })}
      </div>

      {/* Intelligence Inspector Panel */}
      <div
        className="glass-panel"
        style={{
          padding: '36px',
          borderColor: `${activeNode.color}55`,
          background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.1) 0%, rgba(10, 17, 36, 0.85) 100%)',
          minHeight: '380px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: `${activeNode.color}22`,
                  border: `1px solid ${activeNode.color}55`,
                  color: activeNode.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {activeNode.icon}
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: activeNode.color, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                  {activeNode.category}
                </span>
                <h3 style={{ fontSize: '1.6rem', color: '#FFF', margin: 0 }}>
                  {activeNode.name} Subsystem
                </h3>
              </div>
            </div>
            <span className="badge-pill" style={{ borderColor: `${activeNode.color}44`, color: activeNode.color }}>
              ONLINE
            </span>
          </div>

          <p style={{ color: 'var(--text-high)', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '24px' }}>
            {activeNode.description}
          </p>

          {/* Subsystem Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
            {activeNode.metrics.map((m, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {m.label}
                </span>
                <strong style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: '#FFF' }}>
                  {m.value}
                </strong>
              </div>
            ))}
          </div>

          {/* Key Capabilities */}
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Autonomous Capabilities
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {activeNode.capabilities.map((cap, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.78rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    color: 'var(--text-high)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <CheckCircle2 size={12} color={activeNode.color} /> {cap}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Click or hover any node on the left to inspect neural submodules.
          </span>
        </div>
      </div>
    </div>
  );
};
