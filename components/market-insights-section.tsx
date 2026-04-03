"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const marketStats = [
  {
    category: "MSME Landscape",
    stats: [
      { label: "Total MSMEs in India", value: "63M+", source: "WEF AI Playbook 2025" },
      { label: "Share of India's GDP", value: "30%", source: "WEF AI Playbook 2025" },
      { label: "People Employed", value: "230M+", source: "WEF AI Playbook 2025" },
      { label: "Contribution to Exports", value: "~50%", source: "Ministry of MSME" },
    ],
  },
  {
    category: "AI Adoption Gap",
    stats: [
      { label: "MSME AI Adoption Rate", value: "~8%", source: "NASSCOM AI Index 2.0, 2024" },
      { label: "Large Enterprise AI Adoption", value: "~23%", source: "NASSCOM AI Index 2.0, 2024" },
      { label: "India AI Market CAGR to 2027", value: "25–35%", source: "NASSCOM AI Index 2.0, 2024" },
      { label: "Enterprises with Live AI", value: "47%", source: "EY × CII, Nov 2025" },
    ],
  },
  {
    category: "Economic Opportunity",
    stats: [
      { label: "AI Value Unlock for MSMEs", value: "$500B+", source: "BCG × FICCI & WEF, 2025" },
      { label: "Manufacturing Firms Achieving AI ROI", value: "34%", source: "KPMG Global Tech Report 2025" },
      { label: "IndiaAI Mission Budget", value: "₹10,372Cr", source: "MeitY, 2025" },
      { label: "Digital % of Mfg Spend by 2025", value: "40%", source: "BCG Make in India 3.0, 2025" },
    ],
  },
]

const researchSources = [
  {
    title: "Transforming Small Businesses: An AI Playbook for India's MSMEs",
    org: "World Economic Forum",
    date: "August 2025",
    finding: "$500B+ AI value potential for MSMEs. IMPACT AI Framework. 230M+ employed. Top barriers: management buy-in, workforce resistance, financial constraints.",
    url: "https://www.weforum.org/publications/transforming-small-businesses-an-ai-playbook-for-india-s-msmes",
  },
  {
    title: "India's Triple AI Imperative",
    org: "Boston Consulting Group",
    date: "December 2025",
    finding: "AI in MSMEs can unlock $500B+ in value. India is top-quartile globally for AI readiness but contributes <1% of global AI patents. Three priorities: Transform at scale, Innovate with depth, Diffuse inclusively.",
    url: "https://www.bcg.com/publications/2025/india-triple-ai-imperative",
  },
  {
    title: "Digitizing Make in India 3.0: Design-Led, Digitally Powered",
    org: "Boston Consulting Group",
    date: "2025",
    finding: "Digital tech projected to be 40% of manufacturing expenditure by 2025 (vs 20% in 2021). India ranks 3rd globally in industry digitisation. Manufacturing share of GDP target: 25% by 2047.",
    url: "https://www.bcg.com/publications/2025/india-digitizing-make-in-india-3-0-design-led-digitally-powered",
  },
  {
    title: "Global Tech Report: Industrial Manufacturing Insights",
    org: "KPMG",
    date: "2025",
    finding: "Surveyed 2,450 executives across 26 countries (368 from industrial manufacturing). 76% of manufacturing firms have workforce appetite for cutting-edge tech. 34% already achieving ROI from multiple AI use cases.",
    url: "https://kpmg.com/in/en/insights/2025/02/kpmg-global-tech-report-industrial-manufacturing-insights.html",
  },
  {
    title: "India's AI Shift: From Pilots to Performance",
    org: "EY × CII",
    date: "November 2025",
    finding: "47% of Indian enterprises have multiple AI use cases live in production — a major shift from pilots. Manufacturing is a leading sector in this transition.",
    url: "https://www.ey.com/en_in/newsroom/2025/11/india-s-ai-shift-from-pilots-to-performance",
  },
  {
    title: "AI Adoption Index 2.0: Tracking India's Sectoral AI Progress",
    org: "NASSCOM",
    date: "2024",
    finding: "500 companies surveyed. India AI market growing at 25–35% CAGR by 2027. Manufacturing actively shifting to AI/ML. Seven key sectors covering 75% of India's GDP assessed.",
    url: "https://www.nasscom.in/knowledge-center/publications/ai-adoption-index-20",
  },
  {
    title: "Smart Manufacturing Survey",
    org: "Deloitte",
    date: "2025",
    finding: "65% of manufacturers rank operational risk as their top concern. 48% face critical production staffing challenges. AI predictive maintenance delivers 3–6 month ROI timelines.",
    url: "https://www2.deloitte.com/us/en/pages/operations/articles/smart-manufacturing.html",
  },
  {
    title: "Predictive Maintenance Case Study — Indian Cement Plant",
    org: "OxMaint",
    date: "2024",
    finding: "₹8 Cr saved in first year. Zero unplanned kiln stops for 11 months. MTBF improved 3.1× on critical assets within 8 months after deploying AI-driven predictive work orders.",
    url: "https://oxmaint.com/industries/cement-plant/case-study-indian-cement-plant-predictive",
  },
  {
    title: "AI Predictive Maintenance — NTPC Power Plant",
    org: "iFactory / JRS Innovation",
    date: "2024",
    finding: "India's largest power generator avoided catastrophic boiler feed pump failure. AI gave 72–96 hour advance warning. Single incident saving: ₹4.2 crore.",
    url: "https://ifactory.jrsinnovation.com/blog/ntpc-ai-predictive-maintenance-power-plant-india",
  },
  {
    title: "Why 80% of AI Projects Fail in Indian Manufacturing",
    org: "OxMaint",
    date: "2024",
    finding: "80% of AI projects in Indian manufacturing fail. Key causes: cloud AI latency, excessive compute costs (₹18L/month in one case), and missing ROI targets by 340%. Edge-deployed AI performs significantly better.",
    url: "https://oxmaint.com/industries/manufacturing-plant/80-percent-ai-projects-fail-indian-manufacturing",
  },
]

