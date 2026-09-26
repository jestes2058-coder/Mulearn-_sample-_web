import React, { useState } from 'react';
import { X, Sparkles, Terminal, Play, Cpu, Layers, Shield, Check, Copy, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudioModal: React.FC<StudioModalProps> = ({ isOpen, onClose }) => {
  const [pipelineName, setPipelineName] = useState('Production Vision Mesh');
  const [modelType, setModelType] = useState('aetheris-dense-v5');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedEndpoint, setDeployedEndpoint] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    setDeployedEndpoint(null);

    setTimeout(() => {
      setIsDeploying(false);
      const randomId = Math.random().toString(36).substring(2, 9);
      setDeployedEndpoint(`https://api.aetheris.ai/v5/mesh/${randomId}/infer`);
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    }, 900);
  };

  const handleCopy = () => {
    if (deployedEndpoint) {
      navigator.clipboard.writeText(deployedEndpoint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Terminal size={20} color="#FFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', color: '#FFF', margin: 0 }}>
                AETHERIS Studio
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Autonomous Pipeline Architect & Inference Deployment
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
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

        {/* Deploy Form */}
        <form onSubmit={handleDeploy} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Pipeline Title
            </label>
            <input
              type="text"
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Foundation Kernel
              </label>
              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
                className="input-field"
              >
                <option value="aetheris-dense-v5">AETHERIS Dense v5.2 (128B MoE)</option>
                <option value="aetheris-spatial-3d">AETHERIS Spatial Vision 3D</option>
                <option value="aetheris-edge-tiny">AETHERIS Micro-Edge (450KB Quant)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Hardware Enclave
              </label>
              <select className="input-field">
                <option>FHE 256-bit Confidential Enclave</option>
                <option>Zero-Trust Byzantine Mesh</option>
                <option>Hardware-Attested SGX/SEV</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isDeploying}
            className="btn-cyan"
            style={{ width: '100%', padding: '14px', marginTop: '6px' }}
          >
            {isDeploying ? 'Synthesizing Pipeline...' : 'Deploy Autonomous Ingress Mesh'}
          </button>
        </form>

        {/* Generated Endpoint Result */}
        {deployedEndpoint && (
          <div
            style={{
              marginTop: '24px',
              padding: '20px',
              borderRadius: '16px',
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
            }}
          >
            <div className="flex-between" style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={14} /> LIVE INGRESS ENDPOINT DEPLOYED
              </span>
              <button
                onClick={handleCopy}
                className="btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '4px' }}
              >
                {copied ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#38BDF8', wordBreak: 'break-all' }}>
              {deployedEndpoint}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
