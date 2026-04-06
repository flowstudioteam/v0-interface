import { NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export async function GET() {
  try {
    const sql = getSql()

    // Retrieve AI adoption and benchmark data by Indian state
    const benchmarks = await sql`
      SELECT DISTINCT
        state,
        metric_name,
        metric_value,
        metric_unit,
        year
      FROM industry_benchmarks
      WHERE state IS NOT NULL
        AND state != 'India'
        AND confidence_level IN ('high', 'medium')
        AND year >= 2023
      ORDER BY state, metric_name
      LIMIT 100
    ` as any[]

    // Aggregate by state with key metrics
    const stateMap = new Map<string, any>()
    
    benchmarks.forEach(b => {
      if (!stateMap.has(b.state)) {
        stateMap.set(b.state, {
          state: b.state,
          metrics: [],
          description: '',
        })
      }
      
      const state = stateMap.get(b.state)
      state.metrics.push({
        name: b.metric_name,
        value: `${b.metric_value} ${b.metric_unit}`,
      })
    })

    // Add regional descriptions for key states
    const descriptions: { [key: string]: string } = {
      'Karnataka': 'Leading AI adoption hub with strong automotive and IT sectors. 32% AI adoption rate in manufacturing.',
      'Tamil Nadu': 'Emerging AI manufacturing hub with focus on electronics and precision components. Tamil Nadu Electronics Policy 2021 supports AI investments.',
      'Gujarat': 'Industrial powerhouse with textile and chemical sectors. Government promoting Industry 4.0 initiatives.',
      'Maharashtra': 'Largest manufacturing base with automotive, pharmaceuticals, and machinery sectors.',
      'Telangana': 'Tech-forward state with growing manufacturing AI presence, especially in electronics and IoT.',
      'Haryana': 'Auto and equipment manufacturing hub near Delhi with increasing AI adoption.',
      'Uttar Pradesh': 'Significant MSME base with potential for AI-led productivity improvements.',
      'Rajasthan': 'Mining, marble, and leather industries exploring AI applications for quality and efficiency.',
    }

    const insights = Array.from(stateMap.values()).map(state => ({
      ...state,
      description: descriptions[state.state] || `AI and manufacturing landscape of ${state.state}.`,
    }))

    return NextResponse.json({
      insights: insights.sort((a, b) => a.state.localeCompare(b.state)),
    })
  } catch (error) {
    console.error("[regional-insights] error:", error)
    return NextResponse.json({ insights: [] }, { status: 500 })
  }
}
