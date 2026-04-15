const { Pool } = require('pg')

const pool = new Pool({
  host: '168.231.93.220',
  port: 5432,
  database: 'gvsoftware',
  user: 'gvuser',
  password: '153045',
})

async function checkStructure() {
  const client = await pool.connect()
  try {
    // Check portfolio_projects columns
    const projectsCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'meusite' AND table_name = 'portfolio_projects'
      ORDER BY ordinal_position
    `)
    console.log('=== portfolio_projects columns ===')
    projectsCols.rows.forEach(r => console.log(`  ${r.column_name}: ${r.data_type}`))

    // Check portfolio_about columns
    const aboutCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'meusite' AND table_name = 'portfolio_about'
      ORDER BY ordinal_position
    `)
    console.log('\n=== portfolio_about columns ===')
    aboutCols.rows.forEach(r => console.log(`  ${r.column_name}: ${r.data_type}`))

    // Check portfolio_skills columns
    const skillsCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'meusite' AND table_name = 'portfolio_skills'
      ORDER BY ordinal_position
    `)
    console.log('\n=== portfolio_skills columns ===')
    skillsCols.rows.forEach(r => console.log(`  ${r.column_name}: ${r.data_type}`))

    // Check sample data
    const projects = await client.query('SELECT * FROM meusite.portfolio_projects LIMIT 2')
    console.log('\n=== Sample projects ===')
    console.log(JSON.stringify(projects.rows, null, 2))

  } finally {
    client.release()
    await pool.end()
  }
}

checkStructure().catch(console.error)
