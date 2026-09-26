import React from 'react';
import { ConstellationGraph } from '../canvas/ConstellationGraph';
import { Layers, Sparkles } from 'lucide-react';

export const TechnologySection: React.FC = () => {
  return (
    <section id="technology" style={{ padding: '90px 0', position: 'relative' }}>
      <div className="max-w-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="badge-pill badge-indigo" style={{ marginBottom: '14px' }}>
            <Layers size={14} /> FOUNDATIONAL ARCHITECTURE
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', color: '#FFF', marginBottom: '16px' }}>
            Built on <span className="text-gradient-aurora">Modern Intelligence.</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Engineered with sparse Mixture-of-Experts transformers, zero-copy WASM runtimes, and confidential hardware enclaves.
          </p>
        </div>

        {/* Interactive Constellation Graph */}
        <ConstellationGraph />
      </div>
    </section>
  );
};
