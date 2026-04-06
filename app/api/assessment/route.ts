import { NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // All fields come straight from the assessment wizard's FormData shape
    const {
      sessionId = null,
      companyName = null,
      turnoverRange = null,
      city = null,
      state = null,
      industry = null,
      employeeCount = null,
      selectedProblems = [],
      problemDescriptions = {},
      problemLosses = {},
      currentSolutions = {},
      paybackPeriod = null,
      maxInvestment = null,
      monthlyBudget = null,
      desiredOutcomes = [],
      threeMonthGoal = null,
      primaryRole = null,
      decisionMaker = null,
      preferredChannels = [],
      implementationConstraints = [],
      timeline = null,
      fullName = null,
      designation = null,
      phone = null,
      whatsapp = null,
      email = null,
      consentToContact = false,
      wantsFreeAudit = false,
      referralSource = null,
    } = body

    if (!email || !fullName) {
      return NextResponse.json(
        { ok: false, error: "email and fullName are required" },
        { status: 400 }
      )
    }

    await getSql()`
      INSERT INTO assessment_submissions (
        session_id, company_name, turnover_range, city, state, industry,
        employee_count, selected_problems, problem_descriptions, problem_losses,
        current_solutions, payback_period, max_investment, monthly_budget,
        desired_outcomes, three_month_goal, primary_role, decision_maker,
        preferred_channels, implementation_constraints, timeline,
        full_name, designation, phone, whatsapp, email,
        consent_to_contact, wants_free_audit, referral_source
      ) VALUES (
        ${sessionId}, ${companyName}, ${turnoverRange}, ${city}, ${state}, ${industry},
        ${employeeCount}, ${selectedProblems}, ${JSON.stringify(problemDescriptions)},
        ${JSON.stringify(problemLosses)}, ${JSON.stringify(currentSolutions)},
        ${paybackPeriod}, ${maxInvestment}, ${monthlyBudget},
        ${desiredOutcomes}, ${threeMonthGoal}, ${primaryRole}, ${decisionMaker},
        ${preferredChannels}, ${implementationConstraints}, ${timeline},
        ${fullName}, ${designation}, ${phone}, ${whatsapp}, ${email},
        ${consentToContact}, ${wantsFreeAudit}, ${referralSource}
      )
    `

    if (sessionId) {
      await getSql()`
        INSERT INTO page_events (session_id, event_type, event_label, metadata)
        VALUES (${sessionId}, 'assessment_submitted', 'assessment',
          ${JSON.stringify({ email, companyName, problemCount: selectedProblems.length })})
      `
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[assessment] error:", err)
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 })
  }
}
