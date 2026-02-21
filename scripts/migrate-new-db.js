const SUPABASE_URL = 'https://mgqmnfiyehlnneersxne.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncW1uZml5ZWhsbm5lZXJzeG5lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDM1NzE4MCwiZXhwIjoyMDc5OTMzMTgwfQ.65YXG2pf0EUuMl3GzrvpeWUWq0b2ovgGoI8xldOvzUA'

async function runSQL(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ sql_query: sql })
  })
  
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`SQL error: ${res.status} - ${text}`)
  }
  return true
}

// Since we can't run raw SQL via PostgREST, let's create tables via the Supabase client
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// Test the connection first
async function testConnection() {
  const { data, error } = await supabase.from('portfolio_skills').select('count').limit(1)
  if (error && error.code === '42P01') {
    console.log('Table portfolio_skills does not exist yet - need to create tables.')
    return false
  }
  if (error) {
    console.log('Connection test result:', error.message)
    return false
  }
  console.log('Tables already exist!')
  return true
}

async function main() {
  console.log('Testing connection to new Supabase...')
  const exists = await testConnection()
  
  if (exists) {
    console.log('Tables already exist. Checking if skills data needs to be seeded...')
    const { data } = await supabase.from('portfolio_skills').select('*')
    if (!data || data.length === 0) {
      console.log('Seeding skills data...')
      await seedSkills()
    } else {
      console.log(`Skills already seeded (${data.length} records)`)
    }
    return
  }

  console.log('\n========================================')
  console.log('Tables need to be created!')
  console.log('Please run the SQL in scripts/001-create-all-tables.sql')
  console.log('directly in the Supabase SQL Editor at:')
  console.log(`${SUPABASE_URL.replace('.supabase.co', '')}/project/mgqmnfiyehlnneersxne/sql`)
  console.log('Or at: https://supabase.com/dashboard/project/mgqmnfiyehlnneersxne/sql')
  console.log('========================================\n')
}

async function seedSkills() {
  const skills = [
    { name: 'React.js', icon: 'Code2', color: '#61DAFB', category: 'frontend', display_order: 0 },
    { name: 'Next.js', icon: 'Zap', color: '#ffffff', category: 'frontend', display_order: 1 },
    { name: 'Node.js', icon: 'Server', color: '#339933', category: 'backend', display_order: 2 },
    { name: 'TypeScript', icon: 'FileCode', color: '#3178C6', category: 'frontend', display_order: 3 },
    { name: 'Python', icon: 'Terminal', color: '#3776AB', category: 'backend', display_order: 4 },
    { name: 'PostgreSQL', icon: 'Database', color: '#4169E1', category: 'database', display_order: 5 },
    { name: 'MongoDB', icon: 'Leaf', color: '#47A248', category: 'database', display_order: 6 },
    { name: 'Docker', icon: 'Container', color: '#2496ED', category: 'devops', display_order: 7 },
    { name: 'AWS', icon: 'Cloud', color: '#FF9900', category: 'devops', display_order: 8 },
    { name: 'Git', icon: 'GitBranch', color: '#F05032', category: 'devops', display_order: 9 },
    { name: 'TailwindCSS', icon: 'Palette', color: '#06B6D4', category: 'frontend', display_order: 10 },
    { name: 'GraphQL', icon: 'Share2', color: '#E10098', category: 'backend', display_order: 11 },
  ]

  const { error } = await supabase.from('portfolio_skills').insert(skills)
  if (error) {
    console.error('Error seeding skills:', error.message)
  } else {
    console.log('Skills seeded successfully!')
  }
}

main().catch(console.error)
