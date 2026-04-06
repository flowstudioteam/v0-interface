import { getSql } from "./db"

export interface KnowledgeContext {
  resources: Array<{
    title: string
    summary: string
    source: string
    confidence: number
    category: string
  }>
  caseStudies: Array<{
    company: string
    challenge: string
    solution: string
    outcome: string
    location: string
  }>
  benchmarks: Array<{
    metric: string
    value: number
    industry: string
    region: string
  }>
}

/**
 * Retrieves relevant knowledge resources based on user query keywords and profile
 * Returns curated, verified resources with high confidence scores to enrich AI context
 */
export async function getKnowledgeContext(
  userQuery: string,
  userProfile?: {
    industry?: string
    company_size?: string
    location_state?: string
  }
): Promise<KnowledgeContext> {
  const sql = getSql()

  // Extract key terms from query for knowledge matching
  const keywords = userQuery.toLowerCase().split(/\s+/).filter(w => w.length > 3)

  try {
    // Retrieve verified knowledge resources relevant to query
    const resources = await sql`
      SELECT 
        title, 
        summary, 
        source_name as source,
        confidence_score as confidence,
        category,
        keywords
      FROM knowledge_resources
      WHERE is_verified = true
        AND confidence_score >= 0.80
        AND (
          -- Match by keywords
          (keywords && $1::text[])
          -- Match by industry focus
          OR (industry_focus && $2::text[])
          -- Match by company size
          OR (company_size_focus && $3::text[])
          -- Match by region
          OR (region_focus && $4::text[])
        )
      ORDER BY confidence_score DESC, publication_date DESC
      LIMIT 8
    ` as any[]

    // Retrieve relevant case studies
    const caseStudies = await sql`
      SELECT 
        company_name as company,
        challenge_summary as challenge,
        solution_description as solution,
        outcome_summary as outcome,
        location_city || ', ' || location_state as location
      FROM case_studies
      WHERE is_published = true
        AND verification_status = 'verified'
        AND (
          (industry ILIKE $1::text)
          OR (solution_type ILIKE $1::text)
          OR (location_state = $2::text)
        )
      ORDER BY is_featured DESC, payback_period_months ASC
      LIMIT 4
    ` as any[]

    // Retrieve relevant benchmarks
    const benchmarks = await sql`
      SELECT 
        metric_name as metric,
        metric_value as value,
        industry,
        state as region
      FROM industry_benchmarks
      WHERE confidence_level IN ('high', 'medium')
        AND year >= 2023
        AND (
          (industry ILIKE $1::text)
          OR (state = $2::text)
          OR (company_size = $3::text)
        )
      ORDER BY confidence_level DESC, year DESC
      LIMIT 6
    ` as any[]

    return {
      resources: resources.map(r => ({
        title: r.title,
        summary: r.summary,
        source: r.source,
        confidence: r.confidence,
        category: r.category,
      })),
      caseStudies: caseStudies.map(c => ({
        company: c.company,
        challenge: c.challenge,
        solution: c.solution,
        outcome: c.outcome,
        location: c.location,
      })),
      benchmarks: benchmarks.map(b => ({
        metric: b.metric,
        value: b.value,
        industry: b.industry,
        region: b.region,
      })),
    }
  } catch (error) {
    console.error("[knowledge] Retrieval error:", error)
    return {
      resources: [],
      caseStudies: [],
      benchmarks: [],
    }
  }
}

/**
 * Formats knowledge context into a structured prompt for the AI
 * Ensures all information is attributed to verified sources
 */
export function formatKnowledgePrompt(context: KnowledgeContext): string {
  let prompt = ""

  if (context.resources.length > 0) {
    prompt += "\n## Relevant Research & Resources\n"
    context.resources.forEach((r, i) => {
      prompt += `${i + 1}. **${r.title}** (${r.source}, confidence: ${(r.confidence * 100).toFixed(0)}%)\n`
      prompt += `   ${r.summary}\n\n`
    })
  }

  if (context.caseStudies.length > 0) {
    prompt += "\n## Relevant Case Studies\n"
    context.caseStudies.forEach((c, i) => {
      prompt += `${i + 1}. **${c.company}** (${c.location})\n`
      prompt += `   Challenge: ${c.challenge}\n`
      prompt += `   Solution: ${c.solution}\n`
      prompt += `   Outcome: ${c.outcome}\n\n`
    })
  }

  if (context.benchmarks.length > 0) {
    prompt += "\n## Industry Benchmarks\n"
    context.benchmarks.forEach((b, i) => {
      prompt += `${i + 1}. ${b.metric}: ${b.value} (${b.industry}, ${b.region})\n`
    })
  }

  return prompt
}
