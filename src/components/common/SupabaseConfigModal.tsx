import React, { useState } from 'react';
import { getSupabaseConfig, setCustomSupabaseConfig, clearCustomSupabaseConfig, SUPABASE_SQL_SCHEMA } from '../../services/supabase';
import { X, Database, Copy, Check, ExternalLink, ShieldCheck, Key, RefreshCw } from 'lucide-react';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomSupabaseConfig(url, anonKey);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      window.location.reload();
    }, 800);
  };

  const handleClear = () => {
    clearCustomSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1300 }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', width: '94vw' }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(51, 104, 160, 0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: currentConfig.isConfigured ? 'rgba(16, 185, 129, 0.2)' : 'rgba(51, 104, 160, 0.3)',
                border: currentConfig.isConfigured ? '1px solid #10B981' : '1px solid var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Database size={20} color={currentConfig.isConfigured ? '#10B981' : 'var(--primary-blue-light)'} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Supabase Backend & Security</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--warm-white-dim)', margin: 0 }}>
                Status: {currentConfig.isConfigured ? '🟢 Connected to Live Project' : '⚡ Running on Interactive High-Speed Mock Engine'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: 'var(--warm-white)',
              cursor: 'pointer',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Info Card */}
          <div
            style={{
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            <ShieldCheck size={20} color="#38BDF8" style={{ marginTop: '2px', flexShrink: 0 }} />
            <p style={{ fontSize: '0.84rem', color: 'var(--warm-white)', lineHeight: 1.5, margin: 0 }}>
              STRIDE features a dual-mode engine: it runs immediately out of the box with realistic state, 2-stage verification workflows, and full persistence. You can also link your live Supabase project below to sync to real PostgreSQL tables and RLS policies!
            </p>
          </div>

          {/* Connect Form */}
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Supabase Project URL
              </label>
              <input
                type="url"
                placeholder="https://your-project-id.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Supabase Anon / Public Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="input-field"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }}>
                {saveSuccess ? (
                  <>
                    <Check size={16} /> Saved! Reloading...
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} /> Save & Connect
                  </>
                )}
              </button>
              {currentConfig.isConfigured && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="btn-secondary"
                  style={{ color: '#F87171' }}
                >
                  Disconnect
                </button>
              )}
            </div>
          </form>

          {/* Ready-to-Run Supabase SQL Script Card */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 700 }}>
                  Ready-to-Run PostgreSQL SQL Schema
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--warm-white-dim)', margin: 0 }}>
                  Includes all 12 tables, RLS security policies, duplicate prevention index, and seeds.
                </p>
              </div>

              <button
                onClick={handleCopySchema}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.75rem', gap: '6px' }}
              >
                {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                {copied ? 'Copied SQL!' : 'Copy SQL'}
              </button>
            </div>

            <pre
              style={{
                background: 'rgba(4, 7, 12, 0.9)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: '#38BDF8',
                maxHeight: '160px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
              }}
            >
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
