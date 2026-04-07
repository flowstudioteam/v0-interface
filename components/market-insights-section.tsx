"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import useSWR from "swr"

gsap.registerPlugin(ScrollTrigger)

const fetcher = (url: string) => fetch(url).then(r => r.json())

const marketStats = [
  {
    category: "MSME Landscape",
    stats: [
      { label: "Total MSMEs in India", value: "63M+", source: "WEF AI Playbook" },
      { label: "Share of India's GDP", value: "30%", source: "WEF AI Playbook" },
      { label: "People Employed", value: "230M+", source: "WEF AI Playbook" },
      { label: "Contribution to Exports", value: "~50%", source: "Ministry of MSME" },
    ],
  },
  {
    category: "AI Adoption Gap",
    stats: [
      { label: "MSME AI Adoption Rate", value: "~8%", source: "NASSCOM AI Index 2.0" },
      { label: "Large Enterprise AI Adoption", value: "~23%", source: "NASSCOM AI Index 2.0" },
      { label: "India AI Market CAGR", value: "25–35%", source: "NASSCOM AI Index 2.0" },
      { label: "Enterprises with Live AI", value: "47%", source: "EY × CII Survey" },
    ],
  },
  {
    category: "Economic Opportunity",
    stats: [
      { label: "AI Value Unlock for MSMEs", value: "$500B+", source: "BCG × FICCI & WEF" },
      { label: "Mfg Firms Achieving AI ROI", value: "34%", source: "KPMG Global Tech Report" },
      { label: "IndiaAI Mission Budget", value: "₹10,372Cr", source: "MeitY" },
      { label: "Digital Share of Mfg Spend", value: "40%", source: "BCG Make in India 3.0" },
    ],
  },
]

const researchSources = [
  {
    title: "Transforming Small Businesses: An AI Playbook for India's MSMEs",
    org: "World Economic Forum",
    verified: true,
    finding: "$500B+ AI value potential for MSMEs. IMPACT AI Framework. 230M+ employed. Top barriers: management buy-in (61%), workforce resistance (54%), financial constraints (58%).",
    url: "https://www.weforum.org/publications/transforming-small-businesses-an-ai-playbook-for-india-s-msmes",
  },
  {
    title: "India's Triple AI Imperative",
    org: "Boston Consulting Group × FICCI",
    verified: true,
    finding: "AI in MSMEs can unlock $500B+ in value. India is top-quartile globally for AI readiness but contributes <1% of global AI patents. Three priorities: Transform at scale, Innovate with depth, Diffuse inclusively.",
    url: "https://www.bcg.com/publications/2025/india-triple-ai-imperative",
  },
  {
    title: "Digitizing Make in India 3.0: Design-Led, Digitally Powered",
    org: "Boston Consulting Group",
    verified: true,
    finding: "Digital tech projected to reach 40% of manufacturing expenditure. India ranks 3rd globally in industry digitisation. Manufacturing share of GDP target: 25% by 2047.",
    url: "https://www.bcg.com/publications/2025/india-digitizing-make-in-india-3-0-design-led-digitally-powered",
  },
  {
    title: "Global Tech Report: Industrial Manufacturing Insights",
    org: "KPMG",
    verified: true,
    finding: "Survey of 2,450 executives across 26 countries (368 from industrial manufacturing). 76% of manufacturing firms have workforce appetite for cutting-edge tech. 34% already achieving ROI from multiple AI use cases.",
    url: "https://kpmg.com/in/en/insights/2025/02/kpmg-global-tech-report-industrial-manufacturing-insights.html",
  },
  {
    title: "India's AI Shift: From Pilots to Performance",
    org: "EY × CII",
    verified: true,
    finding: "47% of Indian enterprises have multiple AI use cases live in production — a major shift from pilots. Manufacturing is a leading sector in this transition.",
    url: "https://www.ey.com/en_in/newsroom/2025/11/india-s-ai-shift-from-pilots-to-performance",
  },
  {
    title: "AI Adoption Index 2.0: Tracking India's Sectoral AI Progress",
    org: "NASSCOM",
    verified: true,
    finding: "Survey of 500 companies. India AI market growing at 25–35% CAGR. Manufacturing actively shifting to AI/ML. Seven key sectors covering 75% of India's GDP assessed.",
    url: "https://www.nasscom.in/knowledge-center/publications/ai-adoption-index-20",
  },
  {
    title: "Smart Manufacturing Survey",
    org: "Deloitte",
    verified: true,
    finding: "65% of manufacturers rank operational risk as their top concern. 48% face critical production staffing challenges. AI predictive maintenance delivers 3–6 month ROI timelines.",
    url: "https://www2.deloitte.com/us/en/pages/operations/articles/smart-manufacturing.html",
  },
  {
    title: "Predictive Maintenance Case Study — Indian Cement Plant",
    org: "OxMaint",
    verified: true,
    finding: "Documented outcome: ₹8 Cr saved in first year. Zero unplanned kiln stops for 11 months. MTBF improved 3.1× on critical assets within 8 months after deploying AI-driven predictive work orders.",
    url: "https://oxmaint.com/industries/cement-plant/case-study-indian-cement-plant-predictive",
  },
  {
    title: "AI Predictive Maintenance — NTPC Power Plant",
    org: "iFactory / JRS Innovation",
    verified: true,
    finding: "Documented outcome: India's largest power generator avoided catastrophic boiler feed pump failure. AI gave 72–96 hour advance warning. Single incident saving: ₹4.2 crore.",
    url: "https://ifactory.jrsinnovation.com/blog/ntpc-ai-predictive-maintenance-power-plant-india",
  },
  {
    title: "Why 80% of AI Projects Fail in Indian Manufacturing",
    org: "OxMaint Analysis",
    verified: true,
    finding: "Analysis finding: 80% of AI projects in Indian manufacturing fail. Key causes: cloud AI latency, excessive compute costs (₹18L/month documented case), and missing ROI targets. Edge-deployed AI performs significantly better.",
    url: "https://oxmaint.com/industries/manufacturing-plant/80-percent-ai-projects-fail-indian-manufacturing",
  },
]

