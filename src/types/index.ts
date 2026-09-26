export type UserRole = 'STUDENT' | 'VOLUNTEER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';

export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'SUSPENDED';

export interface UserProfile {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  semester: string;
  student_id: string; // Admission number
  mulearn_username: string;
  role: UserRole;
  status: UserStatus;
  registration_id: string; // e.g. STRIDE-2027-00482
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  group_id?: string; // For students
  assigned_group_ids?: string[]; // For volunteers
}

export interface Group {
  id: string;
  name: string;
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  // Computed fields
  member_count?: number;
  volunteer_count?: number;
  total_karma?: number;
  avg_karma?: number;
  qualified_count?: number;
  top_student_name?: string;
  volunteers?: { id: string; name: string; email: string }[];
}

export type SubmissionStatus =
  | 'PENDING_VOLUNTEER_REVIEW'
  | 'VOLUNTEER_APPROVED'
  | 'PENDING_ADMIN_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'RESUBMITTED';

export interface KarmaReview {
  id: string;
  submission_id: string;
  reviewer_id: string;
  reviewer_name: string;
  reviewer_role: UserRole;
  decision: 'APPROVE' | 'REJECT';
  stage: 'VOLUNTEER' | 'ADMIN';
  reason?: string;
  reviewed_at: string;
}

export interface KarmaSubmission {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  student_mulearn: string;
  group_id: string;
  group_name: string;
  task_name: string;
  mulearn_task_link: string;
  claimed_karma: number;
  description: string;
  proof_url?: string;
  proof_filename?: string;
  status: SubmissionStatus;
  submitted_at: string;
  updated_at: string;
  resubmission_count: number;
  original_submission_id?: string;
  reviews?: KarmaReview[];
}

export interface KarmaRecord {
  id: string;
  student_id: string;
  submission_id: string;
  verified_karma: number;
  verified_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  previous_rank?: number;
  student_id: string;
  student_name: string;
  group_id: string;
  group_name: string;
  mulearn_username: string;
  college: string;
  verified_karma: number;
  earliest_verified_timestamp: string; // Used for tie-breaking
  is_qualified: boolean;
  submission_count: number;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'announcement';

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  created_at: string;
  link?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'normal' | 'high' | 'urgent';
  created_by: string;
  created_by_name: string;
  published_at: string;
  status: 'DRAFT' | 'PUBLISHED';
}

export type CertificateType = 'PARTICIPANT' | 'TOP_STUDENT' | 'TOP_VOLUNTEER';

export interface Certificate {
  id: string;
  user_id: string;
  student_name: string;
  certificate_type: CertificateType;
  certificate_number: string;
  verified_karma: number;
  group_name: string;
  generated_at: string;
  file_url?: string;
  is_eligible: boolean;
}

export interface EventSettings {
  id: string;
  event_name: string;
  tagline: string;
  registration_start: string; // ISO string
  registration_end: string;
  event_start: string;
  event_end: string;
  qualification_karma: number; // default 3000
  timezone: string; // default 'Asia/Kolkata'
  maximum_groups: number; // default 500
  default_group_capacity: number; // default 500
  is_submissions_open_override: boolean | null; // null = follow dates, true/false = force override
  is_registration_open_override: boolean | null;
  min_volunteers_per_group: number;
  max_volunteers_per_group: number;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_role: UserRole;
  action: string;
  target_type: 'USER' | 'SUBMISSION' | 'GROUP' | 'SETTING' | 'CERTIFICATE' | 'ANNOUNCEMENT';
  target_id: string;
  details: string;
  timestamp: string;
}

export type EventLifecyclePhase =
  | 'BEFORE_REGISTRATION'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'BEFORE_EVENT'
  | 'EVENT_LIVE'
  | 'COMPLETED';
