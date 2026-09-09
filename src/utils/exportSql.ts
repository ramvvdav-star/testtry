export const SUPABASE_POSTGRES_SCHEMA = `-- RAM.SEC Cybersecurity Portfolio & Personal SOC Lab
-- PostgreSQL & Supabase DDL Migration Schema
-- Generated for Production Deployment on Vercel + Supabase / PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & USERS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'guest' CHECK (role IN ('admin', 'researcher', 'guest')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SITE SETTINGS & SOC STATUS
CREATE TABLE IF NOT EXISTS public.site_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'current',
  brand_name VARCHAR(50) NOT NULL DEFAULT 'RAM.SEC',
  tagline TEXT NOT NULL,
  positioning TEXT NOT NULL,
  system_status VARCHAR(50) NOT NULL DEFAULT 'OPERATIONAL',
  threat_level VARCHAR(50) NOT NULL DEFAULT 'LOW',
  lab_status VARCHAR(50) NOT NULL DEFAULT 'ONLINE',
  current_focus TEXT NOT NULL,
  location VARCHAR(100) DEFAULT 'India',
  social_handle VARCHAR(50) DEFAULT '@RAM_56688',
  github_url TEXT,
  linkedin_url TEXT,
  contact_email TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  security_concepts TEXT[] NOT NULL DEFAULT '{}',
  github_link TEXT,
  live_demo TEXT,
  date VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'RESEARCH', 'ARCHIVED')),
  category VARCHAR(50) NOT NULL DEFAULT 'WEB SECURITY',
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WRITE-UPS / ARTICLES
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL DEFAULT 'Ram',
  date VARCHAR(50) NOT NULL,
  reading_time VARCHAR(50) DEFAULT '5 min read',
  difficulty VARCHAR(50) NOT NULL DEFAULT 'INTERMEDIATE',
  category VARCHAR(100) NOT NULL DEFAULT 'Web Security',
  tags TEXT[] NOT NULL DEFAULT '{}',
  references TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  views INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DAILY LOGS
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  worked_on TEXT NOT NULL,
  learned TEXT NOT NULL,
  failed TEXT NOT NULL,
  will_try_next TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SKILLS & ARSENAL
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  experience_level VARCHAR(50) NOT NULL DEFAULT 'Intermediate',
  description TEXT NOT NULL,
  projects_using_it TEXT[] DEFAULT '{}',
  icon_name VARCHAR(50) NOT NULL,
  proficiency_percent INT DEFAULT 85,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CERTIFICATIONS & EDUCATION
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  date VARCHAR(50) NOT NULL,
  credential_id VARCHAR(100),
  credential_url TEXT
);

CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  degree VARCHAR(255) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  period VARCHAR(100) NOT NULL,
  highlights TEXT[] DEFAULT '{}'
);

-- 8. MESSAGES / INQUIRIES
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action VARCHAR(100) NOT NULL,
  actor VARCHAR(100) NOT NULL,
  severity VARCHAR(50) NOT NULL DEFAULT 'INFO',
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for fast querying
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles (published);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects (slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects (category);
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON public.daily_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs (created_at DESC);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public can read published content
CREATE POLICY "Public articles read" ON public.articles FOR SELECT USING (published = true);
CREATE POLICY "Public projects read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public daily logs read" ON public.daily_logs FOR SELECT USING (true);
CREATE POLICY "Public skills read" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public settings read" ON public.site_settings FOR SELECT USING (true);

-- Public can insert messages (contact form)
CREATE POLICY "Public messages insert" ON public.messages FOR INSERT WITH CHECK (true);
`;

export const VERCEL_DEPLOYMENT_GUIDE = `# Deployment Guide for RAM.SEC to Vercel

### 1. Prerequisites
- GitHub account
- Vercel account
- Supabase or PostgreSQL instance (Optional for cloud sync; the application runs fully standalone with client-side persistence as well).

### 2. Required Environment Variables
In your Vercel Project Settings > Environment Variables, configure:

\`\`\`env
# Optional: Supabase configuration (if connecting live backend)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# NextAuth / Session Secret
NEXTAUTH_SECRET=generate-a-strong-random-hex-string
NEXTAUTH_URL=https://your-domain.vercel.app

# Admin Credentials for Initial Boot
ADMIN_EMAIL=ram.security@proton.me

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
\`\`\`

### 3. Deploy Command
- Build command: \`npm run build\`
- Output directory: \`dist\`
`;
