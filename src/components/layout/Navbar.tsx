import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Menu,
  X,
  ArrowRight,
  Bell,
  Trophy,
  Users,
  BookOpen,
  Calendar,
  Layers,
  Shield,
  User,
  LogOut,
  Database,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenAuth: (defaultTab?: 'login' | 'student-register' | 'volunteer-register') => void;
  onOpenNotifications: () => void;
  onOpenSupabaseConfig: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onOpenAuth,
  onOpenNotifications,
  onOpenSupabaseConfig,
}) => {
  const {
    currentUser,
    logout,
    unreadNotificationCount,
    currentStudentStats,
    isSupabaseConnected,
  } = useApp();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: string) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDashboardViewForRole = () => {
    if (!currentUser) return 'student-dashboard';
    if (currentUser.role === 'STUDENT') return 'student-dashboard';
    if (currentUser.role === 'VOLUNTEER') return 'volunteer-dashboard';
    if (currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN') return 'admin-dashboard';
    if (currentUser.role === 'MODERATOR') return 'moderator-dashboard';
    return 'student-dashboard';
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? '12px 0' : '18px 0',
        background: scrolled ? 'rgba(3, 7, 18, 0.88)' : 'rgba(3, 7, 18, 0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="max-w-container" style={{ padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Brand Logo & Tag */}
          <div
            onClick={() => handleNavClick('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {/* STRIDE Official Logo Image with Glowing Frame & Zoomed In Logo */}
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)',
                padding: '2px',
                boxShadow: '0 0 22px rgba(6, 182, 212, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/stride-logo.jpg"
                  alt="STRIDE Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scale(1.45)',
                  }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>

            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.45rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                color: '#FFFFFF',
                lineHeight: 1,
              }}
            >
              STRIDE
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '28px',
            }}
            className="desktop-nav-links"
          >
            <button
              onClick={() => handleNavClick('home')}
              className={`nav-link-btn ${activeView === 'home' ? 'active' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className={`nav-link-btn ${activeView === 'how-it-works' ? 'active' : ''}`}
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('groups')}
              className={`nav-link-btn ${activeView === 'groups' ? 'active' : ''}`}
            >
              Groups & Capacity
            </button>
            <button
              onClick={() => handleNavClick('leaderboard')}
              className={`nav-link-btn ${activeView === 'leaderboard' ? 'active' : ''}`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => handleNavClick('rules')}
              className={`nav-link-btn ${activeView === 'rules' ? 'active' : ''}`}
            >
              Rules & Verification
            </button>
            <button
              onClick={() => handleNavClick('timeline')}
              className={`nav-link-btn ${activeView === 'timeline' ? 'active' : ''}`}
            >
              Timeline
            </button>
          </div>

          {/* Right Action Icons & Auth Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Supabase Status Pill */}
            <button
              onClick={onOpenSupabaseConfig}
              title="Supabase Database Configuration & Live Status"
              style={{
                background: isSupabaseConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                border: isSupabaseConnected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                color: isSupabaseConnected ? '#10B981' : 'var(--text-muted)',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                display: 'none',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
              className="supabase-btn-desktop"
            >
              <Database size={13} />
              <span>{isSupabaseConnected ? 'Live DB' : 'Local + Schema'}</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#FFF',
                borderRadius: '10px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
              className="hover-glow"
              title="Notifications"
            >
              <Bell size={18} />
              {unreadNotificationCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#EF4444',
                    color: '#FFF',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)',
                  }}
                >
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* User Session Dropdown or Login / Register CTA */}
            {currentUser ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.07)',
                    border: '1px solid var(--border-active)',
                    borderRadius: '10px',
                    padding: '6px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    color: '#FFF',
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                    }}
                  >
                    {currentUser.full_name.charAt(0)}
                  </div>

                  <div style={{ textAlign: 'left', display: 'none' }} className="user-label-desktop">
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.1 }}>
                      {currentUser.full_name.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                      {currentUser.role}
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '240px',
                      background: '#0B1220',
                      border: '1px solid var(--border-active)',
                      borderRadius: '12px',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.8)',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      zIndex: 100,
                    }}
                  >
                    <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFF' }}>
                        {currentUser.full_name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {currentUser.registration_id}
                      </div>
                      {currentUser.role === 'STUDENT' && (
                        <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                          Verified Karma: {currentStudentStats.verifiedKarma}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleNavClick(getDashboardViewForRole())}
                      className="dropdown-item"
                    >
                      <Layers size={15} color="var(--accent-cyan)" /> My Dashboard
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="dropdown-item"
                      style={{ color: '#EF4444' }}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('student-register')}
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.84rem' }}
                >
                  Join STRIDE <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#FFF',
                borderRadius: '10px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              className="mobile-toggle-btn"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Flyout Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'rgba(3, 7, 18, 0.98)',
            borderBottom: '1px solid var(--border-active)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <button onClick={() => handleNavClick('home')} className="nav-mobile-btn">
            Home
          </button>
          <button onClick={() => handleNavClick('how-it-works')} className="nav-mobile-btn">
            How It Works
          </button>
          <button onClick={() => handleNavClick('groups')} className="nav-mobile-btn">
            Groups & Capacity Tracker
          </button>
          <button onClick={() => handleNavClick('leaderboard')} className="nav-mobile-btn">
            Leaderboard
          </button>
          <button onClick={() => handleNavClick('rules')} className="nav-mobile-btn">
            Rules & Two-Stage Verification
          </button>
          <button onClick={() => handleNavClick('timeline')} className="nav-mobile-btn">
            Event Timeline
          </button>

          {currentUser ? (
            <button
              onClick={() => handleNavClick(getDashboardViewForRole())}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
            >
              Open Dashboard
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <button
                onClick={() => {
                  onOpenAuth('student-register');
                  setMobileMenuOpen(false);
                }}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Register as Student
              </button>
              <button
                onClick={() => {
                  onOpenAuth('volunteer-register');
                  setMobileMenuOpen(false);
                }}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Register as Volunteer
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        .nav-link-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-family: var(--font-body);
          font-size: 0.92rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 6px 0;
          position: relative;
        }
        .nav-link-btn:hover, .nav-link-btn.active {
          color: var(--text-pure);
        }
        .nav-link-btn.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #06B6D4, #6366F1);
          border-radius: 2px;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          background: none;
          border: none;
          color: var(--text-high);
          font-size: 0.84rem;
          cursor: pointer;
          border-radius: 6px;
          width: 100%;
          text-align: left;
          transition: background 0.15s ease;
        }
        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .nav-mobile-btn {
          background: none;
          border: none;
          color: var(--text-high);
          font-size: 1.05rem;
          font-weight: 600;
          text-align: left;
          padding: 8px 0;
          cursor: pointer;
        }
        @media (min-width: 1024px) {
          .desktop-nav-links { display: flex !important; }
          .supabase-btn-desktop { display: flex !important; }
          .user-label-desktop { display: block !important; }
          .mobile-toggle-btn { display: none !important; }
        }
      `}</style>
    </nav>
  );
};
