import { NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const {
      sessionId = null,
      fullName,
      email,
      phone = null,
      company = null,
      message = null,
      source = "inquiry_form",
    } = await req.json()

    if (!email || !fullName) {
      return NextResponse.json(
        { ok: false, error: "fullName and email are required" },
        { status: 400 }
      )
    }

    // Store as a minimal assessment submission with only contact fields filled
    await getSql()`
      INSERT INTO assessment_submissions (
        session_id, full_name, email, phone, company_name,
        three_month_goal, referral_source, consent_to_contact
      ) VALUES (
        ${sessionId},
        ${fullName},
        ${email},
        ${phone},
        ${company},
        ${message},
        ${source},
        TRUE
      )
    `

    if (sessionId) {
      await getSql()`
        INSERT INTO page_events (session_id, event_type, event_label, metadata)
        VALUES (${sessionId}, 'inquiry_submitted', 'contact', ${JSON.stringify({ email, company })})
      `
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[inquiry] error:", err)
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 })
  }
}