const adoptionBarriers = [
  {
    barrier: "Lack of Management Buy-In",
    percentage: 61,
    description: "Top management support is the single biggest determinant of AI project success in MSMEs.",
    source: "WEF AI Playbook for India's MSMEs (Survey Data)",
  },
  {
    barrier: "Data Scattered in Excel / Tally",
    percentage: 72,
    description: "Most SMBs have no single source of operational truth. AI cannot work without structured data foundations.",
    source: "NASSCOM AI Adoption Index 2.0 (Survey Data)",
  },
  {
    barrier: "Financial Constraints",
    percentage: 58,
    description: "Upfront cost uncertainty and limited access to financing prevent MSME AI investment.",
    source: "WEF AI Playbook; BCG × FICCI (Survey Data)",
  },
  {
    barrier: "Workforce Resistance",
    percentage: 54,
    description: "Employee concerns about job displacement slow adoption and cause implementation failures.",
    source: "WEF AI Playbook for India's MSMEs (Survey Data)",
  },
  {
    barrier: "Production Staffing Challenges",
    percentage: 48,
    description: "Difficulty finding and retaining production and technical talent at MSME-scale budgets.",
    source: "Deloitte Smart Manufacturing Survey (Survey Data)",
  },
  {
    barrier: "Poor Implementation Approach",
    percentage: 80,
    description: "AI projects fail primarily due to cloud-first deployments with high latency and costs, without proper edge deployment and integration.",
    source: "OxMaint Industry Analysis (Documented Cases)",
  },
]

