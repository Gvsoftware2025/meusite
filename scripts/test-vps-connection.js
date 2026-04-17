const { Client } = require('pg')

const client = new Client({
  host: '168.231.93.220',
  port: 5432,
  database: 'gvsoftware',
  user: 'gvuser',
  password: '153045',
  connectionTimeoutMillis: 10000,
})

async function testConnection() {
  try {
    console.log('Conectando ao PostgreSQL na VPS...')
    await client.connect()
    console.log('Conexao bem sucedida!\n')

    // Verificar tabelas existentes
    const tables = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `)
    console.log('Tabelas encontradas:')
    tables.rows.forEach(t => console.log('  -', t.tablename))
    console.log('')

    // Verificar dados em portfolio_about
    const about = await client.query('SELECT * FROM portfolio_about LIMIT 1')
    console.log('portfolio_about:', about.rows.length > 0 ? 'Tem dados' : 'Vazia')
    if (about.rows[0]) {
      console.log('  - Titulo:', about.rows[0].title)
      console.log('  - Projetos:', about.rows[0].projects_count)
      console.log('  - Clientes:', about.rows[0].clients_count)
      console.log('  - Anos:', about.rows[0].years_experience)
    }
    console.log('')

    // Verificar dados em portfolio_skills
    const skills = await client.query('SELECT name, icon, color, category FROM portfolio_skills ORDER BY display_order')
    console.log('portfolio_skills:', skills.rows.length, 'habilidades')
    skills.rows.forEach(s => console.log('  -', s.name, `(${s.icon}, ${s.color})`))
    console.log('')

    // Verificar dados em portfolio_projects
    const projects = await client.query('SELECT title, is_featured FROM portfolio_projects ORDER BY display_order')
    console.log('portfolio_projects:', projects.rows.length, 'projetos')
    projects.rows.forEach(p => console.log('  -', p.title, p.is_featured ? '(destaque)' : ''))
    console.log('')

    // Verificar dados em portfolio_contacts
    const contacts = await client.query('SELECT name, email, is_read, created_at FROM portfolio_contacts ORDER BY created_at DESC')
    console.log('portfolio_contacts:', contacts.rows.length, 'mensagens')
    contacts.rows.forEach(c => console.log('  -', c.name, `<${c.email}>`, c.is_read ? '(lida)' : '(nao lida)'))

    console.log('\n--- BANCO DE DADOS FUNCIONANDO CORRETAMENTE ---')

  } catch (error) {
    console.error('ERRO:', error.message)
  } finally {
    await client.end()
  }
}

testConnection()
