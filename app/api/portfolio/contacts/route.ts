import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// POST - Salvar nova mensagem de contato
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, company, email, phone, subject, budget, deadline, message } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nome e email sao obrigatorios" },
        { status: 400 }
      )
    }

    await query(
      `INSERT INTO portfolio_contacts (name, company, email, phone, subject, budget, deadline, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [name, company || "", email, phone || "", subject || "", budget || "", deadline || "", message || ""]
    )

    return NextResponse.json({ success: true, message: "Mensagem enviada com sucesso!" })
  } catch (error) {
    console.error("Error saving contact:", error)
    return NextResponse.json(
      { error: "Falha ao enviar mensagem" },
      { status: 500 }
    )
  }
}
