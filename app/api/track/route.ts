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

    // Detect device type from user agent
    const deviceType = userAgent
      ? /Mobile|Android|iPhone|iPad/i.test(userAgent)
        ? /iPad/i.test(userAgent)
          ? "tablet"
          : "mobile"
        : "desktop"
      : null

    if (type === "visit") {
      const { page, utm_source, utm_medium, utm_campaign } = data ?? {}

      // Atomic upsert: insert new visitor or update last_seen_at if exists
      await sql`
        INSERT INTO visitors (
          session_id, ip_address, user_agent, referrer,
          utm_source, utm_medium, utm_campaign, device_type
        )
        VALUES (
          ${sessionId}, ${ip}, ${userAgent}, ${referer ?? null},
          ${utm_source ?? null}, ${utm_medium ?? null}, ${utm_campaign ?? null},
          ${deviceType}
        )
        ON CONFLICT (session_id) DO UPDATE SET last_seen_at = NOW()
      `

      await sql`
        INSERT INTO page_events (session_id, event_type, event_label, metadata)
        VALUES (${sessionId}, 'page_view', ${page ?? "/"}, ${JSON.stringify({ userAgent, referer })})
      `
    }

    if (type === "event") {
      const { event_type, metadata } = data ?? {}

      await sql`
        INSERT INTO page_events (session_id, event_type, event_label, metadata)
        VALUES (${sessionId}, ${event_type ?? "generic"}, ${data?.page_path ?? "/"}, ${JSON.stringify(metadata ?? {})})
      `
    }

    if (type === "calendar_click") {
      const { source } = data ?? {}

      await sql`
        INSERT INTO calendar_clicks (session_id, source_label)
        VALUES (${sessionId}, ${source ?? "unknown"})
      `

      await sql`
        INSERT INTO page_events (session_id, event_type, event_label, metadata)
        VALUES (${sessionId}, 'calendar_click', ${source ?? "unknown"}, ${JSON.stringify(data ?? {})})
      `
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[track] error:", err)
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 })
  }
}
