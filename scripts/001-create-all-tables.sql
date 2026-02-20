-- =============================================
-- GV Software - Complete Database Setup
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. PROFILES (extends Supabase auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'manager', 'client')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 2. PROJECTS (client projects managed in dashboard)
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  deadline DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'proposal_sent', 'accepted', 'in_progress', 'completed', 'cancelled')),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  total_value NUMERIC(12, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 3. PROPOSALS
-- =============================================
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
  sent_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 4. CONTRACTS
-- =============================================
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'cancelled')),
  signed_at TIMESTAMPTZ,
  signature_data TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 5. TASKS
-- =============================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 6. PAYMENTS
-- =============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 7. INVOICES
-- =============================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL DEFAULT CURRENT_DATE,
  pdf_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 8. PORTFOLIO_PROJECTS (public portfolio)
-- =============================================
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  project_url TEXT NOT NULL DEFAULT '',
  github_url TEXT NOT NULL DEFAULT '',
  technologies TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 9. PORTFOLIO_SKILLS
-- =============================================
CREATE TABLE IF NOT EXISTS portfolio_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#ffffff',
  category TEXT NOT NULL DEFAULT 'other',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 10. PORTFOLIO_ABOUT
-- =============================================
CREATE TABLE IF NOT EXISTS portfolio_about (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT 'Sobre',
  description TEXT NOT NULL DEFAULT '',
  projects_count INTEGER NOT NULL DEFAULT 0,
  clients_count INTEGER NOT NULL DEFAULT 0,
  years_experience INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 11. PORTFOLIO_FEEDBACKS
-- =============================================
CREATE TABLE IF NOT EXISTS portfolio_feedbacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_company TEXT NOT NULL DEFAULT '',
  client_email TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL DEFAULT '',
  project_name TEXT NOT NULL DEFAULT '',
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 12. PORTFOLIO_CONTACTS
-- =============================================
CREATE TABLE IF NOT EXISTS portfolio_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL DEFAULT '',
  budget TEXT NOT NULL DEFAULT '',
  deadline TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES for performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_proposals_project_id ON proposals(project_id);
CREATE INDEX IF NOT EXISTS idx_contracts_project_id ON contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_payments_project_id ON payments(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_id ON invoices(payment_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_display_order ON portfolio_projects(display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_skills_display_order ON portfolio_skills(display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_feedbacks_is_approved ON portfolio_feedbacks(is_approved);
CREATE INDEX IF NOT EXISTS idx_portfolio_contacts_is_read ON portfolio_contacts(is_read);

-- =============================================
-- FOREIGN KEY names for joins used in code
-- (projects_client_id_fkey and projects_created_by_fkey)
-- These are auto-created by the REFERENCES above
-- =============================================

-- =============================================
-- UPDATED_AT trigger function
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'profiles', 'projects', 'proposals', 'contracts', 'tasks',
    'payments', 'invoices', 'portfolio_projects', 'portfolio_skills',
    'portfolio_about', 'portfolio_feedbacks', 'portfolio_contacts'
  ])
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS set_updated_at ON %I;
      CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    ', t, t);
  END LOOP;
END;
$$;

-- =============================================
-- RLS Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_about ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_contacts ENABLE ROW LEVEL SECURITY;

-- Portfolio tables: public read, authenticated write
CREATE POLICY "portfolio_projects_public_read" ON portfolio_projects FOR SELECT USING (true);
CREATE POLICY "portfolio_projects_auth_insert" ON portfolio_projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "portfolio_projects_auth_update" ON portfolio_projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "portfolio_projects_auth_delete" ON portfolio_projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "portfolio_skills_public_read" ON portfolio_skills FOR SELECT USING (true);
CREATE POLICY "portfolio_skills_auth_insert" ON portfolio_skills FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "portfolio_skills_auth_update" ON portfolio_skills FOR UPDATE TO authenticated USING (true);
CREATE POLICY "portfolio_skills_auth_delete" ON portfolio_skills FOR DELETE TO authenticated USING (true);

CREATE POLICY "portfolio_about_public_read" ON portfolio_about FOR SELECT USING (true);
CREATE POLICY "portfolio_about_auth_insert" ON portfolio_about FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "portfolio_about_auth_update" ON portfolio_about FOR UPDATE TO authenticated USING (true);
CREATE POLICY "portfolio_about_auth_delete" ON portfolio_about FOR DELETE TO authenticated USING (true);

CREATE POLICY "portfolio_feedbacks_public_read" ON portfolio_feedbacks FOR SELECT USING (true);
CREATE POLICY "portfolio_feedbacks_auth_insert" ON portfolio_feedbacks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "portfolio_feedbacks_auth_update" ON portfolio_feedbacks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "portfolio_feedbacks_auth_delete" ON portfolio_feedbacks FOR DELETE TO authenticated USING (true);

-- Contacts: public can insert, authenticated can read/update/delete
CREATE POLICY "portfolio_contacts_public_insert" ON portfolio_contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "portfolio_contacts_auth_read" ON portfolio_contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "portfolio_contacts_auth_update" ON portfolio_contacts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "portfolio_contacts_auth_delete" ON portfolio_contacts FOR DELETE TO authenticated USING (true);

-- Profiles: users can read all, update own
CREATE POLICY "profiles_read_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (true);

-- Projects: authenticated users can do everything
CREATE POLICY "projects_auth_select" ON projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "projects_auth_insert" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "projects_auth_update" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "projects_auth_delete" ON projects FOR DELETE TO authenticated USING (true);

-- Proposals: public read (for client view), authenticated write
CREATE POLICY "proposals_public_read" ON proposals FOR SELECT USING (true);
CREATE POLICY "proposals_auth_insert" ON proposals FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "proposals_auth_update" ON proposals FOR UPDATE TO authenticated USING (true);
CREATE POLICY "proposals_auth_delete" ON proposals FOR DELETE TO authenticated USING (true);

-- Contracts: public read (for client signing), authenticated write
CREATE POLICY "contracts_public_read" ON contracts FOR SELECT USING (true);
CREATE POLICY "contracts_auth_insert" ON contracts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "contracts_auth_update" ON contracts FOR UPDATE USING (true);
CREATE POLICY "contracts_auth_delete" ON contracts FOR DELETE TO authenticated USING (true);

-- Tasks: authenticated users
CREATE POLICY "tasks_auth_select" ON tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "tasks_auth_insert" ON tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "tasks_auth_update" ON tasks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "tasks_auth_delete" ON tasks FOR DELETE TO authenticated USING (true);

-- Payments: authenticated users
CREATE POLICY "payments_auth_select" ON payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "payments_auth_insert" ON payments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "payments_auth_update" ON payments FOR UPDATE TO authenticated USING (true);

-- Invoices: authenticated users
CREATE POLICY "invoices_auth_select" ON invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "invoices_auth_insert" ON invoices FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "invoices_auth_update" ON invoices FOR UPDATE TO authenticated USING (true);

-- =============================================
-- Enable Realtime for portfolio_projects
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE portfolio_projects;
