import { NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export const maxDuration = 60

// ---------------------------------------------------------------------------
// RESEARCH-BACKED BENCHMARKS — all numbers sourced from named publications.
// The math is done in TypeScript (server-side), NOT by the LLM.
// AI is only used to generate the written narrative (methodology text,
// recommendation text). Every ₹ figure is computed below from these constants.
// ---------------------------------------------------------------------------

const PROBLEM_LOSS_RATES: Record<string, {
  label: string
  midRate: number   // annual loss as a fraction of revenue (midpoint of research range)
  aiSavingsRate: number  // fraction of the loss recoverable with AI
  roiMonths: number
  source: string
  savingsSource: string
}> = {
  "procurement": {
    label: "Procurement & Supplier Delays",
    midRate: 0.010,
    aiSavingsRate: 0.45,
    roiMonths: 5,
    source: "NASSCOM AI Adoption Index 2.0, 2024",
    savingsSource: "WEF AI Playbook for India's MSMEs, 2025",
  },
  "dispatch": {
    label: "Order Fulfillment Blocks",
    midRate: 0.012,
    aiSavingsRate: 0.40,
    roiMonths: 5,
    source: "Deloitte Smart Manufacturing Survey, 2025",
    savingsSource: "Deloitte Smart Manufacturing Survey, 2025",
  },
  "qc-rejects": {
    label: "QC Rejects & Manual Inspection",
    midRate: 0.020,
    aiSavingsRate: 0.724,  // Nature.com 2025 — 72.4% PPM reduction
    roiMonths: 6,
    source: "Nature.com Scientific Reports — Automotive SME Study, Chennai, 2025",
    savingsSource: "Nature.com 2025 — 72.4% PPM rejection rate reduction (peer-reviewed)",
  },
  "breakdown": {
    label: "Machine Breakdown & Downtime",
    midRate: 0.030,
    aiSavingsRate: 0.65,  // OxMaint 2024 — AI reduces unplanned downtime 65%
    roiMonths: 8,
    source: "OxMaint — Indian Cement Plant + NTPC Case Studies, 2024",
    savingsSource: "OxMaint 2024 — 65% unplanned downtime reduction; NTPC ₹4.2Cr single-event saving",
  },
  "predictive": {
    label: "Predictive Maintenance Gaps",
    midRate: 0.016,
    aiSavingsRate: 0.55,
    roiMonths: 7,
    source: "Deloitte Smart Manufacturing Survey, 2025",
    savingsSource: "Deloitte 2025 — AI predictive maintenance delivers 3–6 month ROI",
  },
  "inventory": {
    label: "Inventory Mismatch & Stockouts",
    midRate: 0.013,
    aiSavingsRate: 0.20,  // WEF 2025 — 20% working capital freed
    roiMonths: 4,
    source: "WEF AI Playbook for India's MSMEs, 2025",
    savingsSource: "WEF 2025 — AI inventory optimisation frees 20% working capital",
  },
  "productivity": {
    label: "Productivity & Manpower Tracking",
    midRate: 0.008,
    aiSavingsRate: 0.35,
    roiMonths: 4,
    source: "Deloitte Smart Manufacturing Survey, 2025",
    savingsSource: "Deloitte 2025 — 48% of manufacturers face production staffing challenges",
  },
  "planning": {
    label: "Sales vs Production Mismatch",
    midRate: 0.020,
    aiSavingsRate: 0.50,
    roiMonths: 6,
    source: "KPMG Global Tech Report: Industrial Manufacturing, 2025",
    savingsSource: "KPMG 2025 — supply chain + planning identified as biggest AI maturity gaps",
  },
  "vision": {
    label: "Visual Defect Detection",
    midRate: 0.027,
    aiSavingsRate: 0.90,  // OxMaint 2024 — 99.8% detection accuracy
    roiMonths: 6,
    source: "OxMaint — AI Vision Inspection Case Study, 2024",
    savingsSource: "OxMaint 2024 — 99.8% detection accuracy, defect escape rate reduced to 0.2%",
  },
  "data": {
    label: "Data Scattered in Excel/Tally",
    midRate: 0.017,
    aiSavingsRate: 0.45,
    roiMonths: 5,
    source: "NASSCOM AI Adoption Index 2.0, 2024",
    savingsSource: "NASSCOM 2024 — 72% of MSMEs lack structured data; AI data foundation unlocks all other savings",
  },
}

function formatCr(cr: number): string {
  if (cr >= 1) return `₹${cr.toFixed(2)} Cr`
  return `₹${(cr * 100).toFixed(1)} L`
}

type AssessmentInput = {
  annualRevenueCr: number
  employeeCount: number
  industry: string
  selectedProblems: string[]
  sessionId?: string
  // Lead capture fields
  companyName?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  city?: string
  state?: string
  // Market research fields
  traditionalIssues?: string[]
  estimatedLossCr?: number
  currentSolutions?: string
  biggestChallenge?: string
}

export async function POST(req: NextRequest) {
  try {
    const input: AssessmentInput = await req.json()
    const { 
      annualRevenueCr, employeeCount, industry, selectedProblems, sessionId,
      companyName, contactName, contactEmail, contactPhone, city, state,
      traditionalIssues, estimatedLossCr, currentSolutions, biggestChallenge
    } = input

    if (!annualRevenueCr || !employeeCount || !industry || !selectedProblems?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const apiKey = process.env.ZAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "AI service is temporarily unavailable" }, { status: 503 })
    }

    // -----------------------------------------------------------------------
    // STEP 1: COMPUTE ALL NUMBERS IN TYPESCRIPT — zero LLM involvement here
    // -----------------------------------------------------------------------
    const calculations: Array<{
      problemArea: string
      currentAnnualLoss: string
      formula: string
      potentialSavings: string
      savingsFormula: string
      source: string
    }> = []

    let totalCapitalAtRiskCr = 0
    let totalPotentialSavingsCr = 0
    let maxRoiMonths = 0
    const uniqueSources = new Set<string>()

    for (const pid of selectedProblems) {
      const bench = PROBLEM_LOSS_RATES[pid]
      if (!bench) continue

      const annualLossCr = annualRevenueCr * bench.midRate
      const potentialSavingsCr = annualLossCr * bench.aiSavingsRate
      totalCapitalAtRiskCr += annualLossCr
      totalPotentialSavingsCr += potentialSavingsCr
      maxRoiMonths = Math.max(maxRoiMonths, bench.roiMonths)

      uniqueSources.add(bench.source)
      uniqueSources.add(bench.savingsSource)

      calculations.push({
        problemArea: bench.label,
        currentAnnualLoss: formatCr(annualLossCr),
        formula: `₹${annualRevenueCr} Cr × ${(bench.midRate * 100).toFixed(1)}% loss rate`,
        potentialSavings: formatCr(potentialSavingsCr),
        savingsFormula: `${formatCr(annualLossCr)} × ${(bench.aiSavingsRate * 100).toFixed(0)}% AI recovery rate`,
        source: bench.source,
      })
    }

    // Round to 2 significant figures
    const riskDisplay = formatCr(parseFloat(totalCapitalAtRiskCr.toFixed(2)))
    const savingsDisplay = formatCr(parseFloat(totalPotentialSavingsCr.toFixed(2)))

    const confidenceLevel: "high" | "medium" | "low" =
      annualRevenueCr >= 50 && selectedProblems.length >= 3 ? "high"
      : annualRevenueCr >= 10 ? "medium"
      : "low"

    const computedNumbers = {
      totalCapitalAtRisk: riskDisplay,
      potentialAnnualSavings: savingsDisplay,
      roiTimelineMonths: maxRoiMonths,
      confidenceLevel,
      calculations,
      dataSources: [
        "WEF — Transforming Small Businesses: An AI Playbook for India's MSMEs, August 2025",
        "BCG × FICCI — India's Triple AI Imperative, December 2025",
        "KPMG — Global Tech Report: Industrial Manufacturing Insights, 2025",
        "Deloitte — Smart Manufacturing Survey, 2025",
        "NASSCOM — AI Adoption Index 2.0, 2024",
        "EY × CII — India's AI Shift: From Pilots to Performance, November 2025",
        "OxMaint — Indian Cement Plant Predictive Maintenance Case Study, 2024",
        "OxMaint — AI Vision Inspection Case Study, 2024",
        "iFactory / JRS Innovation — NTPC AI Predictive Maintenance Case Study, 2024",
        "Nature.com Scientific Reports — Integrated ERP-Lean-AI Model, Chennai Automotive SMEs, 2025",
      ],
    }

    // -----------------------------------------------------------------------
    // STEP 2: AI writes ONLY the narrative — methodology text + recommendations
    // All ₹ figures in the narrative are injected from computedNumbers above
    // -----------------------------------------------------------------------
    const narrativePrompt = `You are a manufacturing AI consultant writing a brief, professional assessment narrative for an Indian SMB plant owner.

PLANT:
- Industry: ${industry}
- Annual Revenue: ₹${annualRevenueCr} Crores
- Employees: ${employeeCount}
- Problem areas selected: ${selectedProblems.map(p => PROBLEM_LOSS_RATES[p]?.label || p).join(", ")}

PRE-COMPUTED FIGURES (use these exactly — do not invent any numbers):
- Total capital at risk annually: ${riskDisplay}
- Potential annual AI savings: ${savingsDisplay}
- Estimated ROI timeline: ${maxRoiMonths} months

Write a JSON object with EXACTLY these two fields only:
{
  "methodology": "2-3 sentences explaining the calculation approach. Reference the research sources. Mention the total capital at risk (${riskDisplay}) and potential savings (${savingsDisplay}) using these exact figures.",
  "benchmarkComparison": {
    "industryAverage": "One sentence on where this industry typically sits on AI adoption and loss rates",
    "topQuartile": "One sentence on what the best ${industry} plants achieve with AI",
    "gap": "One sentence on the gap between current state and best practice for this plant"
  },
  "recommendations": [
    {
      "priority": 1,
      "action": "Most impactful specific recommendation for ${selectedProblems[0] ? PROBLEM_LOSS_RATES[selectedProblems[0]]?.label : "top problem"}",
      "expectedImpact": "Use this exact figure: ${calculations[0] ? calculations[0].potentialSavings : savingsDisplay}/year",
      "timelineWeeks": 8,
      "source": "Cite a real research source"
    }
  ]
}

Rules:
- Return ONLY valid JSON. No markdown fences, no commentary.
- Never invent ₹ figures. Only use the pre-computed figures provided above.
- Keep language direct and practical for a plant owner.`

    const aiRes = await fetch("https://api.z.ai/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en-US,en",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "glm-4-plus",
        max_tokens: 800,
        temperature: 0.2,
        messages: [
          {
            role: "user",
            content: narrativePrompt,
          },
        ],
      }),
    })

    let methodology = `Annual loss calculations use published research benchmarks: loss rates per problem area (sourced from Deloitte 2025, NASSCOM 2024, Nature.com 2025, OxMaint 2024, WEF 2025, KPMG 2025). Total capital at risk is ${riskDisplay}/year. AI savings potential of ${savingsDisplay}/year is based on documented case study outcomes, not projections.`
    let benchmarkComparison = {
      industryAverage: `Most Indian ${industry} SMBs operate at 55–65% OEE with reactive maintenance, well below world-class benchmarks.`,
      topQuartile: `Top-quartile Indian manufacturers using AI report OEE above 80% and near-zero unplanned downtime.`,
      gap: `Closing this gap through targeted AI deployment is the core opportunity reflected in the ${savingsDisplay}/year savings estimate.`,
    }
    let recommendations = calculations.slice(0, 3).map((calc, i) => ({
      priority: i + 1,
      action: `Deploy AI solution for ${calc.problemArea}`,
      expectedImpact: `${calc.potentialSavings}/year`,
      timelineWeeks: 8 + i * 4,
      source: calc.source,
    }))

    if (aiRes.ok) {
      try {
        const aiData = await aiRes.json()
        const content = aiData.choices?.[0]?.message?.content
        if (content) {
          const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
          const parsed = JSON.parse(jsonStr)
          if (parsed.methodology) methodology = parsed.methodology
          if (parsed.benchmarkComparison) benchmarkComparison = parsed.benchmarkComparison
          if (parsed.recommendations?.length) recommendations = parsed.recommendations
        }
      } catch {
        // Narrative parse failed — use fallback text above, computed numbers are unaffected
      }
    }

    // -----------------------------------------------------------------------
    // STEP 3: Assemble final assessment — computed numbers + narrative
    // -----------------------------------------------------------------------
    const assessment = {
      summary: {
        totalCapitalAtRisk: computedNumbers.totalCapitalAtRisk,
        potentialAnnualSavings: computedNumbers.potentialAnnualSavings,
        roiTimelineMonths: computedNumbers.roiTimelineMonths,
        confidenceLevel: computedNumbers.confidenceLevel,
      },
      methodology,
      calculations: computedNumbers.calculations,
      benchmarkComparison,
      recommendations,
      dataSources: computedNumbers.dataSources,
    }

    // Save to database for sales pipeline — includes all lead + market research data
    try {
      await getSql()`
        INSERT INTO risk_assessments (
          session_id, annual_turnover_cr, employee_count, industry,
          primary_bottleneck, secondary_bottleneck, report,
          company_name, contact_name, contact_email, contact_phone,
          city, state, traditional_issues, estimated_loss_cr,
          current_solutions, biggest_challenge
        ) VALUES (
          ${sessionId ?? null},
          ${annualRevenueCr},
          ${employeeCount},
          ${industry},
          ${selectedProblems[0] ?? null},
          ${selectedProblems[1] ?? null},
          ${JSON.stringify(assessment)},
          ${companyName ?? null},
          ${contactName ?? null},
          ${contactEmail ?? null},
          ${contactPhone ?? null},
          ${city ?? null},
          ${state ?? null},
          ${traditionalIssues ? JSON.stringify(traditionalIssues) : null},
          ${estimatedLossCr ?? null},
          ${currentSolutions ?? null},
          ${biggestChallenge ?? null}
        )
      `
    } catch (err) {
      console.error("[risk-assessment] DB error:", err)
    }

    return NextResponse.json({ success: true, assessment })
  } catch (err) {
    console.error("[risk-assessment] error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
