import React from 'react';
import { useApp } from '../../context/AppContext';
import { CountdownTimer } from '../common/CountdownTimer';
import { Calendar, Clock, CheckCircle2, Zap, Award, Sparkles } from 'lucide-react';

export const TimelineView: React.FC = () => {
  const { eventSettings, eventPhase } = useApp();

  const events = [
    {
      date: '20 July 2027',
      time: '00:00 IST',
      title: 'Registration Portal Opens',
      desc: 'First-year students and mentors can register and select student groups.',
      isDone: eventPhase !== 'BEFORE_REGISTRATION',
      isCurrent: eventPhase === 'REGISTRATION_OPEN',
    },
    {
      date: '22 August 2027',
      time: '23:59 IST',
      title: 'Registration Deadline',
      desc: 'Final cutoff for enrolling into student groups. Capacity locking in effect.',
      isDone: eventPhase === 'BEFORE_EVENT' || eventPhase === 'EVENT_LIVE' || eventPhase === 'COMPLETED',
      isCurrent: eventPhase === 'REGISTRATION_CLOSED',
    },
    {
      date: '25 August 2027',
      time: '00:00 IST',
      title: 'STRIDE 2027 Challenge Begins',
      desc: 'Submissions unlock! 12-day sprint for μJourney quests and Karma accumulation.',
      isDone: eventPhase === 'EVENT_LIVE' || eventPhase === 'COMPLETED',
      isCurrent: eventPhase === 'EVENT_LIVE',
    },
    {
      date: '5 September 2027',
      time: '23:59 IST',
      title: 'STRIDE 2027 Challenge Concludes',
      desc: 'Task submission deadline. Final Stage 2 Admin reviews and verification sprint.',
      isDone: eventPhase === 'COMPLETED',
      isCurrent: false,
    },
    {
      date: 'Post Event',
      time: 'September 2027',
      title: 'Top Student & Top Volunteer Ceremony',
      desc: 'Announcement of Top Student, Top Volunteer, and generation of official certificates.',
      isDone: eventPhase === 'COMPLETED',
      isCurrent: eventPhase === 'COMPLETED',
    },
  ];

  return (
    <div className="max-w-page" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div className="badge badge-pending" style={{ marginBottom: '8px' }}>
          <Calendar size={14} /> OFFICIAL SCHEDULE
        </div>
        <h1 style={{ fontSize: '2.6rem', color: '#FFF', marginBottom: '8px' }}>
          STRIDE 2027 Event Timeline
        </h1>
        <p style={{ color: 'var(--warm-white-dim)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
          All event milestones are synchronized with <strong>Asia/Kolkata (IST)</strong> timezone.
        </p>
      </div>

      {/* Live Countdown Component */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div
          className="glass-panel countdown-hero-card"
          data-tilt="true"
          data-tilt-intensity="high"
          style={{
            display: 'inline-block',
            padding: '24px 32px',
            border: '1px solid var(--border-active)',
            cursor: 'pointer',
          }}
        >
          <CountdownTimer compact={false} showStatusBadge={true} />
        </div>
      </div>

      {/* Roadmap Cards */}
      <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {events.map((ev, idx) => (
          <div
            key={idx}
            className="glass-panel"
            style={{
              padding: '24px',
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start',
              borderLeft: ev.isCurrent ? '4px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
              background: ev.isCurrent ? 'rgba(51, 104, 160, 0.15)' : 'rgba(14, 23, 38, 0.85)',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: ev.isDone ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: ev.isDone ? '1px solid #10B981' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {ev.isDone ? <CheckCircle2 size={22} color="#10B981" /> : <Clock size={22} color="var(--warm-white-dim)" />}
            </div>

            <div style={{ flex: 1 }}>
              <div className="flex-between" style={{ marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  {ev.date} • {ev.time}
                </span>
                {ev.isCurrent && <span className="badge badge-verified animate-pulse-glow">CURRENT PHASE</span>}
              </div>

              <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '6px' }}>{ev.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--warm-white-subtle)', margin: 0, lineHeight: 1.5 }}>
                {ev.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