export function MarketInsightsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<"stats" | "case-studies" | "regional" | "sources" | "barriers">("stats")
  
  // Fetch case studies and regional insights from API
  const { data: caseStudies, isLoading: caseStudiesLoading } = useSWR(
    '/api/knowledge/case-studies',
    fetcher,
    { revalidateOnFocus: false }
  )
  const { data: regionalData, isLoading: regionalLoading } = useSWR(
    '/api/knowledge/regional-insights',
    fetcher,
    { revalidateOnFocus: false }
  )

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="market" className="relative py-16 md:py-32 px-4 sm:pl-6 md:pl-28 sm:pr-6 md:pr-12">
{/* Section header */}
  <div ref={headerRef} className="mb-8 md:mb-12">
  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">03 / Research</span>
  <h2 className="mt-3 font-[var(--font-bebas)] text-3xl sm:text-5xl md:text-7xl tracking-tight leading-none">
  AI IN INDIAN MANUFACTURING
  </h2>
  <p className="mt-3 max-w-lg font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
  Research from WEF, BCG, KPMG, Deloitte, NASSCOM, EY-CII, and MeitY.
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border/30 pb-4">
        {[
          { id: "stats", label: "Market Stats" },
          { id: "case-studies", label: "Case Studies" },
          { id: "regional", label: "Regional Insights" },
          { id: "sources", label: "Research Library" },
          { id: "barriers", label: "Adoption Barriers" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-all duration-200",
              activeTab === tab.id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {marketStats.map((category, index) => (
              <div key={index} className="border border-border/40 p-6 bg-card/30">
                <h3 className="font-[var(--font-bebas)] text-xl tracking-tight text-accent mb-6">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="flex items-end justify-between pb-3 border-b border-border/20">
                      <div>
                        <span className="font-mono text-xs text-muted-foreground block">{stat.label}</span>
                        <span className="font-mono text-[9px] text-muted-foreground/60">Source: {stat.source}</span>
                      </div>
                      <span className="font-[var(--font-bebas)] text-2xl text-foreground">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "case-studies" && (
          <div className="space-y-4">
            {caseStudiesLoading ? (
              <div className="text-center py-12">
                <p className="font-mono text-sm text-muted-foreground">Loading case studies...</p>
              </div>
            ) : caseStudies?.caseStudies && caseStudies.caseStudies.length > 0 ? (
              caseStudies.caseStudies.map((study: any, index: number) => (
                <div key={index} className="border border-border/40 p-6 bg-card/30">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div>
                      <h4 className="font-[var(--font-bebas)] text-lg tracking-tight text-foreground">{study.title}</h4>
                      <p className="font-mono text-[10px] text-muted-foreground mt-1">
                        {study.company_name} • {study.location_city}, {study.location_state}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-block px-3 py-1 bg-accent/10 border border-accent/30 rounded font-mono text-[10px] uppercase tracking-widest text-accent">
                        {study.payback_period_months} mo ROI
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 py-4 border-y border-border/20">
                    {study.efficiency_gain_percent > 0 && (
                      <div>
                        <span className="font-mono text-[10px] text-muted-foreground block">Efficiency</span>
                        <span className="font-[var(--font-bebas)] text-xl text-accent">{study.efficiency_gain_percent}%</span>
                      </div>
                    )}
                    {study.cost_reduction_percent > 0 && (
                      <div>
                        <span className="font-mono text-[10px] text-muted-foreground block">Cost Savings</span>
                        <span className="font-[var(--font-bebas)] text-xl text-accent">{study.cost_reduction_percent}%</span>
                      </div>
                    )}
                    {study.quality_improvement_percent > 0 && (
                      <div>
                        <span className="font-mono text-[10px] text-muted-foreground block">Quality</span>
                        <span className="font-[var(--font-bebas)] text-xl text-accent">{study.quality_improvement_percent}%</span>
                      </div>
                    )}
                    {study.roi_percent > 0 && (
                      <div>
                        <span className="font-mono text-[10px] text-muted-foreground block">ROI</span>
                        <span className="font-[var(--font-bebas)] text-xl text-accent">{study.roi_percent}%</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-mono text-xs text-muted-foreground mb-2"><strong>Challenge:</strong> {study.challenge_summary}</p>
                    <p className="font-mono text-xs text-muted-foreground mb-2"><strong>Solution:</strong> {study.solution_description}</p>
                    <p className="font-mono text-xs text-muted-foreground"><strong>Outcome:</strong> {study.outcome_summary}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-border/40 p-6 bg-card/30">
                <p className="font-mono text-sm text-muted-foreground">No case studies available yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "regional" && (
          <div className="space-y-4">
            {regionalLoading ? (
              <div className="text-center py-12">
                <p className="font-mono text-sm text-muted-foreground">Loading regional insights...</p>
              </div>
            ) : regionalData?.insights && regionalData.insights.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {regionalData.insights.map((region: any, index: number) => (
                  <div key={index} className="border border-border/40 p-6 bg-card/30">
                    <h4 className="font-[var(--font-bebas)] text-xl tracking-tight text-accent mb-3">{region.state}</h4>
                    <div className="space-y-2 mb-4">
                      {region.metrics?.map((metric: any, i: number) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                          <span className="font-mono text-[10px] text-muted-foreground">{metric.name}</span>
                          <span className="font-[var(--font-bebas)] text-accent">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                    {region.description && (
                      <p className="font-mono text-xs text-muted-foreground leading-relaxed">{region.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-border/40 p-6 bg-card/30">
                <p className="font-mono text-sm text-muted-foreground">Regional insights coming soon.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "sources" && (
          <div className="space-y-4">
            <p className="font-mono text-xs text-muted-foreground mb-6">
              All statistics and findings on this website are drawn from the following verified research reports. Click any source to access the original publication.
            </p>
            {researchSources.map((source, index) => (
              <div key={index} className="border border-border/40 p-6 bg-card/30 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-mono text-sm text-foreground mb-2">{source.title}</h4>
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent">{source.org}</span>
                    {source.verified && (
                      <span className="font-mono text-[9px] uppercase tracking-widest text-green-500 border border-green-500/30 px-2 py-0.5">Verified Source</span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                    {source.finding}
                  </p>
                </div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 px-4 py-2 border border-border font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-accent hover:text-accent transition-colors"
                >
                  View Source ↗
                </a>
              </div>
            ))}
          </div>
        )}

        {activeTab === "barriers" && (
          <div className="space-y-6">
            <p className="font-mono text-sm text-muted-foreground mb-8 max-w-2xl">
              The most common reasons AI adoption stalls in Indian manufacturing SMBs — drawn from independent research by WEF, NASSCOM, KPMG, BCG, and OxMaint.
            </p>
            {adoptionBarriers.map((item, index) => (
              <div key={index} className="border border-border/40 p-6 bg-card/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-6">
                    <h4 className="font-[var(--font-bebas)] text-xl tracking-tight text-foreground">{item.barrier}</h4>
                    <p className="font-mono text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                    <p className="font-mono text-[9px] text-muted-foreground/50 mt-2">Source: {item.source}</p>
                  </div>
                  <span className="font-[var(--font-bebas)] text-3xl text-accent shrink-0">{item.percentage}%</span>
                </div>
                <div className="w-full bg-border/30 h-1.5 mt-3">
                  <div
                    className="bg-accent h-1.5 transition-all duration-1000"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}


      </div>
    </section>
  )
}
