import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, Shield, Zap, Trophy, UserCheck, AlertCircle, Sparkles } from 'lucide-react';

export const GroupsView: React.FC = () => {
  const { groupRankings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAvailability, setFilterAvailability] = useState<'ALL' | 'AVAILABLE' | 'FULL'>('ALL');

  const filteredGroups = groupRankings.filter((grp) => {
    const matchesSearch = grp.name.toLowerCase().includes(searchQuery.toLowerCase());
    const memberCount = grp.member_count || 0;
    const isFull = memberCount >= grp.capacity;

    if (filterAvailability === 'AVAILABLE') return matchesSearch && !isFull;
    if (filterAvailability === 'FULL') return matchesSearch && isFull;
    return matchesSearch;
  });

  return (
    <div className="max-w-page" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div className="badge badge-volunteer" style={{ marginBottom: '8px' }}>
          <Users size={14} /> GROUP ALLOCATIONS
        </div>
        <h1 style={{ fontSize: '2.6rem', color: '#FFF', marginBottom: '8px' }}>
          Student Groups & Capacity Tracker
        </h1>
        <p style={{ color: 'var(--warm-white-dim)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
          Supporting up to 500 dynamic student groups. Student capacity is strictly enforced with real-time availability badges.
        </p>
      </div>

      {/* Toolbar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search
            size={18}
            color="var(--warm-white-dim)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '38px' }}
          />
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setFilterAvailability('ALL')}
            className={filterAvailability === 'ALL' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          >
            All Groups
          </button>
          <button
            onClick={() => setFilterAvailability('AVAILABLE')}
            className={filterAvailability === 'AVAILABLE' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          >
            🟢 Available Only
          </button>
          <button
            onClick={() => setFilterAvailability('FULL')}
            className={filterAvailability === 'FULL' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          >
            ⚠️ Full Only
          </button>
        </div>
      </div>

      {/* Group Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {filteredGroups.map((grp) => {
          const members = grp.member_count || 0;
          const capacity = grp.capacity || 500;
          const isFull = members >= capacity;
          const percent = Math.min(100, Math.round((members / capacity) * 100));

          return (
            <div
              key={grp.id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderColor: isFull ? 'rgba(239, 68, 68, 0.4)' : undefined,
              }}
            >
              <div>
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: '#FFF', margin: 0 }}>{grp.name}</h3>
                  {isFull ? (
                    <span className="badge badge-full">⚠️ FULL</span>
                  ) : (
                    <span className="badge badge-available">🟢 AVAILABLE</span>
                  )}
                </div>

                {/* Capacity Progress Bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div className="flex-between" style={{ fontSize: '0.78rem', color: 'var(--warm-white-dim)', marginBottom: '6px' }}>
                    <span>Enrollment Capacity</span>
                    <span style={{ fontWeight: 700, color: isFull ? '#EF4444' : '#10B981' }}>
                      {members} / {capacity} Students ({percent}%)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percent}%`,
                        background: isFull
                          ? 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)'
                          : 'linear-gradient(90deg, var(--primary-blue) 0%, var(--accent-cyan) 100%)',
                      }}
                    />
                  </div>
                </div>

                {/* Group Stats */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    borderRadius: '10px',
                    padding: '12px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    fontSize: '0.82rem',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--warm-white-dim)', display: 'block', fontSize: '0.72rem' }}>
                      Total Verified Karma
                    </span>
                    <strong style={{ color: '#10B981', fontSize: '1rem' }}>
                      {grp.total_karma?.toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--warm-white-dim)', display: 'block', fontSize: '0.72rem' }}>
                      Average Karma / Student
                    </span>
                    <strong style={{ color: 'var(--accent-cyan)', fontSize: '1rem' }}>
                      {grp.avg_karma?.toLocaleString()}
                    </strong>
                  </div>
                </div>

                {/* Top Student in Group */}
                <div style={{ fontSize: '0.82rem', color: 'var(--warm-white-subtle)', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--warm-white-dim)' }}>Top Student: </span>
                  <strong style={{ color: '#F59E0B' }}>{grp.top_student_name || 'None'}</strong>
                </div>
              </div>

              {/* Assigned Volunteers */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '12px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--warm-white-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Assigned μLearn Volunteer(s)
                </span>
                {grp.volunteers && grp.volunteers.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {grp.volunteers.map((v) => (
                      <span
                        key={v.id}
                        style={{
                          fontSize: '0.75rem',
                          background: 'rgba(59, 130, 246, 0.15)',
                          color: '#38BDF8',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <UserCheck size={12} /> {v.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: 'var(--warm-white-dim)' }}>
                    Volunteer allocation in progress
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
