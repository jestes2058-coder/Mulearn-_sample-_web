import React, { useState } from 'react';
import {
  Cpu,
  Eye,
  Network,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  Activity,
  Sliders,
  Check,
} from 'lucide-react';

interface FeatureCardData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  interactivePreview: React.ReactNode;
}

export const FeaturesSection: React.FC = () => {
  const [activeFeatureId, setActiveFeatureId] = useState<string>('automation');

  // Interactive states for the mini-canvases
  const [automationSpeed, setAutomationSpeed] = useState(85);
  const [visionMode, setVisionMode] = useState<'3D' | 'Thermal' | 'Semantic'>('3D');
  const [predictiveConfidence, setPredictiveConfidence] = useState(98.4);
  const [securityLevel, setSecurityLevel] = useState('Enclave FHE');

  const features: FeatureCardData[] = [
    {
      id: 'automation',
      title: 'Intelligent Automation',
      subtitle: 'Turn repetitive workflows into self-orchestrating systems.',
      description: 'Autonomous agents eliminate human latency across code generation, data synthesis, and distributed infrastructure management.',
      icon: <Cpu size={24} />,
      color: '#6366F1',
      gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(10, 17, 36, 0.9) 100%)',
      interactivePreview: (
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px', width: '100%' }}>
          <div className="flex-between" style={{ fontSize: '0.78rem', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Workflow Throughput</span>
            <span style={{ color: '#818CF8', fontWeight: 700 }}>{automationSpeed * 120} ops/sec</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={automationSpeed}
            onChange={(e) => setAutomationSpeed(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#6366F1', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
            {['Parsing', 'Reasoning', 'Deploying'].map((st, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: '#818CF8',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                ● {st}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'vision',
      title: 'Computer Vision',
      subtitle: 'Understand images, objects, and environments.',
      description: 'Sub-pixel spatial localization, volumetric depth estimation, and instant multi-spectral segmentation running at 120 FPS.',
      icon: <Eye size={24} />,
      color: '#06B6D4',
      gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(10, 17, 36, 0.9) 100%)',
      interactivePreview: (
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px', width: '100%' }}>
          <div className="flex-between" style={{ fontSize: '0.78rem', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Perception Mode</span>
            <span style={{ color: '#38BDF8', fontWeight: 700 }}>{visionMode} Enabled</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['3D', 'Thermal', 'Semantic'] as const).map((m) => (
              <button
                key={m}
                onClick={(e) => {
                  e.stopPropagation();
                  setVisionMode(m);
                }}
                style={{
                  flex: 1,
                  background: visionMode === m ? 'rgba(6, 182, 212, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                  border: visionMode === m ? '1px solid #06B6D4' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: visionMode === m ? '#FFF' : 'var(--text-muted)',
                  borderRadius: '6px',
                  padding: '6px 0',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'connected',
      title: 'Connected Systems',
      subtitle: 'Connect devices, data, and people across edge meshes.',
      description: 'Ultra-low latency peer-to-peer state synchronization guaranteeing Byzantine consensus across 10,000+ edge gateways.',
      icon: <Network size={24} />,
      color: '#38BDF8',
      gradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(10, 17, 36, 0.9) 100%)',
      interactivePreview: (
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px', width: '100%' }}>
          <div className="flex-between" style={{ fontSize: '0.78rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Mesh Nodes Synced</span>
            <span style={{ color: '#38BDF8', fontWeight: 700 }}>4,820 Gateways</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '92%', background: 'linear-gradient(90deg, #38BDF8 0%, #6366F1 100%)' }} />
          </div>
        </div>
      ),
    },
    {
      id: 'predictive',
      title: 'Predictive Intelligence',
      subtitle: 'Transform raw data into forward-looking insights.',
      description: 'Latent manifold forecasting algorithms anticipate system shifts, hardware degradation, and user intents before they materialize.',
      icon: <TrendingUp size={24} />,
      color: '#10B981',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(10, 17, 36, 0.9) 100%)',
      interactivePreview: (
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px', width: '100%' }}>
          <div className="flex-between" style={{ fontSize: '0.78rem', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Accuracy Confidence</span>
            <span style={{ color: '#10B981', fontWeight: 700 }}>{predictiveConfidence}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '36px' }}>
            {[40, 65, 80, 55, 90, 85, 95, 100].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: i === 7 ? '#10B981' : 'rgba(16, 185, 129, 0.35)',
                  borderRadius: '3px',
                }}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'security',
      title: 'Secure by Design',
      subtitle: 'Zero-trust confidential computing from the silicon up.',
      description: 'Fully homomorphic encryption and hardware-attested enclaves ensure data remains ciphertext even during active matrix multiplication.',
      icon: <ShieldCheck size={24} />,
      color: '#EC4899',
      gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(10, 17, 36, 0.9) 100%)',
      interactivePreview: (
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px', width: '100%' }}>
          <div className="flex-between" style={{ fontSize: '0.78rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Hardware Attestation</span>
            <span style={{ color: '#EC4899', fontWeight: 700 }}>PASSED (FHE 256)</span>
          </div>
          <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
            ✓ Zero-Knowledge Proof #902-Verified
          </div>
        </div>
      ),
    },
    {
      id: 'adaptive',
      title: 'Adaptive Experiences',
      subtitle: 'Interfaces that evolve dynamically to user context.',
      description: 'Generative client-side UI synthesis builds tailored layouts, color palettes, and component bindings matching real-time user intent.',
      icon: <Sparkles size={24} />,
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(10, 17, 36, 0.9) 100%)',
      interactivePreview: (
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px', width: '100%' }}>
          <div className="flex-between" style={{ fontSize: '0.78rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Adaptive Layout</span>
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>Synthesized</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ height: '24px', flex: 2, background: 'rgba(245, 158, 11, 0.3)', borderRadius: '6px' }} />
            <div style={{ height: '24px', flex: 1, background: 'rgba(245, 158, 11, 0.15)', borderRadius: '6px' }} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="capabilities" style={{ padding: '90px 0', position: 'relative' }}>
      <div className="max-w-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="badge-pill badge-cyan" style={{ marginBottom: '14px' }}>
            <Activity size={14} /> SYSTEM CAPABILITIES
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', color: '#FFF', marginBottom: '16px' }}>
            Designed to <span className="text-gradient-aurora">Think Beyond.</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Architected to bridge the frontier between advanced AI models and mission-critical production software.
          </p>
        </div>

        {/* Feature Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
          }}
        >
          {features.map((feat) => {
            const isSelected = activeFeatureId === feat.id;
            return (
              <div
                key={feat.id}
                onClick={() => setActiveFeatureId(feat.id)}
                className="glass-panel glass-card-interactive"
                style={{
                  padding: '32px 28px',
                  background: isSelected ? feat.gradient : 'var(--bg-card)',
                  border: isSelected ? `2px solid ${feat.color}` : '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '24px',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: `${feat.color}20`,
                      border: `1px solid ${feat.color}50`,
                      color: feat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    {feat.icon}
                  </div>

                  <h3 style={{ fontSize: '1.45rem', color: '#FFF', marginBottom: '8px' }}>
                    {feat.title}
                  </h3>
                  <p style={{ color: 'var(--text-high)', fontSize: '0.94rem', fontWeight: 500, marginBottom: '8px' }}>
                    {feat.subtitle}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {feat.description}
                  </p>
                </div>

                {/* Interactive Dynamic Widget Preview */}
                <div>
                  {feat.interactivePreview}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
