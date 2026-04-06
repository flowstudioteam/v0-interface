import { NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export async function GET() {
  try {
    const sql = getSql()

    // Retrieve published, verified case studies
    const caseStudies = await sql`
      SELECT 
        id,
        company_name,
        location_city,
        location_state,
        title,
        challenge_summary,
        solution_description,
        outcome_summary,
        payback_period_months,
        efficiency_gain_percent,
        cost_reduction_percent,
        quality_improvement_percent,
        roi_percent,
        is_featured
      FROM case_studies
      WHERE is_published = true
        AND verification_status = 'verified'
      ORDER BY is_featured DESC, roi_percent DESC NULLS LAST
      LIMIT 12
    ` as any[]

    return NextResponse.json({
      caseStudies: caseStudies.map(cs => ({
        id: cs.id,
        company_name: cs.company_name,
        location_city: cs.location_city,
        location_state: cs.location_state,
        title: cs.title,
        challenge_summary: cs.challenge_summary,
        solution_description: cs.solution_description,
        outcome_summary: cs.outcome_summary,
        payback_period_months: cs.payback_period_months,
        efficiency_gain_percent: cs.efficiency_gain_percent,
        cost_reduction_percent: cs.cost_reduction_percent,
        quality_improvement_percent: cs.quality_improvement_percent,
        roi_percent: cs.roi_percent,
      })),
    })
  } catch (error) {
    console.error("[case-studies] error:", error)
    return NextResponse.json({ caseStudies: [] }, { status: 500 })
  }
}
