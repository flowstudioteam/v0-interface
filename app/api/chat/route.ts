import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, messages } = body

    if (!sessionId || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 })
    }

    // Insert each message in the exchange (user prompt + assistant reply)
    for (const msg of messages) {
      if (!msg.role || !msg.content) continue
      await sql`
        INSERT INTO chat_interactions (session_id, role, content, matched_faq)
        VALUES (
          ${sessionId},
          ${msg.role},
          ${msg.content},
          ${msg.matchedFaq ?? null}
        )
      `
    }

    // Log a single event for analytics roll-up
    await sql`
      INSERT INTO page_events (session_id, event_type, event_label, metadata)
      VALUES (
        ${sessionId},
        'chat_interaction',
        'ai_chat',
        ${JSON.stringify({ message_count: messages.length })}
      )
    `

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[chat] error:", err)
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 })
  }
}
