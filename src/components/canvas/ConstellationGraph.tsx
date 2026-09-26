import React, { useState } from 'react';
import { Cpu, Code, Layers, Shield, Terminal, Zap, Sparkles, X, ChevronRight, Activity } from 'lucide-react';

interface TechNode {
  id: string;
  name: string;
  category: string;
  level: string;
  specs: string;
  icon: React.ReactNode;
  color: string;
}

export const ConstellationGraph: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<TechNode | null>(null);

  const technologies: TechNode[] = [
    {
      id: 'ai-core',
      name: 'Neural Transformers',
      category: 'Foundation',
      level: 'v5.2 Mixture-of-Experts',
      specs: '128B sparse active parameters with sub-linear attention scaling.',
      icon: <Cpu size={22} />,
      color: '#6366F1',
    },
    {
      id: 'vision',
      name: 'Spatial Vision Engine',
      category: 'Perception',
      level: 'Multi-spectral 3D',
      specs: 'Volumetric depth estimation and real-time semantic point-cloud rasterization.',
      icon: <Activity size={22} />,
      color: '#06B6D4',
    },
    {
      id: 'edge',
      name: 'Distributed Edge Mesh',
      category: 'Infrastructure',
      level: 'P2P Gossip Ring',
      specs: 'Sub-5ms Byzantine fault-tolerant state replication across 10,000+ edge gateways.',
      icon: <Layers size={22} />,
      color: '#38BDF8',
    },
    {
      id: 'wasm',
      name: 'WASM & Rust Runtime',
      category: 'Execution',
      level: 'SIMD-Accelerated',
      specs: 'Deterministic sandboxed micro-containers compiling neural kernels at native speed.',
      icon: <Terminal size={22} />,
      color: '#EC4899',
    },
    {
      id: 'crypto',
      name: 'Zero-Knowledge Enclaves',
      category: 'Security',
      level: 'FHE & zk-SNARKs',
      specs: 'Verifiable multi-party inference guaranteeing mathematical privacy across pipelines.',
      icon: <Shield size={22} />,
      color: '#8B5CF6',
    },
    {
      id: 'vectors',
      name: 'Vector Memory Mesh',
      category: 'Storage',
      level: 'Hierarchical HNSW',
      specs: 'Real-time embedding recall operating with 10M+ queries/sec under 2ms P99.',
      icon: <Code size={22} />,
      color: '#10B981',
    },
  ];

  return (
    <div style={{ position: 'relative' }}>
      {/* Constellation Grid of Interactive Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {technologies.map((tech) => {
          const isSelected = selectedTech?.id === tech.id;
          return (
            <div
              key={tech.id}
              onClick={() => setSelectedTech(tech)}
              className="glass-panel glass-card-interactive"
              style={{
                padding: '28px 24px',
                border: isSelected ? `2px solid ${tech.color}` : '1px solid var(--border-subtle)',
                background: isSelected ? 'rgba(15, 25, 54, 0.95)' : 'var(--bg-card)',
                boxShadow: isSelected ? `0 0 30px ${tech.color}44` : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: `${tech.color}18`,
                    border: `1px solid ${tech.color}44`,
                    color: tech.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {tech.icon}
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: tech.color,
                    background: `${tech.color}15`,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontWeight: 700,
                  }}
                >
                  {tech.category}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '6px' }}>
                {tech.name}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '16px' }}>
                {tech.specs}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                  {tech.level}
                </span>
                <span style={{ fontSize: '0.8rem', color: tech.color, display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  Inspect <ChevronRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Inspection Modal / Drawer */}
      {selectedTech && (
        <div className="modal-overlay" onClick={() => setSelectedTech(null)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()} style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: `${selectedTech.color}22`,
                    border: `1px solid ${selectedTech.color}66`,
                    color: selectedTech.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selectedTech.icon}
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: selectedTech.color, textTransform: 'uppercase', fontWeight: 700 }}>
                    {selectedTech.category} Architecture
                  </span>
                  <h3 style={{ fontSize: '1.6rem', color: '#FFF', margin: 0 }}>
                    {selectedTech.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedTech(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: 'var(--text-pure)',
                  cursor: 'pointer',
                  borderRadius: '10px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ color: 'var(--text-high)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
              {selectedTech.specs} Built with custom zero-copy IPC channels, hardware tensor acceleration, and end-to-end memory isolation.
            </p>

            <div
              style={{
                background: 'rgba(4, 8, 18, 0.9)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: '#38BDF8',
                marginBottom: '24px',
              }}
            >
              <div>// Neural Compilation Pipeline</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                Kernel: <span style={{ color: '#F472B6' }}>aetheris_core_v5_quantized</span>
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                Compilation Target: <span style={{ color: '#10B981' }}>CUDA / Metal / WASM-SIMD</span>
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                Latency Vector: <span style={{ color: '#F59E0B' }}>0.012ms ± 0.003ms</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTech(null)}
              className="btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              Done Inspecting
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
