import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CountdownTimer } from '../common/CountdownTimer';
import { HeroAiCore3D } from '../canvas/HeroAiCore3D';
import {
  Sparkles,
  Trophy,
  Zap,
  ShieldCheck,
  Users,
  Compass,
  CheckCircle2,
  ArrowRight,
  Clock,
  Layers,
  Award,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Flame,
  Star,
  BookOpen,
  Code2,
  Target,
  ExternalLink,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (defaultTab?: 'login' | 'student-register' | 'volunteer-register') => void;
  setActiveView: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, setActiveView }) => {
  const { leaderboard, groupRankings, topStudent, topVolunteer, eventSettings, isRegistrationOpen } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'What is STRIDE?',
      a: 'STRIDE is a 12-day practical skill-development challenge and event management platform exclusively designed for first-year engineering and tech students, powered by the μLearn community and μJourney quests.',
    },
    {
      q: 'How do I qualify for the STRIDE Certificate?',
      a: 'A student must achieve at least 3,000 VERIFIED KARMA by completing μJourney tasks and getting their proofs approved through the two-stage volunteer and admin verification workflow.',
    },
    {
      q: 'How is the Top Student determined?',
      a: 'The Top Student is determined by the highest total VERIFIED KARMA. In the event of a tie, the tie-breaker is awarded to the student who achieved that Karma score earliest.',
    },
    {
      q: 'Can I change my group after registration?',
      a: 'No. Once group selection is confirmed during registration, it is permanently locked to maintain fair group performance tracking and volunteer mentorship allocations.',
    },
    {
      q: 'What happens if a task submission is rejected?',
      a: 'If a volunteer or administrator rejects a submission, the exact reviewer feedback and rejection reason will be visible in your dashboard. You can make corrections and click "Submit Again" without overwriting the historical log.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '72px', paddingBottom: '48px', width: '100%' }}>
      {/* 1. HERO SECTION: CENTERED, BALANCED & CINEMATIC */}
      <section
        style={{
          position: 'relative',
          paddingTop: '20px',
          paddingBottom: '20px',
          textAlign: 'center',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {/* Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '0%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        <div className="max-w-page" style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Top Pill Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '6px 18px',
              borderRadius: '999px',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              marginBottom: '20px',
            }}
          >
            <img
              src="/stride-logo.jpg"
              alt="STRIDE"
              style={{ width: '18px', height: '18px', borderRadius: '4px', objectFit: 'cover' }}
            />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
              Official μLearn First-Year Challenge 2027
            </span>
          </div>

          {/* Master Headline */}
          <h1
            style={{
              fontSize: 'clamp(3.2rem, 7vw, 5.5rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: '16px',
              fontFamily: 'var(--font-display)',
              textAlign: 'center',
            }}
          >
            <span className="text-gradient-cyan">STRIDE</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
              color: 'var(--text-pure)',
              fontWeight: 600,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.02em',
              marginBottom: '14px',
              textAlign: 'center',
            }}
          >
            Explore. Build. Learn. Earn Karma.
          </p>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-muted)',
              lineHeight: 1.65,
              marginBottom: '32px',
              maxWidth: '640px',
              textAlign: 'center',
            }}
          >
            A futuristic challenge and registration platform designed for first-year students. Complete practical μJourney quests, submit verified project proofs, collaborate in dynamic groups, and climb the live transparent Karma leaderboard.
          </p>

          {/* Dynamic Event Lifecycle Countdown Container (Centered & Horizontal with High 3D Tilt) */}
          <div
            className="glass-panel countdown-hero-card"
            data-tilt="true"
            data-tilt-intensity="high"
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 36px',
              marginBottom: '32px',
              background: 'rgba(6, 11, 24, 0.85)',
              border: '1px solid var(--border-active)',
              borderRadius: '20px',
              boxShadow: '0 12px 35px rgba(0,0,0,0.6)',
              cursor: 'pointer',
            }}
          >
            <CountdownTimer compact={false} showStatusBadge={true} />
          </div>

          {/* Action CTA Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <button
              onClick={() => onOpenAuth('student-register')}
              className="btn-primary"
              style={{ padding: '14px 30px', fontSize: '0.96rem', gap: '8px' }}
            >
              <Zap size={18} /> Join as Student <ArrowRight size={15} />
            </button>

            <button
              onClick={() => onOpenAuth('volunteer-register')}
              className="btn-secondary"
              style={{ padding: '14px 24px', fontSize: '0.96rem', gap: '8px' }}
            >
              <Users size={17} /> Volunteer Mentor
            </button>

            <button
              onClick={() => setActiveView('leaderboard')}
              className="btn-secondary"
              style={{ padding: '14px 24px', fontSize: '0.96rem', gap: '8px' }}
            >
              <Trophy size={17} color="var(--accent-cyan)" /> Live Leaderboard
            </button>
          </div>

          {/* 3D WebGL Canvas Interactive Showcase Container */}
          <div
            style={{
              width: '100%',
              maxWidth: '720px',
              height: '360px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '32px',
            }}
          >
            <HeroAiCore3D />
          </div>

          {/* Key Metric Highlights 4-Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              width: '100%',
            }}
          >
            <div className="stat-card">
              <span className="stat-value" style={{ color: '#10B981' }}>3,000</span>
              <span className="stat-label">Karma Qualification Goal</span>
            </div>
            <div className="stat-card">
              <span className="stat-value" style={{ color: 'var(--accent-cyan)' }}>500</span>
              <span className="stat-label">Student Groups Max</span>
            </div>
            <div className="stat-card">
              <span className="stat-value" style={{ color: 'var(--accent-indigo)' }}>2-Stage</span>
              <span className="stat-label">Karma Verification Pipeline</span>
            </div>
            <div className="stat-card">
              <span className="stat-value" style={{ color: '#EC4899' }}>100%</span>
              <span className="stat-label">Verified & Transparent</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (4-Step Animated Interactive Section) */}
      <section className="max-w-page">
        <div style={{ textAlign: 'center', marginBottom: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="badge badge-volunteer" style={{ marginBottom: '8px' }}>
            <Compass size={14} /> HOW IT WORKS
          </div>
          <h2 style={{ fontSize: '2.4rem', color: '#FFF' }}>The 4-Step Journey to Mastery</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '8px auto 0' }}>
            Accelerate your engineering journey from day one with hands-on practice.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Step 1 */}
          <div className="glass-panel" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '2rem',
                fontWeight: 900,
                color: 'var(--accent-cyan)',
                opacity: 0.8,
                marginBottom: '12px',
              }}
            >
              01
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#FFF' }}>REGISTER</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Create your STRIDE account with your college credentials and μLearn ID to receive your official registration number.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-panel" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '2rem',
                fontWeight: 900,
                color: 'var(--accent-indigo)',
                opacity: 0.8,
                marginBottom: '12px',
              }}
            >
              02
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#FFF' }}>CHOOSE GROUP</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Select an available student group. Collaborate with assigned μLearn volunteers for task guidance and support.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-panel" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '2rem',
                fontWeight: 900,
                color: 'var(--accent-amber)',
                opacity: 0.8,
                marginBottom: '12px',
              }}
            >
              03
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#FFF' }}>COMPLETE TASKS</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Explore hands-on μJourney tracks: Git, Web, Python, Cloud, IoT, and soft skill communication quests.
            </p>
          </div>

          {/* Step 4 */}
          <div className="glass-panel" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '2rem',
                fontWeight: 900,
                color: '#10B981',
                opacity: 0.8,
                marginBottom: '12px',
              }}
            >
              04
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#FFF' }}>EARN KARMA</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Submit proof links. Pass two-stage Volunteer & Admin verification to unlock leaderboard rank and certificates.
            </p>
          </div>
        </div>
      </section>

      {/* 3. QUALIFICATION RULES SPOTLIGHT */}
      <section className="max-w-page">
        <div
          className="glass-panel-glow"
          style={{
            padding: '36px',
            background: 'linear-gradient(135deg, rgba(6, 11, 24, 0.95) 0%, rgba(6, 182, 212, 0.12) 100%)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            alignItems: 'center',
          }}
        >
          <div>
            <div className="badge badge-gold" style={{ marginBottom: '12px' }}>
              <ShieldCheck size={14} /> QUALIFICATION RULE
            </div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '14px', color: '#FFF' }}>
              3,000 Verified Karma Threshold
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
              To earn the official STRIDE 2027 Certificate of Achievement and qualify for recognition, every first-year student must cross <strong>3,000 Verified Karma</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: '#EF4444', fontWeight: 700 }}>❌ 2,450 Karma</span>
                <span style={{ color: 'var(--text-dim)' }}>→ NOT QUALIFIED</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: '#10B981', fontWeight: 700 }}>✅ 3,000 Karma</span>
                <span style={{ color: 'var(--text-dim)' }}>→ QUALIFIED (Certificate Unlocked)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: '#10B981', fontWeight: 700 }}>✅ 5,250 Karma</span>
                <span style={{ color: 'var(--text-dim)' }}>→ QUALIFIED (Top Leaderboard Contender)</span>
              </div>
            </div>
          </div>

          {/* Visual Meter Demo */}
          <div
            style={{
              background: 'rgba(3, 7, 18, 0.85)',
              border: '1px solid var(--border-active)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: '#FFF' }}>Sample Progress</span>
              <span className="badge badge-verified">88% Towards Goal</span>
            </div>

            <div className="progress-track" style={{ height: '14px' }}>
              <div className="progress-fill" style={{ width: '88%' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Current: <strong style={{ color: '#FFF' }}>2,650 Karma</strong></span>
              <span style={{ color: 'var(--accent-cyan)' }}>Goal: <strong>3,000 Karma</strong></span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: 0 }}>
              * Only VERIFIED Karma counts toward qualification and rankings.
            </p>
          </div>
        </div>
      </section>

      {/* 4. STRIDE RECOGNITION & AWARDS */}
      <section className="max-w-page">
        <div style={{ textAlign: 'center', marginBottom: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="badge badge-gold" style={{ marginBottom: '8px' }}>
            <Award size={14} /> STRIDE RECOGNITION
          </div>
          <h2 style={{ fontSize: '2.4rem', color: '#FFF' }}>Prizes & Distinctions</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '8px auto 0' }}>
            Honoring exceptional performance, mentorship, and persistence across all colleges.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Top Student */}
          <div
            className="glass-panel"
            style={{
              padding: '28px 24px',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              background: 'radial-gradient(circle at top, rgba(245, 158, 11, 0.15) 0%, rgba(6, 11, 24, 0.9) 100%)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Trophy size={24} color="#F59E0B" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '8px' }}>🏆 TOP STUDENT</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px', flex: 1 }}>
              Awarded to the participant with the <strong>Highest Total Verified Karma</strong>. Earliest-timestamp tie-breaker ensures absolute fairness.
            </p>
            {topStudent && (
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem' }}>
                Current Leader: <strong style={{ color: '#F59E0B' }}>{topStudent.student_name}</strong> ({topStudent.verified_karma.toLocaleString()} Karma)
              </div>
            )}
          </div>

          {/* Top Volunteer */}
          <div
            className="glass-panel"
            style={{
              padding: '28px 24px',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              background: 'radial-gradient(circle at top, rgba(6, 182, 212, 0.15) 0%, rgba(6, 11, 24, 0.9) 100%)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Zap size={24} color="var(--accent-cyan)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '8px' }}>⚡ TOP VOLUNTEER</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px', flex: 1 }}>
              Recognizing the volunteer associated with the <strong>highest-performing student group</strong> by total verified Karma.
            </p>
            {topVolunteer && (
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem' }}>
                Leading Volunteer: <strong style={{ color: 'var(--accent-cyan)' }}>{topVolunteer.volunteer.full_name}</strong> ({topVolunteer.group.name})
              </div>
            )}
          </div>

          {/* Participant Recognition */}
          <div
            className="glass-panel"
            style={{
              padding: '28px 24px',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              background: 'radial-gradient(circle at top, rgba(16, 185, 129, 0.15) 0%, rgba(6, 11, 24, 0.9) 100%)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Award size={24} color="#10B981" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '8px' }}>🎓 PARTICIPANT CERTIFICATE</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px', flex: 1 }}>
              Official downloadable vector certificates with verification ID and QR verification for students reaching 3,000+ Karma.
            </p>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', color: '#10B981' }}>
              ✅ PDF & PNG Instant Vector Export
            </div>
          </div>
        </div>
      </section>

      {/* 5. LIVE LEADERBOARD PREVIEW */}
      <section className="max-w-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div className="badge badge-gold" style={{ marginBottom: '4px' }}>
              <Trophy size={14} /> LIVE STANDINGS
            </div>
            <h2 style={{ fontSize: '2rem', color: '#FFF', margin: 0 }}>Top Challengers</h2>
          </div>

          <button
            onClick={() => setActiveView('leaderboard')}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.86rem' }}
          >
            View Full Leaderboard <ArrowRight size={14} />
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '12px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '580px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                <th style={{ padding: '12px 14px' }}>RANK</th>
                <th style={{ padding: '12px 14px' }}>STUDENT</th>
                <th style={{ padding: '12px 14px' }}>GROUP</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>VERIFIED KARMA</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.slice(0, 5).map((entry, idx) => (
                <tr
                  key={entry.student_id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    background: idx === 0 ? 'rgba(245, 158, 11, 0.06)' : undefined,
                  }}
                >
                  <td style={{ padding: '12px 14px', fontWeight: 800 }}>
                    {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${entry.rank}`}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#FFF' }}>
                    {entry.student_name}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                    {entry.group_name}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#10B981', fontFamily: 'var(--font-mono)' }}>
                    {entry.verified_karma.toLocaleString()} Karma
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    {entry.is_qualified ? (
                      <span className="badge badge-qualified">✅ QUALIFIED</span>
                    ) : (
                      <span className="badge badge-pending">IN PROGRESS</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. GROUPS CAPACITY PREVIEW */}
      <section className="max-w-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div className="badge badge-volunteer" style={{ marginBottom: '4px' }}>
              <Users size={14} /> GROUP ALLOCATION (500 MAX)
            </div>
            <h2 style={{ fontSize: '2rem', color: '#FFF', margin: 0 }}>Active Student Groups</h2>
          </div>

          <button
            onClick={() => setActiveView('groups')}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.86rem' }}
          >
            Explore All Groups <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
          {groupRankings.slice(0, 4).map((grp) => {
            const isFull = (grp.member_count || 0) >= grp.capacity;
            const pct = Math.min(100, Math.round(((grp.member_count || 0) / grp.capacity) * 100));

            return (
              <div key={grp.id} className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#FFF', margin: 0 }}>{grp.name}</h3>
                  {isFull ? (
                    <span className="badge badge-full">⚠️ FULL</span>
                  ) : (
                    <span className="badge badge-available">🟢 AVAILABLE</span>
                  )}
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>Capacity Fill</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{grp.member_count || 0} / {grp.capacity}</span>
                  </div>
                  <div className="progress-track" style={{ height: '8px' }}>
                    <div className="progress-fill" style={{ width: `${pct}%`, background: isFull ? '#EF4444' : undefined }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                  <span>Verified Karma</span>
                  <strong style={{ color: '#10B981' }}>{(grp.total_karma || 0).toLocaleString()}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-page">
        <div style={{ textAlign: 'center', marginBottom: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="badge badge-gold" style={{ marginBottom: '8px' }}>
            <HelpCircle size={14} /> FAQ
          </div>
          <h2 style={{ fontSize: '2.4rem', color: '#FFF' }}>Frequently Asked Questions</h2>
        </div>

        <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onClick={() => toggleFaq(idx)}
            >
              <div
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 600,
                  fontSize: '0.96rem',
                  color: '#FFF',
                }}
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={18} color="var(--accent-cyan)" /> : <ChevronDown size={18} />}
              </div>

              {openFaq === idx && (
                <div
                  style={{
                    padding: '0 20px 18px',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '14px',
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. FINAL CTA BANNER */}
      <section className="max-w-page">
        <div
          className="glass-panel-glow"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.15) 0%, rgba(6, 11, 24, 0.95) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#FFF', marginBottom: '12px' }}>
            Ready to Begin Your Quest?
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '540px', margin: '0 0 24px', fontSize: '0.98rem' }}>
            Register now, secure your group slot, and get ready to earn your 3,000 Verified Karma.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => onOpenAuth('student-register')}
              className="btn-primary"
              style={{ padding: '13px 28px', fontSize: '0.95rem' }}
            >
              <Zap size={18} /> Join STRIDE Now
            </button>
            <button
              onClick={() => onOpenAuth('volunteer-register')}
              className="btn-secondary"
              style={{ padding: '13px 24px', fontSize: '0.95rem' }}
            >
              <Users size={18} /> Volunteer Application
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
