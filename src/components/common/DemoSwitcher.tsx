import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Users, RotateCcw, Database, ShieldCheck, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface DemoSwitcherProps {
  onOpenSupabaseModal: () => void;
}

export const DemoSwitcher: React.FC<DemoSwitcherProps> = ({ onOpenSupabaseModal }) => {
  const { currentUser, quickSwitchUser, resetDemoData, isSupabaseConnected } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  const demoAccounts: {
    label: string;
    role: UserRole | 'GUEST';
    userId?: string;
    description: string;
    badgeColor: string;
  }[] = [
    {
      label: '🎓 Rahul Nair (Qualified Student)',
      role: 'STUDENT',
      userId: 'usr-stud-1',
      description: '3,450 Verified Karma • Group Alpha • Rank #1',
      badgeColor: '#10B981',
    },
    {
      label: '🧑‍💻 Ananya Sharma (In-Progress Student)',
      role: 'STUDENT',
      userId: 'usr-stud-2',
      description: '2,650 Karma (88% to Qualify) • Group Alpha',
      badgeColor: '#38BDF8',
    },
    {
      label: '🤝 Alex Mathew (Volunteer)',
      role: 'VOLUNTEER',
      userId: 'usr-vol-1',
      description: 'Assigned: Group Alpha & Beta • Review Queue',
      badgeColor: '#3B82F6',
    },
    {
      label: '🛡️ Kiran Das (Moderator)',
      role: 'MODERATOR',
      userId: 'usr-mod-1',
      description: 'Submission flags • Moderator notes',
      badgeColor: '#A855F7',
    },
    {
      label: '⚙️ Sneha Varghese (Admin)',
      role: 'ADMIN',
      userId: 'usr-admin-1',
      description: 'Stage 2 Reviews • Groups • User manager',
      badgeColor: '#F97316',
    },
    {
      label: '👑 Johnathan Archer (Super Admin)',
      role: 'SUPER_ADMIN',
      userId: 'usr-superadmin-1',
      description: 'Full Control • Event Lifecycle • Audit Logs',
      badgeColor: '#EF4444',
    },
    {
      label: '🌐 Guest / Visitor View',
      role: 'GUEST',
      description: 'Public Landing Page & Registrations',
      badgeColor: '#9C988D',
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 900,
        maxWidth: '420px',
        width: 'calc(100vw - 32px)',
      }}
    >
      <div
        className="glass-panel"
        style={{
          border: '1px solid var(--border-active)',
          background: 'rgba(10, 16, 26, 0.95)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
        }}
      >
        {/* Toggle Header Bar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            cursor: 'pointer',
            background: 'rgba(51, 104, 160, 0.15)',
            borderBottom: isExpanded ? '1px solid var(--border-subtle)' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--accent-gold)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--warm-white)' }}>
              Interactive Demo Role Switcher
            </span>
            {currentUser && (
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'var(--primary-blue)',
                  color: '#FFF',
                  fontWeight: 600,
                }}
              >
                {currentUser.role}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </div>
        </div>

        {/* Expanded Role Selector */}
        {isExpanded && (
          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--warm-white-dim)', lineHeight: 1.4 }}>
              Click any persona below to instantly test all features, 2-stage verification workflows, and dashboards:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {demoAccounts.map((acc) => {
                const isSelected =
                  acc.role === 'GUEST'
                    ? !currentUser
                    : currentUser?.id === acc.userId;

                return (
                  <button
                    key={acc.label}
                    onClick={() => {
                      quickSwitchUser(acc.role, acc.userId);
                      setIsExpanded(false);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: isSelected ? `1px solid ${acc.badgeColor}` : '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(51, 104, 160, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                      color: 'var(--warm-white)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      width: '100%',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                        {acc.label}
                      </span>
                      {isSelected && (
                        <span style={{ fontSize: '0.68rem', color: acc.badgeColor, fontWeight: 700 }}>
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--warm-white-dim)', marginTop: '2px' }}>
                      {acc.description}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Action Utilities */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
              <button
                onClick={onOpenSupabaseModal}
                className="btn-secondary"
                style={{ flex: 1, padding: '6px 10px', fontSize: '0.75rem', gap: '4px' }}
                title="Supabase Database Settings & SQL Schema"
              >
                <Database size={13} color={isSupabaseConnected ? '#10B981' : '#F59E0B'} />
                {isSupabaseConnected ? 'Supabase: Connected' : 'Supabase Setup'}
              </button>

              <button
                onClick={() => {
                  if (confirm('Reset all demo data back to default state?')) {
                    resetDemoData();
                  }
                }}
                className="btn-secondary"
                style={{ padding: '6px 10px', fontSize: '0.75rem', gap: '4px', color: '#F87171' }}
                title="Reset local data"
              >
                <RotateCcw size={13} />
                Reset Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
