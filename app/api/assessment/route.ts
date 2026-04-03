import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      sessionId,
      companyName,
      contactName,
      email,
      phone,
      industry,
      companySize,
      annualRevenue,
      location,
      problems,
      budgetRange,
      expectedRoi,
      timeline,
      currentTools,
      decisionMakers,
      outcomes,
      workingStyle,
      rawAnswers,
    } = body

    if (!email || !contactName) {
      return NextResponse.json(
        { ok: false, error: "email and contactName are required" },
        { status: 400 }
      )
    }

    // Update visitor record with identified info
    if (sessionId) {
      await sql`
        UPDATE visitors
        SET email = ${email}, name = ${contactName}, company = ${companyName ?? null}, is_identified = TRUE
        WHERE session_id = ${sessionId}
      `
    }

    await sql`
      INSERT INTO assessment_submissions (
        session_id,
        company_name,
        contact_name,
        email,
        phone,
        industry,
        company_size,
        annual_revenue,
        location,
        problems,
        budget_range,
        expected_roi,
        timeline,
        current_tools,
        decision_makers,
        outcomes,
        working_style,
        raw_answers
      ) VALUES (
        ${sessionId ?? null},
        ${companyName ?? null},
        ${contactName},
        ${email},
        ${phone ?? null},
        ${industry ?? null},
        ${companySize ?? null},
        ${annualRevenue ?? null},
        ${location ?? null},
        ${JSON.stringify(problems ?? [])},
        ${budgetRange ?? null},
        ${expectedRoi ?? null},
        ${timeline ?? null},
        ${currentTools ?? null},
        ${decisionMakers ?? null},
        ${JSON.stringify(outcomes ?? [])},
        ${workingStyle ?? null},
        ${JSON.stringify(rawAnswers ?? {})}
      )
    `

    // Log event
    if (sessionId) {
      await sql`
        INSERT INTO page_events (session_id, event_type, page_path, metadata)
        VALUES (${sessionId}, 'assessment_submitted', '/', ${JSON.stringify({ email, companyName })})
      `
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[assessment] error:", err)
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 })
  }
}
