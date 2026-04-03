"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const caseStudies = [
  {
    id: "cement-plant",
    company: "Top Indian Cement Producer",
    location: "Rajasthan, India",
    industry: "Cement & Building Materials",
    challenge: "Predictive Maintenance",
    problem: "Unplanned kiln shutdowns costing ₹8+ crore annually. Reactive maintenance approach with no advance warning on equipment degradation across kilns and grinding mills.",
    solution: "AI-driven predictive work order system integrated with existing sensors. Sensor readings converted to actionable maintenance tasks before failures occur.",
    results: [
      { metric: "Annual Savings", value: "₹8 Cr", improvement: "First year" },
      { metric: "Unplanned Kiln Stops", value: "0", improvement: "11 months straight" },
      { metric: "MTBF Improvement", value: "3.1×", improvement: "On critical assets in 8 months" },
    ],
    source: "OxMaint — Indian Cement Plant Predictive Maintenance Case Study, 2024",
    sourceUrl: "https://oxmaint.com/industries/cement-plant/case-study-indian-cement-plant-predictive",
    timeline: "8 months to full results",
  },
  {
    id: "ntpc-power",
    company: "NTPC — India's Largest Power Generator",
    location: "India",
    industry: "Power Generation",
    challenge: "Critical Equipment Failure Prevention",
    problem: "Risk of catastrophic boiler feed pump failure with no early warning system. A failure would trigger forced outage, generation loss, and costly emergency repairs.",
    solution: "AI predictive maintenance system monitoring vibration, temperature, and performance patterns across critical rotating equipment.",
    results: [
      { metric: "Advance Warning", value: "72–96h", improvement: "Before critical failure" },
      { metric: "Single Incident Saving", value: "₹4.2 Cr", improvement: "Pump + outage + generation loss" },
      { metric: "Maintenance Approach", value: "Reactive → Planned", improvement: "Structural shift" },
    ],
    source: "iFactory / JRS Innovation — NTPC AI Predictive Maintenance Case Study, 2024",
    sourceUrl: "https://ifactory.jrsinnovation.com/blog/ntpc-ai-predictive-maintenance-power-plant-india",
    timeline: "Implemented within scheduled maintenance window",
  },
  {
    id: "auto-parts",
    company: "Automotive SME Cluster",
    location: "Chennai, India",
    industry: "Automotive Components",
    challenge: "Downtime & Quality Rejection Rate",
    problem: "High PPM rejection rates and frequent machine downtime causing customer penalties and missed OEM delivery commitments.",
    solution: "Integrated ERP-lean-AI model for automotive SMEs: AI-based statistical process control with real-time quality gates and production scheduling optimisation.",
    results: [
      { metric: "Downtime Reduction", value: "88.9%", improvement: "Measured result" },
      { metric: "Rejection Rate (PPM)", value: "↓72.4%", improvement: "Verified reduction" },
      { metric: "OEM Compliance", value: "Restored", improvement: "Delivery penalties eliminated" },
    ],
    source: "Nature.com Scientific Reports — Integrated ERP-Lean Model for Automotive SMEs, Chennai, 2025",
    sourceUrl: "https://www.nature.com/articles/s41598-025-18619-1.pdf",
    timeline: "Measurable impact within 4 months",
  },
  {
    id: "electronics-vision",
    company: "Electronics Manufacturer",
    location: "India",
    industry: "Electronics Manufacturing",
    challenge: "Defect Escape Rate — AI Vision Inspection",
    problem: "High defect escape rate across 9 production lines leading to field failures, costly recalls, and customer trust erosion.",
    solution: "AI computer vision inspection system deployed across all 9 production lines. System processes 200 circuit boards per minute and detects defects as small as 0.3mm.",
    results: [
      { metric: "Defect Detection Accuracy", value: "99.8%", improvement: "Measured" },
      { metric: "Defect Escape Rate", value: "0.2%", improvement: "Down from industry average" },
      { metric: "Recall Costs Prevented", value: "$8M", improvement: "Estimated first year" },
    ],
    source: "OxMaint — AI Vision Inspection Defect Detection Quality Case Study, 2024",
    sourceUrl: "https://oxmaint.com/industries/manufacturing-plant/ai-vision-inspection-defect-detection-quality-case-study",
    timeline: "ROI visible within 6 months",
  },
]

export function CaseStudiesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [activeCase, setActiveCase] = useState(caseStudies[0].id)

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

  const activeCaseData = caseStudies.find(c => c.id === activeCase)

  return (
    <section ref={sectionRef} id="case-studies" className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12 bg-card/30">
      {/* Section header */}
      <div ref={headerRef} className="mb-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">02 / Case Studies</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">
          REAL RESULTS FROM INDIAN PLANTS
        </h2>
        <p className="mt-4 max-w-2xl font-mono text-sm text-muted-foreground leading-relaxed">
          Documented outcomes from published case studies by OxMaint, Nature.com Scientific Reports, and iFactory. Every result is sourced from independently published research — not internal projections.
        </p>
      </div>

      {/* Case study selector tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border/30 pb-4">
        {caseStudies.map((study) => (
          <button
            key={study.id}
            onClick={() => setActiveCase(study.id)}
            className={cn(
              "px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-all duration-200",
              activeCase === study.id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {study.industry}
          </button>
        ))}
      </div>

      {/* Active case study detail */}
      {activeCaseData && (
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Main info */}
          <div className="lg:col-span-2 border border-border/40 p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-tight text-foreground">
                  {activeCaseData.company}
                </h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {activeCaseData.location} • {activeCaseData.industry}
                </span>
              </div>
              <span className="px-3 py-1 bg-accent/10 border border-accent/30 font-mono text-[10px] uppercase tracking-widest text-accent">
                {activeCaseData.challenge}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  The Problem
                </h4>
                <p className="font-mono text-sm text-foreground leading-relaxed">
                  {activeCaseData.problem}
                </p>
              </div>

              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Our Solution
                </h4>
                <p className="font-mono text-sm text-foreground leading-relaxed">
                  {activeCaseData.solution}
                </p>
              </div>

              <div className="pt-4 border-t border-border/30 flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[9px] text-muted-foreground/60">
                  Timeline: {activeCaseData.timeline}
                </span>
                <a
                  href={activeCaseData.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[9px] text-muted-foreground/60 hover:text-accent transition-colors underline underline-offset-2"
                >
                  Source: {activeCaseData.source} ↗
                </a>
              </div>
            </div>
          </div>

          {/* Results metrics */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-4">
              Measured Results
            </h4>
            {activeCaseData.results.map((result, index) => (
              <div
                key={index}
                className="border border-border/40 p-6 bg-background"
              >
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-2">
                  {result.metric}
                </span>
                <div className="flex items-end justify-between">
                  <span className="font-[var(--font-bebas)] text-4xl text-accent">
                    {result.value}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {result.improvement}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


    </section>
  )
}
