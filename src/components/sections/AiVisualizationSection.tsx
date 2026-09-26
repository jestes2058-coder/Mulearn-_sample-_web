import React from 'react';
import { InteractiveNetworkGraph } from '../canvas/InteractiveNetworkGraph';
import { Network, Sparkles } from 'lucide-react';

export const AiVisualizationSection: React.FC = () => {
  return (
    <section id="features" style={{ padding: '90px 0', position: 'relative' }}>
      <div className="max-w-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="badge-pill badge-indigo" style={{ marginBottom: '14px' }}>
            <Network size={14} /> NEURAL TOPOLOGY
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', color: '#FFF', marginBottom: '16px' }}>
            One Intelligence. <span className="text-gradient-cyan">Infinite Possibilities.</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            A unified cognitive core orchestrating perception, automated execution, decentralized data streams, and cryptographic security.
          </p>
        </div>

        {/* Interactive Neural Network Graph */}
        <InteractiveNetworkGraph />
      </div>
    </section>
  );
};
