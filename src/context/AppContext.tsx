import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  UserProfile,
  UserRole,
  Group,
  KarmaSubmission,
  KarmaReview,
  KarmaRecord,
  LeaderboardEntry,
  AppNotification,
  Announcement,
  Certificate,
  EventSettings,
  AuditLog,
  EventLifecyclePhase,
  SubmissionStatus,
} from '../types';
import {
  INITIAL_EVENT_SETTINGS,
  INITIAL_GROUPS,
  INITIAL_USERS,
  INITIAL_SUBMISSIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AUDIT_LOGS,
} from '../services/mockData';
import { getSupabase } from '../services/supabase';

interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  label: string;
  phase: EventLifecyclePhase;
}

interface AppContextType {
  // Current user and auth
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  quickSwitchUser: (role: UserRole | 'GUEST', specificUserId?: string) => void;
  logout: () => void;
  registerStudent: (data: Partial<UserProfile> & { password?: string; group_id: string }) => Promise<{ success: boolean; message: string; user?: UserProfile }>;
  registerVolunteer: (data: Partial<UserProfile> & { password?: string }) => Promise<{ success: boolean; message: string; user?: UserProfile }>;
  login: (email: string, password?: string) => Promise<{ success: boolean; message: string; user?: UserProfile }>;
  updateUserProfile: (userId: string, updates: Partial<UserProfile>) => void;
  setUserStatus: (userId: string, status: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED', reason?: string) => void;
  changeUserRole: (userId: string, newRole: UserRole) => void;

  // Event & Lifecycle
  eventSettings: EventSettings;
  updateEventSettings: (settings: Partial<EventSettings>) => void;
  eventPhase: EventLifecyclePhase;
  countdown: CountdownData;
  isRegistrationOpen: boolean;
  isSubmissionsOpen: boolean;

  // Groups
  groups: Group[];
  createGroup: (name: string, capacity: number) => { success: boolean; message: string; group?: Group };
  updateGroupCapacity: (groupId: string, capacity: number) => void;
  renameGroup: (groupId: string, newName: string) => void;
  toggleGroupStatus: (groupId: string) => void;
  assignVolunteerToGroup: (groupId: string, volunteerId: string) => void;
  removeVolunteerFromGroup: (groupId: string, volunteerId: string) => void;
  deleteGroup: (groupId: string) => { success: boolean; message: string };

  // Submissions & Karma
  submissions: KarmaSubmission[];
  submitTask: (data: {
    task_name: string;
    mulearn_task_link: string;
    claimed_karma: number;
    description: string;
    proof_url?: string;
    proof_filename?: string;
    original_submission_id?: string;
  }) => { success: boolean; message: string; submission?: KarmaSubmission };
  
  reviewSubmissionVolunteer: (submissionId: string, decision: 'APPROVE' | 'REJECT', reason?: string) => void;
  reviewSubmissionAdmin: (submissionId: string, decision: 'APPROVE' | 'REJECT', reason?: string) => void;
  adminOverrideSubmission: (submissionId: string, status: SubmissionStatus, reason?: string) => void;

  // Leaderboard & Analytics
  leaderboard: LeaderboardEntry[];
  topStudent: LeaderboardEntry | null;
  topVolunteer: { volunteer: UserProfile; group: Group; totalKarma: number } | null;
  groupRankings: Group[];
  
  // Computed stats for current student
  currentStudentStats: {
    verifiedKarma: number;
    pendingKarma: number;
    rejectedKarma: number;
    isQualified: boolean;
    qualificationPercent: number;
    rank: number | null;
    submissionCount: number;
    assignedGroup: Group | null;
    assignedVolunteers: UserProfile[];
  };

  // Notifications
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  sendNotification: (userId: string, title: string, message: string, type: AppNotification['type'], link?: string) => void;
  broadcastNotification: (title: string, message: string, type: AppNotification['type']) => void;

  // Announcements
  announcements: Announcement[];
  createAnnouncement: (title: string, content: string, priority?: 'normal' | 'high' | 'urgent') => void;
  deleteAnnouncement: (id: string) => void;

  // Certificates
  certificates: Certificate[];
  generateCertificateForStudent: (studentId: string, type?: 'PARTICIPANT' | 'TOP_STUDENT' | 'TOP_VOLUNTEER') => Certificate;

  // Audit Logs
  auditLogs: AuditLog[];
  logAuditAction: (action: string, targetType: AuditLog['target_type'], targetId: string, details: string) => void;

  // All Users list for admin
  allUsers: UserProfile[];

  // Export functions
  exportDataCSV: (type: 'STUDENTS' | 'VOLUNTEERS' | 'GROUPS' | 'SUBMISSIONS' | 'LEADERBOARD' | 'AUDIT_LOGS') => void;

  // Demo helpers
  resetDemoData: () => void;
  isSupabaseConnected: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'stride_event_settings_v1',
  USERS: 'stride_users_v1',
  CURRENT_USER_ID: 'stride_current_user_id_v1',
  GROUPS: 'stride_groups_v1',
  SUBMISSIONS: 'stride_submissions_v1',
  NOTIFICATIONS: 'stride_notifications_v1',
  ANNOUNCEMENTS: 'stride_announcements_v1',
  AUDIT_LOGS: 'stride_audit_logs_v1',
  CERTIFICATES: 'stride_certificates_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial State from localStorage or Seeds
  const [eventSettings, setEventSettings] = useState<EventSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_EVENT_SETTINGS;
  });

  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved !== null ? saved : 'usr-stud-1'; // Default demo login as Rahul Nair (Qualified Student)
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GROUPS);
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [submissions, setSubmissions] = useState<KarmaSubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
    return saved ? JSON.parse(saved) : [];
  });

  // Current logged in user profile
  const currentUser = useMemo(() => {
    if (!currentUserId) return null;
    return allUsers.find((u) => u.id === currentUserId) || null;
  }, [currentUserId, allUsers]);

  // Save to localStorage when state updates
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(eventSettings));
  }, [eventSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certificates));
  }, [certificates]);

  // Check Supabase connectivity
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  useEffect(() => {
    const client = getSupabase();
    setIsSupabaseConnected(Boolean(client));
  }, []);

  // 2. Audit Logger helper
  const logAuditAction = useCallback(
    (action: string, targetType: AuditLog['target_type'], targetId: string, details: string) => {
      const actorId = currentUser?.id || 'sys-auto';
      const actorName = currentUser?.full_name || 'System Auto';
      const actorRole = currentUser?.role || 'SUPER_ADMIN';

      const newLog: AuditLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        actor_id: actorId,
        actor_name: actorName,
        actor_role: actorRole,
        action,
        target_type: targetType,
        target_id: targetId,
        details,
        timestamp: new Date().toISOString(),
      };

      setAuditLogs((prev) => [newLog, ...prev]);
    },
    [currentUser]
  );

  // 3. Event Lifecycle & Live Countdown Calculation
  const calculatePhase = useCallback((): EventLifecyclePhase => {
    const now = new Date().getTime();
    const regStart = new Date(eventSettings.registration_start).getTime();
    const regEnd = new Date(eventSettings.registration_end).getTime();
    const evStart = new Date(eventSettings.event_start).getTime();
    const evEnd = new Date(eventSettings.event_end).getTime();

    if (eventSettings.is_registration_open_override === true && now < evStart) {
      return 'REGISTRATION_OPEN';
    }
    if (eventSettings.is_submissions_open_override === true && now <= evEnd) {
      return 'EVENT_LIVE';
    }

    if (now < regStart) return 'BEFORE_REGISTRATION';
    if (now >= regStart && now <= regEnd) return 'REGISTRATION_OPEN';
    if (now > regEnd && now < evStart) return 'BEFORE_EVENT';
    if (now >= evStart && now <= evEnd) return 'EVENT_LIVE';
    return 'COMPLETED';
  }, [eventSettings]);

  const [eventPhase, setEventPhase] = useState<EventLifecyclePhase>(calculatePhase);
  const [countdown, setCountdown] = useState<CountdownData>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    label: '',
    phase: 'REGISTRATION_OPEN',
  });

  useEffect(() => {
    const updateCountdown = () => {
      const phase = calculatePhase();
      setEventPhase(phase);

      const now = new Date().getTime();
      let targetTime = 0;
      let label = '';

      if (phase === 'BEFORE_REGISTRATION') {
        targetTime = new Date(eventSettings.registration_start).getTime();
        label = 'REGISTRATION OPENS SOON';
      } else if (phase === 'REGISTRATION_OPEN') {
        targetTime = new Date(eventSettings.registration_end).getTime();
        label = 'REGISTRATION IS OPEN';
      } else if (phase === 'BEFORE_EVENT') {
        targetTime = new Date(eventSettings.event_start).getTime();
        label = 'STRIDE BEGINS IN';
      } else if (phase === 'EVENT_LIVE') {
        targetTime = new Date(eventSettings.event_end).getTime();
        label = 'STRIDE IS LIVE';
      } else {
        targetTime = now;
        label = 'STRIDE 2027 — COMPLETED';
      }

      const diff = Math.max(0, targetTime - now);
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
        totalSeconds,
        label,
        phase,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [eventSettings, calculatePhase]);

  const isRegistrationOpen = useMemo(() => {
    if (eventSettings.is_registration_open_override !== null) {
      return eventSettings.is_registration_open_override;
    }
    return eventPhase === 'REGISTRATION_OPEN';
  }, [eventSettings.is_registration_open_override, eventPhase]);

  const isSubmissionsOpen = useMemo(() => {
    if (eventSettings.is_submissions_open_override !== null) {
      return eventSettings.is_submissions_open_override;
    }
    return eventPhase === 'EVENT_LIVE';
  }, [eventSettings.is_submissions_open_override, eventPhase]);

  // 4. Notifications Helpers
  const sendNotification = useCallback(
    (userId: string, title: string, message: string, type: AppNotification['type'], link?: string) => {
      const newNotif: AppNotification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        user_id: userId,
        title,
        message,
        type,
        read: false,
        created_at: new Date().toISOString(),
        link,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    },
    []
  );

  const broadcastNotification = useCallback(
    (title: string, message: string, type: AppNotification['type']) => {
      const now = new Date().toISOString();
      const newNotifs: AppNotification[] = allUsers.map((u) => ({
        id: `notif-${Date.now()}-${u.id.substring(0, 5)}`,
        user_id: u.id,
        title,
        message,
        type,
        read: false,
        created_at: now,
      }));
      setNotifications((prev) => [...newNotifs, ...prev]);
    },
    [allUsers]
  );

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((n) => (n.user_id === currentUser.id ? { ...n, read: true } : n))
    );
  }, [currentUser]);

  const unreadNotificationCount = useMemo(() => {
    if (!currentUser) return 0;
    return notifications.filter((n) => n.user_id === currentUser.id && !n.read).length;
  }, [currentUser, notifications]);

  // 5. Dynamic Leaderboard & Tie-Breaker Calculation
  // Rule: Rank students based ONLY on Total VERIFIED Karma.
  // Tie-break: Earliest time reaching that Karma score!
  const leaderboard = useMemo<LeaderboardEntry[]>(() => {
    const students = allUsers.filter((u) => u.role === 'STUDENT' && u.status === 'ACTIVE');

    const entries: LeaderboardEntry[] = students.map((student) => {
      const studentSubmissions = submissions.filter(
        (s) => s.student_id === student.id && s.status === 'VERIFIED'
      );

      const verifiedKarma = studentSubmissions.reduce((sum, s) => sum + s.claimed_karma, 0);

      // Find earliest timestamp of the last verified submission that got them to this total
      let earliestVerifiedTimestamp = student.created_at;
      if (studentSubmissions.length > 0) {
        const sortedSubmissions = [...studentSubmissions].sort(
          (a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
        );
        earliestVerifiedTimestamp = sortedSubmissions[sortedSubmissions.length - 1].updated_at;
      }

      const assignedGroup = groups.find((g) => g.id === student.group_id);

      return {
        rank: 0,
        student_id: student.id,
        student_name: student.full_name,
        group_id: student.group_id || 'none',
        group_name: assignedGroup?.name || 'Unassigned Group',
        mulearn_username: student.mulearn_username,
        college: student.college,
        verified_karma: verifiedKarma,
        earliest_verified_timestamp: earliestVerifiedTimestamp,
        is_qualified: verifiedKarma >= eventSettings.qualification_karma,
        submission_count: studentSubmissions.length,
      };
    });

    // Sort: Verified Karma DESC, then Earliest Timestamp ASC
    entries.sort((a, b) => {
      if (b.verified_karma !== a.verified_karma) {
        return b.verified_karma - a.verified_karma;
      }
      return (
        new Date(a.earliest_verified_timestamp).getTime() -
        new Date(b.earliest_verified_timestamp).getTime()
      );
    });

    // Assign final ranks
    return entries.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }, [allUsers, submissions, groups, eventSettings.qualification_karma]);

  const topStudent = useMemo(() => (leaderboard.length > 0 ? leaderboard[0] : null), [leaderboard]);

  // 6. Group Performance & Capacity Calculation
  const groupRankings = useMemo<Group[]>(() => {
    const enriched = groups.map((grp) => {
      const memberStudents = allUsers.filter(
        (u) => u.role === 'STUDENT' && u.group_id === grp.id && u.status === 'ACTIVE'
      );
      const memberIds = new Set(memberStudents.map((s) => s.id));

      const groupVerifiedSubmissions = submissions.filter(
        (s) => memberIds.has(s.student_id) && s.status === 'VERIFIED'
      );

      const totalKarma = groupVerifiedSubmissions.reduce((sum, s) => sum + s.claimed_karma, 0);
      const memberCount = memberStudents.length;
      const avgKarma = memberCount > 0 ? Math.round(totalKarma / memberCount) : 0;

      const groupLeaderboard = leaderboard.filter((l) => l.group_id === grp.id);
      const topInGroup = groupLeaderboard.length > 0 ? groupLeaderboard[0].student_name : 'None';
      const qualifiedCount = groupLeaderboard.filter((l) => l.is_qualified).length;

      // Volunteers assigned to this group
      const assignedVols = allUsers
        .filter((u) => u.role === 'VOLUNTEER' && u.assigned_group_ids?.includes(grp.id))
        .map((v) => ({ id: v.id, name: v.full_name, email: v.email }));

      return {
        ...grp,
        member_count: memberCount,
        volunteer_count: assignedVols.length,
        total_karma: totalKarma,
        avg_karma: avgKarma,
        qualified_count: qualifiedCount,
        top_student_name: topInGroup,
        volunteers: assignedVols,
      };
    });

    // Sort by total verified group karma DESC
    return enriched.sort((a, b) => (b.total_karma || 0) - (a.total_karma || 0));
  }, [groups, allUsers, submissions, leaderboard]);

  // 7. Top Volunteer Determination
  // Rule: Top Volunteer performance is calculated from total VERIFIED Karma in volunteer's assigned group.
  const topVolunteer = useMemo(() => {
    const volunteers = allUsers.filter((u) => u.role === 'VOLUNTEER' && u.status === 'ACTIVE');
    if (volunteers.length === 0 || groupRankings.length === 0) return null;

    let bestVol: UserProfile | null = null;
    let bestGroup: Group = groupRankings[0];
    let maxKarma = -1;

    for (const vol of volunteers) {
      if (!vol.assigned_group_ids || vol.assigned_group_ids.length === 0) continue;
      for (const gid of vol.assigned_group_ids) {
        const grp = groupRankings.find((g) => g.id === gid);
        if (grp && (grp.total_karma || 0) > maxKarma) {
          maxKarma = grp.total_karma || 0;
          bestVol = vol;
          bestGroup = grp;
        }
      }
    }

    if (!bestVol) {
      bestVol = volunteers[0];
      bestGroup = groupRankings[0];
      maxKarma = bestGroup.total_karma || 0;
    }

    return {
      volunteer: bestVol,
      group: bestGroup,
      totalKarma: maxKarma,
    };
  }, [allUsers, groupRankings]);

  // 8. Current Student Dashboard Statistics
  const currentStudentStats = useMemo(() => {
    if (!currentUser || currentUser.role !== 'STUDENT') {
      return {
        verifiedKarma: 0,
        pendingKarma: 0,
        rejectedKarma: 0,
        isQualified: false,
        qualificationPercent: 0,
        rank: null,
        submissionCount: 0,
        assignedGroup: null,
        assignedVolunteers: [],
      };
    }

    const studentSubs = submissions.filter((s) => s.student_id === currentUser.id);
    const verified = studentSubs
      .filter((s) => s.status === 'VERIFIED')
      .reduce((sum, s) => sum + s.claimed_karma, 0);

    const pending = studentSubs
      .filter((s) => s.status === 'PENDING_VOLUNTEER_REVIEW' || s.status === 'PENDING_ADMIN_REVIEW' || s.status === 'VOLUNTEER_APPROVED')
      .reduce((sum, s) => sum + s.claimed_karma, 0);

    const rejected = studentSubs
      .filter((s) => s.status === 'REJECTED')
      .reduce((sum, s) => sum + s.claimed_karma, 0);

    const reqKarma = eventSettings.qualification_karma;
    const isQualified = verified >= reqKarma;
    const qualificationPercent = Math.min(100, Math.round((verified / reqKarma) * 100));

    const rankEntry = leaderboard.find((l) => l.student_id === currentUser.id);
    const rank = rankEntry ? rankEntry.rank : null;

    const assignedGroup = groups.find((g) => g.id === currentUser.group_id) || null;
    const assignedVolunteers = allUsers.filter(
      (u) => u.role === 'VOLUNTEER' && currentUser.group_id && u.assigned_group_ids?.includes(currentUser.group_id)
    );

    return {
      verifiedKarma: verified,
      pendingKarma: pending,
      rejectedKarma: rejected,
      isQualified,
      qualificationPercent,
      rank,
      submissionCount: studentSubs.length,
      assignedGroup,
      assignedVolunteers,
    };
  }, [currentUser, submissions, eventSettings.qualification_karma, leaderboard, groups, allUsers]);

  // 9. Authentication & User Registration Handlers
  const registerStudent = async (
    data: Partial<UserProfile> & { password?: string; group_id: string }
  ): Promise<{ success: boolean; message: string; user?: UserProfile }> => {
    // Validate uniqueness
    const emailExists = allUsers.some((u) => u.email.toLowerCase() === data.email?.toLowerCase());
    if (emailExists) {
      return { success: false, message: 'This email is already registered. Please sign in or use another email.' };
    }

    const phoneExists = allUsers.some((u) => u.phone.replace(/\s+/g, '') === data.phone?.replace(/\s+/g, ''));
    if (phoneExists) {
      return { success: false, message: 'This phone number is already registered for another participant.' };
    }

    const studentIdExists = allUsers.some((u) => u.student_id.toLowerCase() === data.student_id?.toLowerCase());
    if (studentIdExists) {
      return { success: false, message: 'This Student ID / Admission Number has already been registered.' };
    }

    const mulearnExists = allUsers.some((u) => u.mulearn_username.toLowerCase() === data.mulearn_username?.toLowerCase());
    if (mulearnExists) {
      return { success: false, message: 'This μLearn username is already registered.' };
    }

    // Check group capacity
    const targetGroup = groups.find((g) => g.id === data.group_id);
    if (!targetGroup || targetGroup.status === 'INACTIVE') {
      return { success: false, message: 'Selected group is not available.' };
    }

    const currentMemberCount = allUsers.filter((u) => u.group_id === targetGroup.id).length;
    if (currentMemberCount >= targetGroup.capacity) {
      return { success: false, message: `Group "${targetGroup.name}" is currently FULL (${targetGroup.capacity}/${targetGroup.capacity}). Please select an available group.` };
    }

    // Generate unique Registration ID: STRIDE-2027-XXXXX
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const regId = `STRIDE-2027-${randomSuffix}`;

    const newStudent: UserProfile = {
      id: `usr-stud-${Date.now()}`,
      auth_user_id: `auth-${Date.now()}`,
      full_name: data.full_name || 'Participant',
      email: data.email || '',
      phone: data.phone || '',
      college: data.college || '',
      branch: data.branch || '',
      semester: data.semester || 'Semester 1',
      student_id: data.student_id || '',
      mulearn_username: data.mulearn_username || '',
      role: 'STUDENT',
      status: 'ACTIVE',
      registration_id: regId,
      group_id: data.group_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${regId}`,
    };

    setAllUsers((prev) => [newStudent, ...prev]);
    setCurrentUserId(newStudent.id);

    // Send welcome notification
    sendNotification(
      newStudent.id,
      '🎉 Welcome to STRIDE 2027!',
      `Registration complete! Your registration ID is ${regId}. You are enrolled in ${targetGroup.name}. Explore tasks to start earning Karma.`,
      'success'
    );

    logAuditAction(
      'REGISTER_STUDENT',
      'USER',
      newStudent.id,
      `Student ${newStudent.full_name} (${newStudent.registration_id}) registered in ${targetGroup.name}.`
    );

    return {
      success: true,
      message: `Registration successful! Assigned ID: ${regId}`,
      user: newStudent,
    };
  };

  const registerVolunteer = async (
    data: Partial<UserProfile> & { password?: string }
  ): Promise<{ success: boolean; message: string; user?: UserProfile }> => {
    const emailExists = allUsers.some((u) => u.email.toLowerCase() === data.email?.toLowerCase());
    if (emailExists) {
      return { success: false, message: 'This email is already registered.' };
    }

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const regId = `STRIDE-VOL-${randomSuffix}`;

    const newVolunteer: UserProfile = {
      id: `usr-vol-${Date.now()}`,
      auth_user_id: `auth-vol-${Date.now()}`,
      full_name: data.full_name || 'Volunteer',
      email: data.email || '',
      phone: data.phone || '',
      college: data.college || '',
      branch: data.branch || '',
      semester: data.semester || 'Semester 5',
      student_id: data.student_id || '',
      mulearn_username: data.mulearn_username || '',
      role: 'VOLUNTEER',
      status: 'ACTIVE',
      registration_id: regId,
      assigned_group_ids: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setAllUsers((prev) => [newVolunteer, ...prev]);
    setCurrentUserId(newVolunteer.id);

    sendNotification(
      newVolunteer.id,
      'Welcome STRIDE Volunteer!',
      'Thank you for registering as a Volunteer. An administrator will assign groups to your dashboard soon.',
      'info'
    );

    logAuditAction(
      'REGISTER_VOLUNTEER',
      'USER',
      newVolunteer.id,
      `Volunteer ${newVolunteer.full_name} registered.`
    );

    return {
      success: true,
      message: 'Volunteer account created successfully!',
      user: newVolunteer,
    };
  };

  const login = async (
    email: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _password?: string
  ): Promise<{ success: boolean; message: string; user?: UserProfile }> => {
    const found = allUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      return { success: false, message: 'No account found with this email address.' };
    }
    if (found.status === 'BLOCKED') {
      return {
        success: false,
        message: 'Your STRIDE account has been temporarily restricted. Please contact the event administration.',
      };
    }

    setCurrentUserId(found.id);
    return { success: true, message: `Welcome back, ${found.full_name}!`, user: found };
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const quickSwitchUser = (role: UserRole | 'GUEST', specificUserId?: string) => {
    if (role === 'GUEST') {
      setCurrentUserId(null);
      return;
    }
    if (specificUserId) {
      const match = allUsers.find((u) => u.id === specificUserId);
      if (match) {
        setCurrentUserId(match.id);
        return;
      }
    }
    const matchRole = allUsers.find((u) => u.role === role && u.status === 'ACTIVE');
    if (matchRole) {
      setCurrentUserId(matchRole.id);
    }
  };

  const updateUserProfile = (userId: string, updates: Partial<UserProfile>) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates, updated_at: new Date().toISOString() } : u))
    );
    logAuditAction('UPDATE_PROFILE', 'USER', userId, `Profile updated for user ID ${userId}.`);
  };

  const setUserStatus = (userId: string, status: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED', reason?: string) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status, updated_at: new Date().toISOString() } : u))
    );
    logAuditAction(
      'SET_USER_STATUS',
      'USER',
      userId,
      `User status changed to ${status}${reason ? ` (Reason: ${reason})` : ''}.`
    );
  };

  const changeUserRole = (userId: string, newRole: UserRole) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole, updated_at: new Date().toISOString() } : u))
    );
    logAuditAction('CHANGE_ROLE', 'USER', userId, `User role changed to ${newRole}.`);
  };

  // 10. Group Management
  const createGroup = (name: string, capacity: number): { success: boolean; message: string; group?: Group } => {
    if (groups.length >= eventSettings.maximum_groups) {
      return { success: false, message: `Maximum group limit reached (${eventSettings.maximum_groups}).` };
    }
    const nameExists = groups.some((g) => g.name.toLowerCase() === name.trim().toLowerCase());
    if (nameExists) {
      return { success: false, message: `A group named "${name}" already exists.` };
    }

    const newGroup: Group = {
      id: `grp-${Date.now()}`,
      name: name.trim(),
      capacity: capacity > 0 ? capacity : eventSettings.default_group_capacity,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };

    setGroups((prev) => [...prev, newGroup]);
    logAuditAction('CREATE_GROUP', 'GROUP', newGroup.id, `Created group "${newGroup.name}" with capacity ${newGroup.capacity}.`);
    return { success: true, message: `Group "${newGroup.name}" created successfully!`, group: newGroup };
  };

  const updateGroupCapacity = (groupId: string, capacity: number) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, capacity: Math.max(1, capacity) } : g))
    );
    logAuditAction('UPDATE_GROUP_CAPACITY', 'GROUP', groupId, `Updated group capacity to ${capacity}.`);
  };

  const renameGroup = (groupId: string, newName: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, name: newName.trim() } : g))
    );
    logAuditAction('RENAME_GROUP', 'GROUP', groupId, `Renamed group to "${newName}".`);
  };

  const toggleGroupStatus = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, status: g.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : g
      )
    );
    logAuditAction('TOGGLE_GROUP_STATUS', 'GROUP', groupId, `Toggled group active status.`);
  };

  const assignVolunteerToGroup = (groupId: string, volunteerId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === volunteerId) {
          const currentGroups = u.assigned_group_ids || [];
          if (!currentGroups.includes(groupId)) {
            return { ...u, assigned_group_ids: [...currentGroups, groupId] };
          }
        }
        return u;
      })
    );
    logAuditAction('ASSIGN_VOLUNTEER', 'GROUP', groupId, `Assigned volunteer ${volunteerId} to group.`);
  };

  const removeVolunteerFromGroup = (groupId: string, volunteerId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === volunteerId) {
          return {
            ...u,
            assigned_group_ids: (u.assigned_group_ids || []).filter((id) => id !== groupId),
          };
        }
        return u;
      })
    );
    logAuditAction('REMOVE_VOLUNTEER', 'GROUP', groupId, `Removed volunteer ${volunteerId} from group.`);
  };

  const deleteGroup = (groupId: string): { success: boolean; message: string } => {
    const hasMembers = allUsers.some((u) => u.group_id === groupId);
    if (hasMembers) {
      return { success: false, message: 'Cannot delete group with registered students. Reassign members first.' };
    }
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    logAuditAction('DELETE_GROUP', 'GROUP', groupId, `Deleted group ID ${groupId}.`);
    return { success: true, message: 'Group deleted successfully.' };
  };

  // 11. Task Submission & Duplicate Prevention
  const submitTask = (data: {
    task_name: string;
    mulearn_task_link: string;
    claimed_karma: number;
    description: string;
    proof_url?: string;
    proof_filename?: string;
    original_submission_id?: string;
  }): { success: boolean; message: string; submission?: KarmaSubmission } => {
    if (!currentUser || currentUser.role !== 'STUDENT') {
      return { success: false, message: 'Only registered students can submit μJourney tasks.' };
    }

    if (currentUser.status === 'BLOCKED') {
      return { success: false, message: 'Your account is restricted. You cannot submit tasks.' };
    }

    // Duplicate prevention check
    const normalizedLink = data.mulearn_task_link.trim().toLowerCase();
    const isDuplicate = submissions.some(
      (s) =>
        s.student_id === currentUser.id &&
        s.status !== 'REJECTED' &&
        (s.mulearn_task_link.trim().toLowerCase() === normalizedLink ||
          s.task_name.trim().toLowerCase() === data.task_name.trim().toLowerCase())
    );

    if (isDuplicate) {
      return {
        success: false,
        message: '⚠️ This μJourney task has already been submitted and is currently active or verified.',
      };
    }

    const assignedGroup = groups.find((g) => g.id === currentUser.group_id);

    const isResubmission = Boolean(data.original_submission_id);

    const newSub: KarmaSubmission = {
      id: `sub-${Date.now()}`,
      student_id: currentUser.id,
      student_name: currentUser.full_name,
      student_email: currentUser.email,
      student_mulearn: currentUser.mulearn_username,
      group_id: currentUser.group_id || 'none',
      group_name: assignedGroup?.name || 'Unassigned Group',
      task_name: data.task_name.trim(),
      mulearn_task_link: data.mulearn_task_link.trim(),
      claimed_karma: Number(data.claimed_karma),
      description: data.description.trim(),
      proof_url: data.proof_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
      proof_filename: data.proof_filename || 'task_proof_evidence.png',
      status: isResubmission ? 'RESUBMITTED' : 'PENDING_VOLUNTEER_REVIEW',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      resubmission_count: isResubmission ? 1 : 0,
      original_submission_id: data.original_submission_id,
      reviews: [],
    };

    setSubmissions((prev) => [newSub, ...prev]);

    // Send confirmation to student
    sendNotification(
      currentUser.id,
      'Task Submission Received',
      `Your submission for "${newSub.task_name}" (${newSub.claimed_karma} Karma) is now in the Stage 1 Volunteer Review queue.`,
      'info'
    );

    // Notify assigned volunteers
    if (currentUser.group_id) {
      const volunteers = allUsers.filter(
        (u) => u.role === 'VOLUNTEER' && u.assigned_group_ids?.includes(currentUser.group_id!)
      );
      for (const vol of volunteers) {
        sendNotification(
          vol.id,
          'New Task Submission to Review',
          `${currentUser.full_name} from ${assignedGroup?.name} submitted "${newSub.task_name}" (${newSub.claimed_karma} Karma).`,
          'info'
        );
      }
    }

    logAuditAction(
      'SUBMIT_KARMA',
      'SUBMISSION',
      newSub.id,
      `Student ${currentUser.full_name} submitted task "${newSub.task_name}" for ${newSub.claimed_karma} Karma.`
    );

    return {
      success: true,
      message: 'Task submitted successfully for Volunteer Review!',
      submission: newSub,
    };
  };

  // 12. Two-Stage Karma Verification
  // Stage 1: Volunteer Review
  const reviewSubmissionVolunteer = (submissionId: string, decision: 'APPROVE' | 'REJECT', reason?: string) => {
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    const reviewer = currentUser;
    const reviewerName = reviewer?.full_name || 'Volunteer Reviewer';
    const reviewerId = reviewer?.id || 'vol-auto';

    const newReview: KarmaReview = {
      id: `rev-${Date.now()}`,
      submission_id: submissionId,
      reviewer_id: reviewerId,
      reviewer_name: reviewerName,
      reviewer_role: reviewer?.role || 'VOLUNTEER',
      decision,
      stage: 'VOLUNTEER',
      reason: reason || (decision === 'APPROVE' ? 'Approved by Volunteer' : 'Rejected by Volunteer'),
      reviewed_at: new Date().toISOString(),
    };

    const nextStatus: SubmissionStatus = decision === 'APPROVE' ? 'PENDING_ADMIN_REVIEW' : 'REJECTED';

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: nextStatus,
              updated_at: new Date().toISOString(),
              reviews: [...(s.reviews || []), newReview],
            }
          : s
      )
    );

    // Send notification to student
    if (decision === 'APPROVE') {
      sendNotification(
        sub.student_id,
        'Volunteer Approved Task ✅',
        `Your task "${sub.task_name}" was approved by Volunteer ${reviewerName} and has advanced to Stage 2 Admin Verification.`,
        'info'
      );
    } else {
      sendNotification(
        sub.student_id,
        'Submission Rejected ❌',
        `Your task "${sub.task_name}" was rejected by Volunteer ${reviewerName}. Reason: ${reason || 'Incomplete submission'}. You may make corrections and submit again.`,
        'error'
      );
    }

    logAuditAction(
      decision === 'APPROVE' ? 'VOLUNTEER_APPROVE' : 'VOLUNTEER_REJECT',
      'SUBMISSION',
      submissionId,
      `Volunteer ${reviewerName} ${decision.toLowerCase()}d submission for ${sub.student_name}. Reason: ${reason || 'N/A'}`
    );
  };

  // Stage 2: Admin Review
  const reviewSubmissionAdmin = (submissionId: string, decision: 'APPROVE' | 'REJECT', reason?: string) => {
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    const reviewer = currentUser;
    const reviewerName = reviewer?.full_name || 'Admin Reviewer';
    const reviewerId = reviewer?.id || 'admin-auto';

    const newReview: KarmaReview = {
      id: `rev-${Date.now()}`,
      submission_id: submissionId,
      reviewer_id: reviewerId,
      reviewer_name: reviewerName,
      reviewer_role: reviewer?.role || 'ADMIN',
      decision,
      stage: 'ADMIN',
      reason: reason || (decision === 'APPROVE' ? 'Final Admin Verification Passed' : 'Admin Rejected'),
      reviewed_at: new Date().toISOString(),
    };

    const nextStatus: SubmissionStatus = decision === 'APPROVE' ? 'VERIFIED' : 'REJECTED';

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: nextStatus,
              updated_at: new Date().toISOString(),
              reviews: [...(s.reviews || []), newReview],
            }
          : s
      )
    );

    // Notify student
    if (decision === 'APPROVE') {
      sendNotification(
        sub.student_id,
        `+${sub.claimed_karma} Verified Karma! 🟢`,
        `Congratulations! Admin ${reviewerName} verified your submission "${sub.task_name}". ${sub.claimed_karma} Karma has been credited to your STRIDE score!`,
        'success'
      );

      // Check if this approval causes qualification!
      const currentVerified = submissions
        .filter((s) => s.student_id === sub.student_id && s.status === 'VERIFIED')
        .reduce((sum, s) => sum + s.claimed_karma, 0);

      const newTotal = currentVerified + sub.claimed_karma;
      if (currentVerified < eventSettings.qualification_karma && newTotal >= eventSettings.qualification_karma) {
        sendNotification(
          sub.student_id,
          '🏆 3,000 KARMA QUALIFICATION ACHIEVED! 🏆',
          `Incredible milestone! You have officially crossed 3,000 Verified Karma and earned full STRIDE 2027 qualification status!`,
          'achievement'
        );
      }
    } else {
      sendNotification(
        sub.student_id,
        'Admin Review: Submission Rejected ❌',
        `Admin ${reviewerName} rejected your submission "${sub.task_name}". Reason: ${reason || 'Does not meet verification guidelines'}. You can fix and submit again.`,
        'error'
      );
    }

    logAuditAction(
      decision === 'APPROVE' ? 'ADMIN_VERIFY' : 'ADMIN_REJECT',
      'SUBMISSION',
      submissionId,
      `Admin ${reviewerName} ${decision.toLowerCase()}d submission for ${sub.student_name} (${sub.claimed_karma} Karma).`
    );
  };

  const adminOverrideSubmission = (submissionId: string, status: SubmissionStatus, reason?: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status,
              updated_at: new Date().toISOString(),
            }
          : s
      )
    );
    logAuditAction('ADMIN_OVERRIDE', 'SUBMISSION', submissionId, `Super Admin manually changed status to ${status}. Reason: ${reason || 'Manual override'}`);
  };

  // 13. Event Settings Update
  const updateEventSettings = (settings: Partial<EventSettings>) => {
    setEventSettings((prev) => ({ ...prev, ...settings }));
    logAuditAction('UPDATE_SETTINGS', 'SETTING', 'stride_2027', `Event configuration updated.`);
  };

  // 14. Announcements Management
  const createAnnouncement = (title: string, content: string, priority: 'normal' | 'high' | 'urgent' = 'normal') => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      priority,
      created_by: currentUser?.id || 'admin-auto',
      created_by_name: currentUser?.full_name || 'STRIDE Team',
      published_at: new Date().toISOString(),
      status: 'PUBLISHED',
    };

    setAnnouncements((prev) => [newAnn, ...prev]);
    broadcastNotification(`📢 Announcement: ${newAnn.title}`, newAnn.content, 'announcement');
    logAuditAction('CREATE_ANNOUNCEMENT', 'ANNOUNCEMENT', newAnn.id, `Created announcement "${newAnn.title}".`);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    logAuditAction('DELETE_ANNOUNCEMENT', 'ANNOUNCEMENT', id, `Deleted announcement ID ${id}.`);
  };

  // 15. Certificate Generation
  const generateCertificateForStudent = (
    studentId: string,
    type: 'PARTICIPANT' | 'TOP_STUDENT' | 'TOP_VOLUNTEER' = 'PARTICIPANT'
  ): Certificate => {
    const student = allUsers.find((u) => u.id === studentId);
    const assignedGroup = groups.find((g) => g.id === student?.group_id);

    const verifiedSubmissions = submissions.filter(
      (s) => s.student_id === studentId && s.status === 'VERIFIED'
    );
    const totalKarma = verifiedSubmissions.reduce((sum, s) => sum + s.claimed_karma, 0);

    const certNumber = `STRIDE-CERT-2027-${Math.floor(100000 + Math.random() * 900000)}`;

    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      user_id: studentId,
      student_name: student?.full_name || 'Participant',
      certificate_type: type,
      certificate_number: certNumber,
      verified_karma: totalKarma,
      group_name: assignedGroup?.name || 'STRIDE Participant',
      generated_at: new Date().toISOString(),
      is_eligible: totalKarma >= eventSettings.qualification_karma || type === 'TOP_VOLUNTEER',
    };

    setCertificates((prev) => {
      const filtered = prev.filter((c) => c.user_id !== studentId);
      return [newCert, ...filtered];
    });

    logAuditAction('GENERATE_CERTIFICATE', 'CERTIFICATE', newCert.id, `Generated ${type} certificate (${certNumber}) for ${newCert.student_name}.`);
    return newCert;
  };

  // 16. CSV Data Export
  const exportDataCSV = (type: 'STUDENTS' | 'VOLUNTEERS' | 'GROUPS' | 'SUBMISSIONS' | 'LEADERBOARD' | 'AUDIT_LOGS') => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = `STRIDE_EXPORT_${type}_${Date.now()}.csv`;

    if (type === 'STUDENTS') {
      headers = ['Registration ID', 'Full Name', 'Email', 'Phone', 'College', 'Branch', 'Semester', 'Student ID', 'μLearn Username', 'Group', 'Status', 'Registered At'];
      const students = allUsers.filter((u) => u.role === 'STUDENT');
      rows = students.map((s) => {
        const grp = groups.find((g) => g.id === s.group_id);
        return [
          s.registration_id,
          s.full_name,
          s.email,
          s.phone,
          s.college,
          s.branch,
          s.semester,
          s.student_id,
          s.mulearn_username,
          grp?.name || 'Unassigned',
          s.status,
          s.created_at,
        ];
      });
    } else if (type === 'VOLUNTEERS') {
      headers = ['Registration ID', 'Full Name', 'Email', 'Phone', 'College', 'Branch', 'Semester', 'μLearn Username', 'Assigned Groups', 'Status'];
      const volunteers = allUsers.filter((u) => u.role === 'VOLUNTEER');
      rows = volunteers.map((v) => {
        const assignedNames = (v.assigned_group_ids || [])
          .map((id) => groups.find((g) => g.id === id)?.name)
          .filter(Boolean)
          .join('; ');
        return [
          v.registration_id,
          v.full_name,
          v.email,
          v.phone,
          v.college,
          v.branch,
          v.semester,
          v.mulearn_username,
          assignedNames || 'None',
          v.status,
        ];
      });
    } else if (type === 'GROUPS') {
      headers = ['Group Name', 'Capacity', 'Members Enrolled', 'Total Verified Karma', 'Average Karma', 'Qualified Students', 'Top Student', 'Status'];
      rows = groupRankings.map((g) => [
        g.name,
        g.capacity,
        g.member_count || 0,
        g.total_karma || 0,
        g.avg_karma || 0,
        g.qualified_count || 0,
        g.top_student_name || 'None',
        g.status,
      ]);
    } else if (type === 'SUBMISSIONS') {
      headers = ['Submission ID', 'Student Name', 'Email', 'Group', 'Task Name', 'μLearn Link', 'Claimed Karma', 'Status', 'Submitted At', 'Verified/Updated At'];
      rows = submissions.map((s) => [
        s.id,
        s.student_name,
        s.student_email,
        s.group_name,
        s.task_name,
        s.mulearn_task_link,
        s.claimed_karma,
        s.status,
        s.submitted_at,
        s.updated_at,
      ]);
    } else if (type === 'LEADERBOARD') {
      headers = ['Rank', 'Student Name', 'Group', 'College', 'μLearn Username', 'Verified Karma', 'Earliest Achievement Time', 'Qualified'];
      rows = leaderboard.map((l) => [
        l.rank,
        l.student_name,
        l.group_name,
        l.college,
        l.mulearn_username,
        l.verified_karma,
        l.earliest_verified_timestamp,
        l.is_qualified ? 'YES' : 'NO',
      ]);
    } else if (type === 'AUDIT_LOGS') {
      headers = ['Timestamp', 'Actor Name', 'Role', 'Action', 'Target Type', 'Target ID', 'Details'];
      rows = auditLogs.map((a) => [
        a.timestamp,
        a.actor_name,
        a.actor_role,
        a.action,
        a.target_type,
        a.target_id,
        a.details,
      ]);
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAuditAction('EXPORT_DATA', 'USER', currentUser?.id || 'sys', `Exported ${type} data as CSV.`);
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.GROUPS);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.CERTIFICATES);

    setEventSettings(INITIAL_EVENT_SETTINGS);
    setAllUsers(INITIAL_USERS);
    setCurrentUserId('usr-stud-1');
    setGroups(INITIAL_GROUPS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCertificates([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser: (u) => setCurrentUserId(u?.id || null),
        quickSwitchUser,
        logout,
        registerStudent,
        registerVolunteer,
        login,
        updateUserProfile,
        setUserStatus,
        changeUserRole,
        eventSettings,
        updateEventSettings,
        eventPhase,
        countdown,
        isRegistrationOpen,
        isSubmissionsOpen,
        groups,
        createGroup,
        updateGroupCapacity,
        renameGroup,
        toggleGroupStatus,
        assignVolunteerToGroup,
        removeVolunteerFromGroup,
        deleteGroup,
        submissions,
        submitTask,
        reviewSubmissionVolunteer,
        reviewSubmissionAdmin,
        adminOverrideSubmission,
        leaderboard,
        topStudent,
        topVolunteer,
        groupRankings,
        currentStudentStats,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        sendNotification,
        broadcastNotification,
        announcements,
        createAnnouncement,
        deleteAnnouncement,
        certificates,
        generateCertificateForStudent,
        auditLogs,
        logAuditAction,
        allUsers,
        exportDataCSV,
        resetDemoData,
        isSupabaseConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
