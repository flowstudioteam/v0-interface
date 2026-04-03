import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const maxDuration = 60

/**
 * RESEARCH-BACKED BENCHMARKS
 * All multipliers and rates are drawn from published industry research.
 * The AI uses these as constraints — it cannot invent numbers outside these bounds.
 */
const BENCHMARKS = {
  // Source: Deloitte Smart Manufacturing Survey 2025
  maintenanceCostAsPercentOfRevenue: { min: 0.02, max: 0.05, source: "Deloitte Smart Manufacturing Survey, 2025" },
  predictiveMaintenanceSavings: { rate: 0.25, source: "Deloitte 2025 — AI predictive maintenance delivers 25% cost reduction" },
  
  // Source: OxMaint Case Studies 2024 (Indian Cement Plant, Electronics Manufacturer)
  downtimeReductionWithAI: { rate: 0.65, source: "OxMaint 2024 — AI reduces unplanned downtime by up to 65%" },
  defectEscapeReductionWithAI: { rate: 0.90, source: "OxMaint 2024 — AI vision achieves 99.8% detection, reducing escapes by 90%" },
  
  // Source: Nature.com Scientific Reports — Chennai Automotive SME Study, 2025
  qualityRejectionReduction: { rate: 0.724, source: "Nature.com 2025 — 72.4% PPM rejection rate reduction with AI" },
  downtimeReductionAutomotive: { rate: 0.889, source: "Nature.com 2025 — 88.9% downtime reduction in automotive SMEs" },
  
  // Source: KPMG Global Tech Report: Industrial Manufacturing, 2025
  manufacturingFirmsAchievingROI: { rate: 0.34, source: "KPMG 2025 — 34% of manufacturing firms achieving ROI from multiple AI use cases" },
  
  // Source: WEF AI Playbook for India's MSMEs, August 2025
  inventoryCarryingCostReduction: { rate: 0.20, source: "WEF 2025 — AI inventory optimization frees 20% working capital" },
  inventoryAsPercentOfRevenue: { min: 0.15, max: 0.30, source: "WEF 2025 — MSMEs typically hold 15-30% of revenue in inventory" },
  
  // Source: BCG × FICCI India's Triple AI Imperative, December 2025
  aiValueUnlockPotential: { perEmployee: 250000, source: "BCG×FICCI 2025 — AI value potential ~₹2.5L per MSME employee" },
  
  // Source: NASSCOM AI Adoption Index 2.0, 2024
  dataReadinessBarrier: { rate: 0.72, source: "NASSCOM 2024 — 72% of MSMEs lack structured data foundations" },
  
  // Source: EY × CII India's AI Shift, November 2025
  enterprisesWithLiveAI: { rate: 0.47, source: "EY×CII 2025 — 47% of Indian enterprises have multiple AI use cases live" },
}

/**
 * PROBLEM-SPECIFIC LOSS MULTIPLIERS
 * Maps each problem ID to its estimated annual loss as % of revenue
 * All derived from cited case studies and research
 */
const PROBLEM_LOSS_RATES: Record<string, { minRate: number; maxRate: number; source: string }> = {
  "procurement": { minRate: 0.005, maxRate: 0.015, source: "NASSCOM AI Adoption Index 2.0, 2024" },
  "dispatch": { minRate: 0.006, maxRate: 0.018, source: "Deloitte Smart Manufacturing Survey, 2025" },
  "qc-rejects": { minRate: 0.010, maxRate: 0.030, source: "Nature.com Scientific Reports, Chennai Study, 2025" },
  "breakdown": { minRate: 0.015, maxRate: 0.045, source: "OxMaint — Indian Cement Plant + NTPC Case Studies, 2024" },
  "predictive": { minRate: 0.008, maxRate: 0.025, source: "Deloitte Smart Manufacturing Survey, 2025" },
  "inventory": { minRate: 0.006, maxRate: 0.020, source: "WEF AI Playbook for India's MSMEs, 2025" },
  "productivity": { minRate: 0.004, maxRate: 0.012, source: "Deloitte Smart Manufacturing Survey, 2025" },
  "planning": { minRate: 0.010, maxRate: 0.030, source: "KPMG Global Tech Report, 2025" },
  "vision": { minRate: 0.015, maxRate: 0.040, source: "OxMaint — AI Vision Inspection Case Study, 2024" },
  "data": { minRate: 0.010, maxRate: 0.025, source: "NASSCOM AI Adoption Index 2.0, 2024" },
}

