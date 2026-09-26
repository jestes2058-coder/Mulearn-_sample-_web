import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Search, Filter, ShieldCheck, Sparkles, UserCheck, Clock } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { leaderboard, groups, currentUser, topStudent } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('ALL');

  const filteredLeaderboard = leaderboard.filter((entry) => {
    const matchesSearch =
      entry.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.mulearn_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.college.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGroup = selectedGroup === 'ALL' || entry.group_id === selectedGroup;

    return matchesSearch && matchesGroup;
  });

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="max-w-page" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div className="badge badge-gold" style={{ marginBottom: '8px' }}>
          <Trophy size={14} /> LIVE STRIDE RANKINGS
        </div>
        <h1 style={{ fontSize: '2.6rem', color: '#FFF', marginBottom: '8px' }}>
          Student Leaderboard
        </h1>
        <p style={{ color: 'var(--warm-white-dim)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
          Rankings are calculated dynamically based strictly on <strong>Total Verified Karma</strong>. Ties are resolved by the earliest timestamp of achieving that Karma score.
        </p>
      </div>

      {/* Podium Spotlight for Top 3 */}
      {leaderboard.length >= 3 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            marginBottom: '36px',
          }}
        >
          {/* Silver #2 */}
          <div
            className="glass-panel"
            style={{
              padding: '28px 20px',
              textAlign: 'center',
              borderTop: '4px solid #94A3B8',
              order: 1,
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🥈</div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94A3B8' }}>RANK #2</span>
            <h3 style={{ fontSize: '1.3rem', color: '#FFF', margin: '6px 0 2px' }}>
              {leaderboard[1].student_name}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--warm-white-dim)', display: 'block', marginBottom: '12px' }}>
              {leaderboard[1].group_name} • {leaderboard[1].college}
            </span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: '#10B981' }}>
              {leaderboard[1].verified_karma.toLocaleString()}{' '}
              <span style={{ fontSize: '0.8rem', color: 'var(--warm-white-dim)' }}>Karma</span>
            </div>
            {leaderboard[1].is_qualified && (
              <span className="badge badge-qualified" style={{ marginTop: '8px' }}>
                ✅ QUALIFIED
              </span>
            )}
          </div>

          {/* Gold #1 */}
          <div
            className="glass-panel-glow"
            style={{
              padding: '32px 20px',
              textAlign: 'center',
              borderTop: '5px solid #F59E0B',
              background: 'radial-gradient(circle at top, rgba(245, 158, 11, 0.2) 0%, rgba(14, 23, 38, 0.95) 100%)',
              order: 0,
              transform: 'scale(1.03)',
            }}
          >
            <div style={{ fontSize: '2.4rem', marginBottom: '4px' }}>🥇</div>
            <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#F59E0B' }}>🏆 TOP STUDENT (RANK #1)</span>
            <h3 style={{ fontSize: '1.5rem', color: '#FFF', margin: '6px 0 2px' }}>
              {leaderboard[0].student_name}
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--warm-white-subtle)', display: 'block', marginBottom: '14px' }}>
              {leaderboard[0].group_name} • {leaderboard[0].college}
            </span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: '#10B981' }}>
              {leaderboard[0].verified_karma.toLocaleString()}{' '}
              <span style={{ fontSize: '0.85rem', color: 'var(--warm-white-dim)' }}>Karma</span>
            </div>
            <span className="badge badge-qualified" style={{ marginTop: '10px' }}>
              ✅ QUALIFIED
            </span>
          </div>

          {/* Bronze #3 */}
          <div
            className="glass-panel"
            style={{
              padding: '28px 20px',
              textAlign: 'center',
              borderTop: '4px solid #D97706',
              order: 2,
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🥉</div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D97706' }}>RANK #3</span>
            <h3 style={{ fontSize: '1.3rem', color: '#FFF', margin: '6px 0 2px' }}>
              {leaderboard[2].student_name}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--warm-white-dim)', display: 'block', marginBottom: '12px' }}>
              {leaderboard[2].group_name} • {leaderboard[2].college}
            </span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: '#10B981' }}>
              {leaderboard[2].verified_karma.toLocaleString()}{' '}
              <span style={{ fontSize: '0.8rem', color: 'var(--warm-white-dim)' }}>Karma</span>
            </div>
            {leaderboard[2].is_qualified && (
              <span className="badge badge-qualified" style={{ marginTop: '8px' }}>
                ✅ QUALIFIED
              </span>
            )}
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search Bar */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search
            size={18}
            color="var(--warm-white-dim)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search by student name, μLearn ID, college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '38px' }}
          />
        </div>

        {/* Group Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--warm-white-dim)" />
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="input-field"
            style={{ width: 'auto', minWidth: '180px' }}
          >
            <option value="ALL">All Student Groups</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Leaderboard Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table className="stride-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Rank</th>
              <th>Student Name</th>
              <th>Group</th>
              <th>College</th>
              <th>μLearn ID</th>
              <th style={{ textAlign: 'right' }}>Verified Karma</th>
              <th>Status</th>
              <th>Latest Milestone</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaderboard.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--warm-white-dim)' }}>
                  No participants matched your search criteria.
                </td>
              </tr>
            ) : (
              filteredLeaderboard.map((entry) => {
                const isCurrent = currentUser?.id === entry.student_id;
                const rankBadge =
                  entry.rank === 1
                    ? '🥇'
                    : entry.rank === 2
                    ? '🥈'
                    : entry.rank === 3
                    ? '🥉'
                    : `#${entry.rank}`;

                return (
                  <tr
                    key={entry.student_id}
                    style={{
                      background: isCurrent ? 'rgba(51, 104, 160, 0.22)' : undefined,
                      borderLeft: isCurrent ? '4px solid var(--accent-cyan)' : 'none',
                    }}
                  >
                    <td>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                          fontSize: '1rem',
                          color: entry.rank <= 3 ? '#F59E0B' : 'var(--warm-white)',
                        }}
                      >
                        {rankBadge}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ color: '#FFF' }}>{entry.student_name}</strong>
                        {isCurrent && (
                          <span
                            style={{
                              fontSize: '0.65rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'var(--accent-cyan)',
                              color: '#070B12',
                              fontWeight: 800,
                            }}
                          >
                            YOU
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{ color: 'var(--warm-white-subtle)', fontSize: '0.85rem' }}>
                        {entry.group_name}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--warm-white-dim)', fontSize: '0.82rem' }}>
                        {entry.college}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontSize: '0.82rem' }}>
                        @{entry.mulearn_username}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 800,
                          fontSize: '1.05rem',
                          color: '#10B981',
                        }}
                      >
                        {entry.verified_karma.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      {entry.is_qualified ? (
                        <span className="badge badge-qualified">✅ QUALIFIED</span>
                      ) : (
                        <span className="badge badge-not-qualified">❌ IN PROGRESS</span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', color: 'var(--warm-white-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {formatTimestamp(entry.earliest_verified_timestamp)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Privacy Notice Banner */}
      <div
        style={{
          marginTop: '24px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.78rem',
          color: 'var(--warm-white-dim)',
        }}
      >
        <ShieldCheck size={18} color="#10B981" />
        <span>
          <strong>Privacy Safeguard:</strong> The public leaderboard displays only verified Karma, ranks, group names, and μLearn usernames. Personal emails, phone numbers, and student admission IDs are protected.
        </span>
      </div>
    </div>
  );
};
