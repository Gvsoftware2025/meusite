import { NextResponse } from "next/server"
import { query, queryOne } from "@/lib/db"

// GET - Buscar todos os dados do portfolio
export async function GET() {
  try {
    console.log("[v0] DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "NOT SET")
    
    const [about, skills, projects] = await Promise.all([
      queryOne(`SELECT * FROM meusite.portfolio_about ORDER BY created_at DESC LIMIT 1`),
      query(`SELECT * FROM meusite.portfolio_skills ORDER BY display_order ASC`),
      query(`SELECT * FROM meusite.portfolio_projects ORDER BY display_order ASC`),
    ])

    console.log("[v0] About:", about)
    console.log("[v0] Skills count:", skills?.length)
    console.log("[v0] Projects count:", projects?.length)

    return NextResponse.json({
      about: about || {
        title: "Sobre a GV Software",
        description: "Desenvolvimento de software de alta qualidade.",
        projects_count: 50,
        clients_count: 100,
        years_experience: 5,
      },
      skills: skills || [],
      projects: projects || [],
    })
  } catch (error) {
    console.error("Error fetching portfolio data:", error)
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 }
    )
  }
}
