-- =====================================================
-- SCRIPT DE CRIACAO DO BANCO DE DADOS - GV SOFTWARE
-- Banco: gvsoftware
-- =====================================================

-- Extensao para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABELA: portfolio_about (Sobre a GV)
-- =====================================================
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

-- =====================================================
-- 2. TABELA: portfolio_skills (Habilidades)
-- =====================================================
CREATE TABLE IF NOT EXISTS portfolio_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Code2',
  color TEXT NOT NULL DEFAULT '#ffffff',
  category TEXT NOT NULL DEFAULT 'other',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 3. TABELA: portfolio_projects (Projetos)
-- =====================================================
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  project_url TEXT NOT NULL DEFAULT '',
  github_url TEXT NOT NULL DEFAULT '',
  technologies TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  show_link BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 4. TABELA: portfolio_contacts (Mensagens)
-- =====================================================
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

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_portfolio_skills_order ON portfolio_skills(display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_order ON portfolio_projects(display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_featured ON portfolio_projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_contacts_read ON portfolio_contacts(is_read);
CREATE INDEX IF NOT EXISTS idx_portfolio_contacts_created ON portfolio_contacts(created_at DESC);

-- =====================================================
-- TRIGGER para updated_at automatico
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON portfolio_about;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON portfolio_about FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at ON portfolio_skills;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON portfolio_skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at ON portfolio_projects;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON portfolio_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at ON portfolio_contacts;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON portfolio_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DADOS INICIAIS - Sobre a GV
-- =====================================================
INSERT INTO portfolio_about (title, description, projects_count, clients_count, years_experience)
SELECT 'Sobre a GV Software', 
       'Somos uma empresa especializada em desenvolvimento de software, criando solucoes digitais inovadoras e de alta qualidade para nossos clientes.',
       50, 100, 5
WHERE NOT EXISTS (SELECT 1 FROM portfolio_about LIMIT 1);

-- =====================================================
-- DADOS INICIAIS - Skills
-- =====================================================
INSERT INTO portfolio_skills (name, icon, color, category, display_order) VALUES
  ('React.js', 'Code2', '#61DAFB', 'frontend', 0),
  ('Next.js', 'Zap', '#ffffff', 'frontend', 1),
  ('Node.js', 'Server', '#339933', 'backend', 2),
  ('TypeScript', 'FileCode', '#3178C6', 'frontend', 3),
  ('Python', 'Terminal', '#3776AB', 'backend', 4),
  ('PostgreSQL', 'Database', '#4169E1', 'database', 5),
  ('MongoDB', 'Leaf', '#47A248', 'database', 6),
  ('Docker', 'Box', '#2496ED', 'devops', 7),
  ('AWS', 'Cloud', '#FF9900', 'devops', 8),
  ('Git', 'GitBranch', '#F05032', 'devops', 9),
  ('TailwindCSS', 'Palette', '#06B6D4', 'frontend', 10),
  ('GraphQL', 'Share2', '#E10098', 'backend', 11)
ON CONFLICT DO NOTHING;

-- =====================================================
-- PRONTO! Banco configurado com sucesso.
-- =====================================================
