import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

interface CountdownTimerProps {
  compact?: boolean;
  showStatusBadge?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  compact = false,
  showStatusBadge = true,
}) => {
  const { countdown, eventPhase } = useApp();

  const getStatusBadge = () => {
    switch (eventPhase) {
      case 'BEFORE_REGISTRATION':
        return (
          <div className="badge badge-pending">
            <Clock size={14} /> REGISTRATION OPENS SOON
          </div>
        );
      case 'REGISTRATION_OPEN':
        return (
          <div className="badge badge-verified animate-pulse-glow">
            <Zap size={14} /> REGISTRATION IS OPEN
          </div>
        );
      case 'BEFORE_EVENT':
        return (
          <div className="badge badge-volunteer">
            <Clock size={14} /> STRIDE BEGINS IN
          </div>
        );
      case 'EVENT_LIVE':
        return (
          <div className="badge badge-verified" style={{ background: 'rgba(16, 185, 129, 0.25)', borderColor: '#10B981' }}>
            <Zap size={14} className="animate-spin" /> STRIDE IS LIVE
          </div>
        );
      case 'COMPLETED':
        return (
          <div className="badge badge-gold">
            <CheckCircle2 size={14} /> STRIDE 2027 — COMPLETED
          </div>
        );
      default:
        return (
          <div className="badge badge-pending">
            <AlertCircle size={14} /> REGISTRATION CLOSED
          </div>
        );
    }
  };

  const format2 = (n: number) => String(Math.max(0, n)).padStart(2, '0');

  if (compact) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', flexWrap: 'nowrap' }}>
        {showStatusBadge && getStatusBadge()}
        {eventPhase !== 'COMPLETED' && (
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-pure)', whiteSpace: 'nowrap' }}>
            {format2(countdown.days)}d : {format2(countdown.hours)}h : {format2(countdown.minutes)}m : {format2(countdown.seconds)}s
          </span>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%' }}>
      {showStatusBadge && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {getStatusBadge()}
        </div>
      )}

      {eventPhase === 'COMPLETED' ? (
        <div className="glass-panel" style={{ padding: '20px 32px', textAlign: 'center', borderColor: 'var(--accent-amber)' }}>
          <h3 style={{ color: 'var(--accent-amber)', fontSize: '1.3rem', marginBottom: '6px' }}>
            STRIDE 2027 — COMPLETED
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
            Congratulations to all participants, top qualifiers, and volunteers!
          </p>
        </div>
      ) : (
        <div
          className="countdown-row"
          data-tilt="true"
          data-tilt-intensity="high"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'nowrap',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          {/* Days */}
          <div
            className="countdown-segment"
            data-tilt="true"
            data-tilt-intensity="high"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '12px 16px',
              minWidth: '68px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-pure)',
                lineHeight: 1,
              }}
            >
              {format2(countdown.days)}
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
                marginTop: '4px',
              }}
            >
              Days
            </span>
          </div>

          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--text-dim)',
              userSelect: 'none',
              paddingBottom: '12px',
            }}
          >
            :
          </span>

          {/* Hours */}
          <div
            className="countdown-segment"
            data-tilt="true"
            data-tilt-intensity="high"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '12px 16px',
              minWidth: '68px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-pure)',
                lineHeight: 1,
              }}
            >
              {format2(countdown.hours)}
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
                marginTop: '4px',
              }}
            >
              Hours
            </span>
          </div>

          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--text-dim)',
              userSelect: 'none',
              paddingBottom: '12px',
            }}
          >
            :
          </span>

          {/* Minutes */}
          <div
            className="countdown-segment"
            data-tilt="true"
            data-tilt-intensity="high"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '12px 16px',
              minWidth: '68px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-pure)',
                lineHeight: 1,
              }}
            >
              {format2(countdown.minutes)}
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
                marginTop: '4px',
              }}
            >
              Minutes
            </span>
          </div>

          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--accent-cyan)',
              userSelect: 'none',
              paddingBottom: '12px',
            }}
          >
            :
          </span>

          {/* Seconds */}
          <div
            className="countdown-segment"
            data-tilt="true"
            data-tilt-intensity="high"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              borderRadius: '14px',
              padding: '12px 16px',
              minWidth: '68px',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.25)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--accent-cyan)',
                lineHeight: 1,
              }}
            >
              {format2(countdown.seconds)}
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                color: 'var(--accent-cyan)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
                marginTop: '4px',
              }}
            >
              Seconds
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
