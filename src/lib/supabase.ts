/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User } from '../types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isCustom: boolean;
}

const STORAGE_KEYS = {
  SUPABASE_URL: 'RAM_SEC_SUPABASE_URL',
  SUPABASE_ANON_KEY: 'RAM_SEC_SUPABASE_ANON_KEY',
  LOCAL_USERS: 'RAM_SEC_REGISTERED_USERS_DB',
  AUTH_SESSION: 'RAM_SEC_AUTH_SESSION',
};

// Default seed users in the system
export const DEFAULT_OPERATOR_ACCOUNTS: Array<{
  user: User;
  passwordHash: string; // simulated hash for security
}> = [
  {
    user: {
      id: 'usr-admin-01',
      name: 'Ram (Admin)',
      username: 'admin',
      email: 'admin@sec.local',
      role: 'admin',
      joinedDate: 'Jan 2024',
      savedArticles: ['wu-1', 'wu-2'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
    passwordHash: 'ramsec2026',
  },
  {
    user: {
      id: 'usr-researcher-02',
      name: 'Alice Vance',
      username: 'researcher',
      email: 'researcher@sec.local',
      role: 'researcher',
      joinedDate: 'Mar 2025',
      savedArticles: ['wu-2'],
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    },
    passwordHash: 'researcher123',
  },
  {
    user: {
      id: 'usr-analyst-03',
      name: 'Bob Miller',
      username: 'analyst',
      email: 'analyst@sec.local',
      role: 'analyst',
      joinedDate: 'Jun 2025',
      savedArticles: [],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    },
    passwordHash: 'analyst123',
  },
];

// Helper to get active configuration
export function getActiveSupabaseConfig(): SupabaseConfig {
  if (typeof window === 'undefined') {
    return { url: '', anonKey: '', isCustom: false };
  }
  const customUrl = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL);
  const customKey = localStorage.getItem(STORAGE_KEYS.SUPABASE_ANON_KEY);

  const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
  const envUrl = (metaEnv?.VITE_SUPABASE_URL || '').trim();
  const envKey = (metaEnv?.VITE_SUPABASE_ANON_KEY || '').trim();

  if (customUrl && customKey) {
    return { url: customUrl.trim(), anonKey: customKey.trim(), isCustom: true };
  }
  return { url: envUrl, anonKey: envKey, isCustom: false };
}

export function saveCustomSupabaseConfig(url: string, anonKey: string) {
  if (typeof window === 'undefined') return;
  if (!url && !anonKey) {
    localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);
    localStorage.removeItem(STORAGE_KEYS.SUPABASE_ANON_KEY);
  } else {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
    localStorage.setItem(STORAGE_KEYS.SUPABASE_ANON_KEY, anonKey.trim());
  }
  // Re-initialize client
  initSupabase();
}

let supabaseInstance: SupabaseClient | null = null;

export function initSupabase(): SupabaseClient | null {
  const config = getActiveSupabaseConfig();
  if (
    config.url &&
    config.url.startsWith('https://') &&
    config.anonKey &&
    config.anonKey.length > 10
  ) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      });
      return supabaseInstance;
    } catch (e) {
      console.warn('Supabase client initialization warning:', e);
      supabaseInstance = null;
    }
  } else {
    supabaseInstance = null;
  }
  return supabaseInstance;
}

export function isSupabaseConnected(): boolean {
  return initSupabase() !== null;
}

// Local persistent User Repository (Fallback / Sandbox Engine)
export function getLocalUserAccounts(): Array<{ user: User; passwordHash: string }> {
  if (typeof window === 'undefined') return DEFAULT_OPERATOR_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LOCAL_USERS, JSON.stringify(DEFAULT_OPERATOR_ACCOUNTS));
      return DEFAULT_OPERATOR_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_OPERATOR_ACCOUNTS;
    }
    return parsed;
  } catch {
    return DEFAULT_OPERATOR_ACCOUNTS;
  }
}

export function saveLocalUserAccounts(accounts: Array<{ user: User; passwordHash: string }>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.LOCAL_USERS, JSON.stringify(accounts));
}

// SQL Schema generator for users to copy into Supabase SQL Editor
export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- RAM.SEC x SUPABASE AUTH & PROFILES SCHEMA WITH ROW-LEVEL SECURITY (RLS)
-- Paste this script into your Supabase Dashboard -> SQL Editor and run it.
-- ==============================================================================

-- 1. Create a public profiles table linked to Supabase Auth users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  username text unique,
  name text,
  role text check (role in ('admin', 'researcher', 'analyst', 'guest')) default 'researcher',
  avatar text,
  saved_articles text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Security policies
-- Anyone can view profile summaries (for article authors, attribution)
create policy "Public profiles are viewable by authenticated or guest users"
  on public.profiles for select
  using (true);

-- Authenticated users can update only their own profile
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Admins can update any profile (promotion/demotion)
create policy "Admins have full access to all profiles"
  on public.profiles for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 4. Trigger to automatically provision a profile row upon Supabase sign-up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'researcher')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
`;
