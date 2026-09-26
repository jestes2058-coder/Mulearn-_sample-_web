import React from 'react';
import { ShieldCheck, Trophy, Zap, AlertTriangle, CheckCircle2, Lock, FileCheck, Layers } from 'lucide-react';

export const RulesView: React.FC = () => {
  return (
    <div className="max-w-page" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="badge badge-gold" style={{ marginBottom: '8px' }}>
          <ShieldCheck size={14} /> OFFICIAL GUIDELINES
        </div>
        <h1 style={{ fontSize: '2.6rem', color: '#FFF', marginBottom: '8px' }}>
          STRIDE 2027 Challenge Rules & Verification Code
        </h1>
        <p style={{ color: 'var(--warm-white-dim)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
          All participants, volunteers, and administrators must adhere to these governing event rules.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '880px', margin: '0 auto' }}>
        {/* Rule 1: Minimum Qualification */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckCircle2 size={22} color="#10B981" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '8px' }}>
                1. Minimum Qualification Requirement (3,000 Verified Karma)
              </h3>
              <p style={{ color: 'var(--warm-white-subtle)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '12px' }}>
                A student requires a minimum of <strong>3,000 VERIFIED KARMA</strong> to qualify for completion status and obtain the official STRIDE 2027 Certificate of Achievement.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <span className="badge badge-rejected">2,450 Karma ❌ NOT QUALIFIED</span>
                <span className="badge badge-qualified">3,000 Karma ✅ QUALIFIED</span>
                <span className="badge badge-qualified">5,250 Karma ✅ QUALIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rule 2: Top Student Tie-Breaker */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Trophy size={22} color="#F59E0B" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '8px' }}>
                2. Top Student & Tie-Breaker Logic
              </h3>
              <p style={{ color: 'var(--warm-white-subtle)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                The Top Student is determined by the highest total <strong>VERIFIED KARMA</strong>. If two or more students achieve the exact same total Karma, the tie-breaker is awarded to the student who <strong>reached that Karma score earliest</strong> based on verified submission timestamps.
              </p>
            </div>
          </div>
        </div>

        {/* Rule 3: Top Volunteer Performance */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Zap size={22} color="#3B82F6" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '8px' }}>
                3. Top Volunteer Calculation
              </h3>
              <p style={{ color: 'var(--warm-white-subtle)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Volunteer performance is calculated from the <strong>total VERIFIED KARMA earned by students in the volunteer's assigned group</strong>. The volunteer associated with the highest-performing group becomes eligible for the Top Volunteer recognition.
              </p>
            </div>
          </div>
        </div>

        {/* Rule 4: Two-Stage Verification Workflow */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.2)', border: '1px solid var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileCheck size={22} color="var(--accent-cyan)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '8px' }}>
                4. Two-Stage Karma Verification
              </h3>
              <p style={{ color: 'var(--warm-white-subtle)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '14px' }}>
                All task submissions undergo strict multi-tier review before Karma is officially credited:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-volunteer">Stage 1</span>
                  <span>Assigned Volunteer reviews task link, proof screenshot, and claims.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-admin">Stage 2</span>
                  <span>Admin performs final verification against μLearn guidelines.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-verified">Verified</span>
                  <span>Karma is recorded into student total, group total, and live leaderboard!</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rule 5: Locked Group Selection */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Lock size={22} color="#EF4444" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '8px' }}>
                5. Permanent Group Assignment
              </h3>
              <p style={{ color: 'var(--warm-white-subtle)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Once a student confirms their registration and group selection, <strong>the group cannot be changed by the student</strong>. Only Super Administrators may adjust allocations in exceptional circumstances.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