const adoptionBarriers = [
  {
    barrier: "Lack of Management Buy-In",
    percentage: 61,
    description: "Top management support is the single biggest determinant of AI project success in MSMEs.",
    source: "WEF AI Playbook for India's MSMEs, 2025",
  },
  {
    barrier: "Data Scattered in Excel / Tally",
    percentage: 72,
    description: "Most SMBs have no single source of operational truth. AI cannot work without structured data foundations.",
    source: "NASSCOM AI Adoption Index 2.0, 2024",
  },
  {
    barrier: "Financial Constraints",
    percentage: 58,
    description: "Upfront cost uncertainty and limited access to financing prevent MSME AI investment.",
    source: "WEF AI Playbook for India's MSMEs, 2025; BCG × FICCI, 2025",
  },
  {
    barrier: "Workforce Resistance",
    percentage: 54,
    description: "Employee concerns about job displacement slow adoption and cause implementation failures.",
    source: "WEF AI Playbook for India's MSMEs, 2025",
  },
  {
    barrier: "Skill Shortages",
    percentage: 48,
    description: "Difficulty finding and retaining AI and data talent at MSME-scale budgets.",
    source: "KPMG Talent Imperatives for MSMEs, February 2026",
  },
  {
    barrier: "Poor Implementation Approach",
    percentage: 80,
    description: "80% of AI projects in Indian manufacturing fail — primarily due to cloud-first deployments with high latency and costs, without proper edge deployment and integration.",
    source: "OxMaint Analysis, 2024",
  },
]

export function MarketInsightsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<"stats" | "sources" | "barriers">("stats")

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
    <section ref={sectionRef} id="market" className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12">
      {/* Section header */}
      <div ref={headerRef} className="mb-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">03 / Market Intelligence</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">
          AI IN INDIAN MANUFACTURING
        </h2>
        <p className="mt-4 max-w-2xl font-mono text-sm text-muted-foreground leading-relaxed">
          Every number on this page is drawn from independent research by WEF, BCG, KPMG, Deloitte, NASSCOM, EY-CII, and MeitY. Sources are cited in full — click any entry to read the original report.
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border/30 pb-4">
        {[
          { id: "stats", label: "Market Stats" },
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

        {activeTab === "sources" && (
          <div className="space-y-4">
            {researchSources.map((source, index) => (
              <div key={index} className="border border-border/40 p-6 bg-card/30 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-mono text-sm text-foreground mb-2">{source.title}</h4>
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent">{source.org}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{source.date}</span>
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
                  Read Report ↗
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
