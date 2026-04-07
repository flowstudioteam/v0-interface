import { NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const sql = getSql()

    // Insert survey response into database
    await sql`
      INSERT INTO survey_responses (
        session_id,
        survey_type,
        company_name,
        industry,
        company_size,
        employee_count,
        annual_revenue_range,
        location_state,
        readiness_scores,
        pain_points,
        current_automation_level,
        data_collection_maturity,
        is_complete,
        completed_at
      )
      VALUES (
        ${data.sessionId || null},
        ${data.surveyType},
        ${data.companyProfile?.company_name || null},
        ${data.companyProfile?.industry || null},
        ${data.companyProfile?.company_size || null},
        ${data.companyProfile?.employee_count || null},
        ${data.companyProfile?.annual_revenue_range || null},
        ${data.companyProfile?.location_state || null},
        ${JSON.stringify(data.readinessScores)},
        ${JSON.stringify(data.painPoints)},
        ${data.currentState?.automation_level || null},
        ${data.currentState?.data_collection_maturity || null},
        true,
        NOW()
      )
    `

    return NextResponse.json({
      success: true,
      message: "Assessment submitted successfully",
    })
  } catch (error) {
    console.error("[survey] submission error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to submit assessment" },
      { status: 500 }
    )
  }
}
