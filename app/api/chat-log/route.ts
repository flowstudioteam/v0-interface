import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, question, answer, questionType } = body

    if (!question) {
      return NextResponse.json({ ok: false, error: "question is required" }, { status: 400 })
    }

    await sql`
      INSERT INTO chat_interactions (session_id, question, answer, question_type)
      VALUES (${sessionId ?? null}, ${question}, ${answer ?? null}, ${questionType ?? "custom"})
    `

    if (sessionId) {
      await sql`
        INSERT INTO page_events (session_id, event_type, page_path, metadata)
        VALUES (${sessionId}, 'chat_question', '/', ${JSON.stringify({ question: question.slice(0, 100), questionType })})
      `
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[chat-log] error:", err)
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 })
  }
}
