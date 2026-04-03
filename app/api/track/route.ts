import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, sessionId, data } = body

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown"
    const userAgent = req.headers.get("user-agent") ?? "unknown"
    const referer = req.headers.get("referer") ?? null

    if (type === "visit") {
      // Upsert visitor record
      const { page, utm_source, utm_medium, utm_campaign } = data ?? {}

      await sql`
        INSERT INTO visitors (session_id, ip_address, user_agent, referrer, landing_page, utm_source, utm_medium, utm_campaign)
        VALUES (${sessionId}, ${ip}, ${userAgent}, ${referer}, ${page ?? "/"}, ${utm_source ?? null}, ${utm_medium ?? null}, ${utm_campaign ?? null})
        ON CONFLICT (session_id) DO UPDATE
          SET last_seen_at = NOW(),
              page_views = visitors.page_views + 1
      `

      // Log page event
      await sql`
        INSERT INTO page_events (session_id, event_type, page_path, metadata)
        VALUES (${sessionId}, 'pageview', ${page ?? "/"}, ${JSON.stringify({ userAgent, referer })})
      `
    }

    if (type === "event") {
      const { event_type, page_path, metadata } = data ?? {}

      await sql`
        INSERT INTO page_events (session_id, event_type, page_path, metadata)
        VALUES (${sessionId}, ${event_type}, ${page_path ?? "/"}, ${JSON.stringify(metadata ?? {})})
      `
    }

    if (type === "calendar_click") {
      const { source, page_path } = data ?? {}

      await sql`
        INSERT INTO calendar_clicks (session_id, source, page_path)
        VALUES (${sessionId}, ${source ?? "unknown"}, ${page_path ?? "/"})
      `

      await sql`
        INSERT INTO page_events (session_id, event_type, page_path, metadata)
        VALUES (${sessionId}, 'calendar_click', ${page_path ?? "/"}, ${JSON.stringify({ source })})
      `
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[track] error:", err)
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 })
  }
}
