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
      { label: "Total MSMEs in India", value: "60M+", source: "WEF 2025" },
      { label: "GDP Contribution", value: "30%", source: "WEF 2025" },
      { label: "Employment", value: "230M", source: "WEF 2025" },
      { label: "Export Share", value: "~50%", source: "WEF 2025" },
    ],
  },
  {
    category: "AI Adoption",
    stats: [
      { label: "Large Enterprise AI Adoption", value: "23%", source: "AI Tech News" },
      { label: "MSME AI Adoption", value: "8%", source: "AI Tech News" },
      { label: "AI Market CAGR (2027)", value: "25-35%", source: "NASSCOM" },
      { label: "Enterprises with Live AI", value: "47%", source: "EY-CII" },
    ],
  },
  {
    category: "Economic Value",
    stats: [
      { label: "AI Value Potential for MSMEs", value: "$490-685B", source: "WEF 2025" },
      { label: "Sector Growth Potential", value: "45-62%", source: "WEF 2025" },
      { label: "IndiaAI Mission Budget", value: "₹10,300Cr", source: "MeitY" },
      { label: "AI Impact by 2035", value: "$1.7T", source: "IndiaAI" },
    ],
  },
]

const researchSources = [
  {
    title: "Transforming Small Businesses: An AI Playbook for India's SMEs",
    org: "World Economic Forum",
    date: "August 2025",
    key: "IMPACT AI Framework for MSME adoption",
    url: "#",
  },
  {
    title: "2025 Smart Manufacturing Survey",
    org: "Deloitte",
    date: "2025",
    key: "65% rank operational risk as top concern; 48% face production staffing challenges",
    url: "#",
  },
  {
    title: "AI Adoption Index 2.0",
    org: "NASSCOM",
    date: "2024",
    key: "India's AI market growing at 25-35% CAGR; Manufacturing shifting focus to AI/ML",
    url: "#",
  },
  {
    title: "Enterprise AI Adoption Report",
    org: "EY-CII",
    date: "November 2025",
    key: "47% of enterprises have multiple AI use cases live in production",
    url: "#",
  },
  {
    title: "IndiaAI Mission 2.0",
    org: "MeitY",
    date: "2025",
    key: "38,000 GPUs deployed; MSME-focused AI stack development",
    url: "#",
  },
]

const adoptionBarriers = [
  { barrier: "Cost & Affordability", percentage: 50, description: "Half of Indian businesses prioritize pricing over performance" },
  { barrier: "Lack of Awareness", percentage: 68, description: "Most MSMEs unaware of practical AI benefits" },
  { barrier: "Data Readiness", percentage: 72, description: "Data scattered across Excel, Tally with no single source of truth" },
  { barrier: "Skilled Workforce", percentage: 48, description: "Difficulty finding and retaining AI/tech talent" },
  { barrier: "Integration Complexity", percentage: 45, description: "Challenges connecting AI with existing systems" },
]

const softwareComparison = [
  {
    category: "Traditional Software Companies",
    traits: [
      "Generic dashboards that rarely get used",
      "High licensing fees (₹10-50 Lakh+ annually)",
      "Long implementation cycles (6-18 months)",
      "IT team required for maintenance",
      "One-size-fits-all solutions",
    ],
    verdict: "Expensive, slow, and often misaligned with SMB needs",
  },
  {
    category: "Flow Studio Approach",
    traits: [
      "Workflow-specific AI agents that integrate into operations",
      "Affordable pricing starting at ₹4,999/month",
      "Fast deployment (4-8 weeks to value)",
      "Managed service - we handle the tech",
      "Customized to your specific bottlenecks",
    ],
    verdict: "Built for Indian SMBs, priced for Indian SMBs",
  },
]

export function MarketInsightsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<"stats" | "sources" | "barriers" | "compare">("stats")

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
          Data-driven insights from World Economic Forum, Deloitte, NASSCOM, and leading consultancies 
          on AI adoption in Indian manufacturing. Understand the opportunity and the challenges.
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border/30 pb-4">
        {[
          { id: "stats", label: "Market Stats" },
          { id: "sources", label: "Research Sources" },
          { id: "barriers", label: "Adoption Barriers" },
          { id: "compare", label: "Why Not Traditional Software?" },
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
                    Key Finding: {source.key}
                  </p>
                </div>
                <a
                  href={source.url}
                  className="flex-shrink-0 px-4 py-2 border border-border font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-accent hover:text-accent transition-colors"
                >
                  View Source
                </a>
              </div>
            ))}
          </div>
        )}

        {activeTab === "barriers" && (
          <div className="space-y-6">
            <p className="font-mono text-sm text-foreground mb-8 max-w-2xl">
              Understanding why MSMEs haven&apos;t adopted AI helps us build solutions that actually work for them. 
              Here&apos;s what the research shows:
            </p>
            {adoptionBarriers.map((item, index) => (
              <div key={index} className="border border-border/40 p-6 bg-card/30">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-[var(--font-bebas)] text-xl tracking-tight text-foreground">{item.barrier}</h4>
                    <p className="font-mono text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                  <span className="font-[var(--font-bebas)] text-3xl text-accent">{item.percentage}%</span>
                </div>
                <div className="w-full bg-border/30 h-2">
                  <div
                    className="bg-accent h-2 transition-all duration-1000"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
            <p className="font-mono text-[10px] text-muted-foreground/60 mt-4">
              Source: Deloitte Smart Manufacturing Survey 2025, NASSCOM AI Adoption Index, WEF SME Playbook
            </p>
          </div>
        )}

        {activeTab === "compare" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {softwareComparison.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "border p-8",
                  index === 1
                    ? "border-accent bg-accent/5"
                    : "border-border/40 bg-card/30"
                )}
              >
                <h3 className={cn(
                  "font-[var(--font-bebas)] text-2xl tracking-tight mb-6",
                  index === 1 ? "text-accent" : "text-foreground"
                )}>
                  {item.category}
                </h3>
                <ul className="space-y-4 mb-8">
                  {item.traits.map((trait, traitIndex) => (
                    <li key={traitIndex} className="flex items-start gap-3">
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0",
                        index === 1 ? "bg-accent" : "bg-muted-foreground/40"
                      )} />
                      <span className="font-mono text-sm text-foreground">{trait}</span>
                    </li>
                  ))}
                </ul>
                <div className={cn(
                  "pt-4 border-t",
                  index === 1 ? "border-accent/30" : "border-border/30"
                )}>
                  <span className={cn(
                    "font-mono text-xs",
                    index === 1 ? "text-accent" : "text-muted-foreground"
                  )}>
                    {item.verdict}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
