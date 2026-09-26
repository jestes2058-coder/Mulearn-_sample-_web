import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCheck, Bell, Award, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  if (!isOpen) return null;

  const userNotifs = currentUser
    ? notifications.filter((n) => n.user_id === currentUser.id)
    : [];

  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Award size={18} color="#F59E0B" />;
      case 'success':
        return <CheckCircle2 size={18} color="#10B981" />;
      case 'error':
        return <AlertCircle size={18} color="#EF4444" />;
      case 'announcement':
        return <Sparkles size={18} color="#A855F7" />;
      default:
        return <Info size={18} color="#38BDF8" />;
    }
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="glass-panel-glow"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          bottom: '20px',
          width: '100%',
          maxWidth: '440px',
          background: 'var(--bg-card-solid)',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '20px',
          overflow: 'hidden',
          animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(51, 104, 160, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell size={18} color="#FFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Notifications</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--warm-white-dim)', margin: 0 }}>
                {userNotifs.filter((n) => !n.read).length} unread updates
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {userNotifs.some((n) => !n.read) && (
              <button
                onClick={markAllNotificationsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-blue-light)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600,
                }}
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
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
        </div>

        {/* Notifications List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {userNotifs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--warm-white-dim)' }}>
              <Bell size={42} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--warm-white)' }}>You're all caught up!</p>
              <p style={{ fontSize: '0.85rem' }}>No recent notifications for your account.</p>
            </div>
          ) : (
            userNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                style={{
                  background: notif.read ? 'rgba(255, 255, 255, 0.02)' : 'rgba(51, 104, 160, 0.12)',
                  border: notif.read ? '1px solid var(--border-subtle)' : '1px solid var(--primary-blue-light)',
                  borderRadius: '12px',
                  padding: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                {!notif.read && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--accent-cyan)',
                      boxShadow: '0 0 8px var(--accent-cyan)',
                    }}
                  />
                )}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ marginTop: '2px' }}>{getIcon(notif.type)}</div>
                  <div style={{ flex: 1, paddingRight: '12px' }}>
                    <h4 style={{ fontSize: '0.92rem', marginBottom: '4px', fontWeight: 600, color: notif.read ? 'var(--warm-white)' : '#FFF' }}>
                      {notif.title}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--warm-white-subtle)', lineHeight: 1.4, marginBottom: '6px' }}>
                      {notif.message}
                    </p>
                    <span style={{ fontSize: '0.72rem', color: 'var(--warm-white-dim)', fontFamily: 'var(--font-mono)' }}>
                      {formatTime(notif.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
