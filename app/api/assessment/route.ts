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

    // Insert into assessment_submissions matching the actual schema columns
    await sql`
      INSERT INTO assessment_submissions (
        session_id,
        company_name,
        full_name,
        email,
        phone,
        industry,
        employee_count,
        turnover_range,
        city,
        selected_problems,
        monthly_budget,
        max_investment,
        payback_period,
        desired_outcomes,
        timeline,
        primary_role,
        decision_maker,
        preferred_channels,
        consent_to_contact,
        wants_free_audit,
        referral_source
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
        ${problems ?? []},
        ${budgetRange ?? null},
        ${expectedRoi ?? null},
        ${timeline ?? null},
        ${outcomes ?? []},
        ${timeline ?? null},
        ${rawAnswers?.primaryRole ?? null},
        ${decisionMakers ?? null},
        ${workingStyle ? [workingStyle] : []},
        TRUE,
        ${rawAnswers?.wantsFreeAudit ?? false},
        ${rawAnswers?.referralSource ?? null}
      )
    `

    // Log the submission as a page event for unified analytics
    if (sessionId) {
      await sql`
        INSERT INTO page_events (session_id, event_type, event_label, metadata)
        VALUES (${sessionId}, 'assessment_submitted', 'assessment', ${JSON.stringify({ email, companyName })})
      `
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[assessment] error:", err)
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 })
  }
}