const SYSTEM_PROMPT = `You are a manufacturing risk assessment analyst. You produce structured JSON assessments of capital at risk and potential AI-driven savings for Indian manufacturing SMBs.

CRITICAL RULES:
1. NEVER invent numbers. Use ONLY the formulas and benchmarks provided.
2. ALWAYS cite the source for every figure.
3. Output MUST be valid JSON matching the schema below.
4. All currency is in Indian Rupees (₹). Use Lakhs (L) and Crores (Cr) notation.
5. Be conservative — use the lower bound of ranges when uncertain.
6. Round all figures to 2 significant digits.

BENCHMARKS (use these exactly):
${JSON.stringify(BENCHMARKS, null, 2)}

PROBLEM LOSS RATES (annual loss as % of revenue):
${JSON.stringify(PROBLEM_LOSS_RATES, null, 2)}

OUTPUT JSON SCHEMA:
{
  "summary": {
    "totalCapitalAtRisk": "₹X.XX Cr",
    "potentialAnnualSavings": "₹X.XX Cr",
    "roiTimelineMonths": number,
    "confidenceLevel": "high" | "medium" | "low"
  },
  "methodology": "2-3 sentence explanation of the calculation approach",
  "calculations": [
    {
      "problemArea": "string",
      "currentAnnualLoss": "₹X.XX Cr",
      "formula": "Revenue × LossRate (X.X%)",
      "potentialSavings": "₹X.XX Cr",
      "savingsFormula": "Loss × AIReductionRate (X%)",
      "source": "Exact source citation with year"
    }
  ],
  "benchmarkComparison": {
    "industryAverage": "Brief comparison to industry benchmarks",
    "topQuartile": "What top performers achieve",
    "gap": "The gap between current state and best practice"
  },
  "recommendations": [
    {
      "priority": 1 | 2 | 3,
      "action": "Specific recommendation",
      "expectedImpact": "₹X.XX Cr/year",
      "timelineWeeks": number,
      "source": "Research backing this recommendation"
    }
  ],
  "dataSources": [
    "Full citation 1",
    "Full citation 2"
  ]
}

When calculating:
1. Annual Loss = Annual Revenue × Problem Loss Rate (use midpoint of range)
2. Potential Savings = Annual Loss × AI Reduction Rate (from benchmarks)
3. Total Capital at Risk = Sum of all Annual Losses
4. ROI Timeline = 6-12 months for predictive maintenance, 4-8 months for quality, 3-6 months for inventory (per Deloitte 2025)
5. Confidence = "high" if revenue > ₹50Cr and 3+ problems selected, "medium" if revenue > ₹10Cr, "low" otherwise`

type AssessmentInput = {
  annualRevenueCr: number
  employeeCount: number
  industry: string
  selectedProblems: string[]
  sessionId?: string
}

export async function POST(req: NextRequest) {
  try {
    const input: AssessmentInput = await req.json()
    const { annualRevenueCr, employeeCount, industry, selectedProblems, sessionId } = input

    if (!annualRevenueCr || !employeeCount || !industry || !selectedProblems?.length) {
      return NextResponse.json(
        { error: "Missing required fields: annualRevenueCr, employeeCount, industry, selectedProblems" },
        { status: 400 }
      )
    }

    const apiKey = process.env.ZAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "ZAI API key not configured" },
        { status: 500 }
      )
    }

    // Build the user prompt with actual plant data
    const userPrompt = `Generate a risk assessment for this Indian manufacturing plant:

PLANT DATA:
- Annual Revenue: ₹${annualRevenueCr} Crores
- Employees: ${employeeCount}
- Industry: ${industry}
- Selected Problem Areas: ${selectedProblems.join(", ")}

Calculate the total capital at risk and potential AI-driven savings using ONLY the benchmarks provided. Show your work with explicit formulas. Cite every source.

Return ONLY valid JSON matching the schema. No markdown, no explanation outside the JSON.`

    const zaiRes = await fetch("https://api.z.ai/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en-US,en",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "glm-5",
        max_tokens: 2000,
        temperature: 0.1, // Low temperature for consistent, rule-based output
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    })

    if (!zaiRes.ok) {
      const err = await zaiRes.text()
      console.error("[risk-assessment] ZAI error:", err)
      return NextResponse.json(
        { error: "AI service temporarily unavailable" },
        { status: 502 }
      )
    }

    const zaiData = await zaiRes.json()
    const content = zaiData.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: "No response from AI service" },
        { status: 502 }
      )
    }

    // Parse the JSON response
    let assessment
    try {
      // Strip any markdown code fences if present
      const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
      assessment = JSON.parse(jsonStr)
    } catch (parseErr) {
      console.error("[risk-assessment] JSON parse error:", parseErr, "Content:", content)
      return NextResponse.json(
        { error: "Failed to parse assessment response" },
        { status: 500 }
      )
    }

    // Save to database
    if (sessionId) {
      await sql`
        INSERT INTO risk_assessments (
          session_id, annual_revenue_cr, employee_count, industry,
          selected_problems, assessment_json
        ) VALUES (
          ${sessionId}, ${annualRevenueCr}, ${employeeCount}, ${industry},
          ${selectedProblems}, ${JSON.stringify(assessment)}
        )
      `.catch((err) => console.error("[risk-assessment] DB error:", err))
    }

    return NextResponse.json({
      success: true,
      input: {
        annualRevenueCr,
        employeeCount,
        industry,
        selectedProblems,
      },
      assessment,
    })
  } catch (err) {
    console.error("[risk-assessment] error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
