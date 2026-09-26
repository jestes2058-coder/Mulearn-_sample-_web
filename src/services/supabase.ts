import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables or fallback to local storage configuration
const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const getSupabaseConfig = () => {
  const customUrl = localStorage.getItem('stride_supabase_url');
  const customKey = localStorage.getItem('stride_supabase_anon_key');

  const url = customUrl || envSupabaseUrl;
  const anonKey = customKey || envSupabaseAnonKey;

  const isConfigured = Boolean(url && anonKey && url.startsWith('http'));

  return { url, anonKey, isConfigured };
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  const { url, anonKey, isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }

  return supabaseInstance;
};

export const setCustomSupabaseConfig = (url: string, anonKey: string) => {
  localStorage.setItem('stride_supabase_url', url.trim());
  localStorage.setItem('stride_supabase_anon_key', anonKey.trim());
  supabaseInstance = null; // reset client to re-initialize
};

export const clearCustomSupabaseConfig = () => {
  localStorage.removeItem('stride_supabase_url');
  localStorage.removeItem('stride_supabase_anon_key');
  supabaseInstance = null;
};

// SQL Schema script for Supabase database creation
export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- STRIDE EVENT PLATFORM DATABASE SCHEMA FOR SUPABASE
-- Run this script in the Supabase SQL Editor to create all tables and RLS policies
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  college TEXT NOT NULL,
  branch TEXT NOT NULL,
  semester TEXT NOT NULL,
  student_id TEXT UNIQUE NOT NULL,
  mulearn_username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('STUDENT', 'VOLUNTEER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'BLOCKED', 'SUSPENDED')),
  registration_id TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Groups Table
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  capacity INT NOT NULL DEFAULT 500 CHECK (capacity > 0),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Group Members Table (Students assigned to groups)
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES public.groups(id) ON DELETE RESTRICT,
  student_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Group Volunteers Table (Volunteers assigned to groups, 1-4 per group)
CREATE TABLE IF NOT EXISTS public.group_volunteers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  volunteer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, volunteer_id)
);

-- 6. Create Karma Submissions Table
CREATE TABLE IF NOT EXISTS public.karma_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  mulearn_task_link TEXT NOT NULL,
  claimed_karma INT NOT NULL CHECK (claimed_karma > 0),
  description TEXT NOT NULL,
  proof_url TEXT,
  proof_filename TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING_VOLUNTEER_REVIEW' 
    CHECK (status IN ('PENDING_VOLUNTEER_REVIEW', 'VOLUNTEER_APPROVED', 'PENDING_ADMIN_REVIEW', 'VERIFIED', 'REJECTED', 'RESUBMITTED')),
  resubmission_count INT DEFAULT 0,
  original_submission_id UUID REFERENCES public.karma_submissions(id) ON DELETE SET NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for duplicate task check per student
CREATE UNIQUE INDEX IF NOT EXISTS idx_student_unique_mulearn_link 
ON public.karma_submissions (student_id, mulearn_task_link)
WHERE status != 'REJECTED';

-- 7. Create Karma Reviews Table (Two-Stage Verification Log)
CREATE TABLE IF NOT EXISTS public.karma_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES public.karma_submissions(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  decision TEXT NOT NULL CHECK (decision IN ('APPROVE', 'REJECT')),
  stage TEXT NOT NULL CHECK (stage IN ('VOLUNTEER', 'ADMIN')),
  reason TEXT,
  reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create Karma Records Table (Verified Karma ledger)
CREATE TABLE IF NOT EXISTS public.karma_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  submission_id UUID UNIQUE REFERENCES public.karma_submissions(id) ON DELETE CASCADE,
  verified_karma INT NOT NULL CHECK (verified_karma > 0),
  verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'achievement', 'announcement')),
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Create Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'urgent')),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED')),
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Create Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  certificate_type TEXT NOT NULL CHECK (certificate_type IN ('PARTICIPANT', 'TOP_STUDENT', 'TOP_VOLUNTEER')),
  certificate_number TEXT UNIQUE NOT NULL,
  verified_karma INT NOT NULL DEFAULT 0,
  file_url TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Create Event Settings Table
CREATE TABLE IF NOT EXISTS public.event_settings (
  id TEXT PRIMARY KEY DEFAULT 'stride_2027',
  event_name TEXT NOT NULL DEFAULT 'STRIDE',
  tagline TEXT NOT NULL DEFAULT 'Explore. Build. Learn. Earn Karma.',
  registration_start TIMESTAMPTZ NOT NULL DEFAULT '2027-07-20 00:00:00+05:30',
  registration_end TIMESTAMPTZ NOT NULL DEFAULT '2027-08-22 23:59:59+05:30',
  event_start TIMESTAMPTZ NOT NULL DEFAULT '2027-08-25 00:00:00+05:30',
  event_end TIMESTAMPTZ NOT NULL DEFAULT '2027-09-05 23:59:59+05:30',
  qualification_karma INT NOT NULL DEFAULT 3000,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  maximum_groups INT NOT NULL DEFAULT 500,
  default_group_capacity INT NOT NULL DEFAULT 500,
  is_submissions_open_override BOOLEAN,
  is_registration_open_override BOOLEAN
);

-- Seed default event settings
INSERT INTO public.event_settings (id, event_name, tagline, qualification_karma)
VALUES ('stride_2027', 'STRIDE', 'Explore. Build. Learn. Earn Karma.', 3000)
ON CONFLICT (id) DO NOTHING;

-- 13. Create Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karma_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karma_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karma_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 15. RLS Policies
-- Public read for event settings, announcements, groups & basic leaderboard
CREATE POLICY "Public read event_settings" ON public.event_settings FOR SELECT USING (true);
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public read groups" ON public.groups FOR SELECT USING (true);
CREATE POLICY "Public read karma_records" ON public.karma_records FOR SELECT USING (true);

-- Profiles Policies
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = auth_user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = auth_user_id);

-- Submissions Policies
CREATE POLICY "Students can read own submissions" ON public.karma_submissions FOR SELECT USING (
  student_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Students can insert own submissions" ON public.karma_submissions FOR INSERT WITH CHECK (
  student_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
);

-- Notifications Policies
CREATE POLICY "Users can read own notifications" ON public.notifications FOR SELECT USING (
  user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
);
`;
