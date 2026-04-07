"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { getStoredSessionId, trackCalendarClick } from "@/lib/use-tracker"
import { siteConfig } from "@/lib/site-config"

const INDUSTRIES = [
  "Automotive Components",
  "Steel & Metal Fabrication",
  "Cement & Building Materials",
  "Pharmaceutical",
  "Food Processing",
  "Textile & Apparel",
  "Electronics Manufacturing",
  "Plastic & Polymers",
  "Chemical Processing",
  "Other Manufacturing",
]

const PROBLEMS = [
  { id: "breakdown", label: "Machine Breakdown & Downtime" },
  { id: "predictive", label: "Reactive Maintenance (No Prediction)" },
  { id: "qc-rejects", label: "High QC Rejection Rate" },
  { id: "vision", label: "Visual Defect Escapes" },
  { id: "inventory", label: "Inventory Mismatch / Stockouts" },
  { id: "planning", label: "Sales vs Production Mismatch" },
  { id: "procurement", label: "Procurement & Supplier Delays" },
  { id: "data", label: "Data Scattered in Excel/Tally" },
  { id: "dispatch", label: "Order Fulfillment & Dispatch Chaos" },
  { id: "productivity", label: "Workforce Productivity Tracking" },
  { id: "energy", label: "Energy Consumption & Waste" },
  { id: "compliance", label: "Compliance & Audit Trail Gaps" },
]

const TRADITIONAL_SYSTEM_ISSUES = [
  { id: "cost", label: "Too expensive for our scale" },
  { id: "complexity", label: "Too complex to implement" },
  { id: "integration", label: "Does not integrate with existing systems" },
  { id: "support", label: "Poor vendor support in India" },
  { id: "customization", label: "Cannot customize for our needs" },
  { id: "training", label: "Requires too much training" },
  { id: "roi", label: "ROI unclear or too long" },
  { id: "data-requirements", label: "Needs data we do not have" },
]

type AssessmentResult = {
  summary: {
    totalCapitalAtRisk: string
    potentialAnnualSavings: string
    roiTimelineMonths: number
    confidenceLevel: "high" | "medium" | "low"
  }
  methodology: string
  calculations: Array<{
    problemArea: string
    currentAnnualLoss: string
    formula: string
    potentialSavings: string
    savingsFormula: string
    source: string
  }>
  benchmarkComparison: {
    industryAverage: string
    topQuartile: string
    gap: string
  }
  recommendations: Array<{
    priority: number
    action: string
    expectedImpact: string
    timelineWeeks: number
    source: string
  }>
  dataSources: string[]
}

export function RiskAssessmentSection() {
  const [step, setStep] = useState<"input" | "details" | "loading" | "result">("input")
  const [annualRevenue, setAnnualRevenue] = useState("")
  const [employeeCount, setEmployeeCount] = useState("")
  const [industry, setIndustry] = useState("")
  const [selectedProblems, setSelectedProblems] = useState<string[]>([])
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [error, setError] = useState("")
  
  // Lead capture fields
  const [companyName, setCompanyName] = useState("")
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  
  // Traditional system feedback
  const [traditionalIssues, setTraditionalIssues] = useState<string[]>([])
  const [estimatedLossCr, setEstimatedLossCr] = useState("")
  const [currentSolutions, setCurrentSolutions] = useState("")
  const [biggestChallenge, setBiggestChallenge] = useState("")

  const toggleProblem = (id: string) => {
    setSelectedProblems((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const toggleTraditionalIssue = (id: string) => {
    setTraditionalIssues((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleContinueToDetails = () => {
    const revenueCr = parseFloat(annualRevenue)
    const employees = parseInt(employeeCount, 10)

    if (!revenueCr || revenueCr <= 0) {
      setError("Please enter a valid annual revenue in Crores")
      return
    }
    if (!employees || employees <= 0) {
      setError("Please enter a valid employee count")
      return
    }
    if (!industry) {
      setError("Please select your industry")
      return
    }
    if (selectedProblems.length === 0) {
      setError("Please select at least one problem area")
      return
    }
    setError("")
    setStep("details")
  }

  const handleSubmit = async () => {
    // Validate contact info for lead capture
    if (!contactEmail) {
      setError("Please enter your email to receive the assessment report")
      return
    }

    setError("")
    setStep("loading")

    const revenueCr = parseFloat(annualRevenue)
    const employees = parseInt(employeeCount, 10)

    try {
      const res = await fetch("/api/risk-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          annualRevenueCr: revenueCr,
          employeeCount: employees,
          industry,
          selectedProblems,
          sessionId: getStoredSessionId(),
          // Lead capture data
          companyName,
          contactName,
          contactEmail,
          contactPhone,
          city,
          state,
          // Market research data
          traditionalIssues,
          estimatedLossCr: estimatedLossCr ? parseFloat(estimatedLossCr) : null,
          currentSolutions,
          biggestChallenge,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Assessment failed")
      }

      setResult(data.assessment)
      setStep("result")
    } catch (err) {
      console.error("[risk-assessment] error:", err)
      setError(err instanceof Error ? err.message : "Assessment failed. Please try again.")
      setStep("input")
    }
  }

  const handleReset = () => {
    setStep("input")
    setResult(null)
    setError("")
  }

  return (
    <section
      id="risk-assessment"
      className="relative min-h-screen flex items-start px-4 sm:pl-6 md:pl-28 sm:pr-6 md:pr-12 py-16 md:py-28"
    >
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-[10px] text-accent uppercase tracking-widest">
              02 / Primary Risk Assessment
            </span>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-6xl text-foreground leading-none mb-3">
            PRIMARY RISK<br className="hidden sm:block" />ASSESSMENT
          </h2>
          <p className="font-mono text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
            AI-powered analysis using benchmarks from WEF, BCG, KPMG, Deloitte, and NASSCOM.
          </p>
        </div>

        {/* Input Form */}
        {step === "input" && (
          <div className="border border-border/40 bg-card p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Annual Revenue */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Annual Revenue (Crores)
                </label>
                <input
                  type="number"
                  value={annualRevenue}
                  onChange={(e) => setAnnualRevenue(e.target.value)}
                  placeholder="e.g. 50"
                  min="1"
                  className="w-full bg-input border border-border/60 focus:border-accent focus:outline-none px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50"
                />
                <span className="font-mono text-[9px] text-muted-foreground/50 mt-1 block">
                  Enter your approximate annual turnover in ₹ Crores
                </span>
              </div>

              {/* Employee Count */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Total Employees
                </label>
                <input
                  type="number"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  placeholder="e.g. 150"
                  min="1"
                  className="w-full bg-input border border-border/60 focus:border-accent focus:outline-none px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50"
                />
                <span className="font-mono text-[9px] text-muted-foreground/50 mt-1 block">
                  Full-time equivalent across all shifts
                </span>
              </div>

              {/* Industry */}
              <div className="md:col-span-2">
                <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-input border border-border/60 focus:border-accent focus:outline-none px-4 py-3 font-mono text-sm text-foreground"
                >
                  <option value="">Select your industry</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Problem Selection */}
            <div className="mb-8">
              <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                Select Your Operational Bottlenecks
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROBLEMS.map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => toggleProblem(problem.id)}
                    className={cn(
                      "text-left px-4 py-3 border font-mono text-xs transition-all duration-150",
                      selectedProblems.includes(problem.id)
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border/40 text-muted-foreground hover:border-accent/50 hover:text-foreground"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "w-4 h-4 border flex items-center justify-center text-[8px]",
                          selectedProblems.includes(problem.id)
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-muted-foreground/40"
                        )}
                      >
                        {selectedProblems.includes(problem.id) && "✓"}
                      </span>
                      {problem.label}
                    </span>
                  </button>
                ))}
              </div>
              <span className="font-mono text-[9px] text-muted-foreground/50 mt-2 block">
                {selectedProblems.length} selected — each adds to your capital-at-risk calculation
              </span>
            </div>

            {error && (
              <div className="mb-6 px-4 py-3 border border-red-500/50 bg-red-500/10 font-mono text-xs text-red-400">
                {error}
              </div>
            )}

            <button
              onClick={handleContinueToDetails}
              className="w-full px-6 py-4 bg-accent text-accent-foreground font-mono text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors"
            >
              Continue to Get Your Report
            </button>

            <p className="font-mono text-[9px] text-muted-foreground/50 mt-4 text-center">
              All figures computed from WEF, BCG, KPMG, Deloitte, and NASSCOM research benchmarks
            </p>
          </div>
        )}

        {/* Step 2: Lead Capture + Market Research */}
        {step === "details" && (
          <div className="border border-border/40 bg-card p-4 sm:p-6 md:p-8">
            <div className="mb-6">
              <h3 className="font-[family-name:var(--font-display)] text-xl text-foreground mb-2">
                GET YOUR PERSONALIZED REPORT
              </h3>
              <p className="font-mono text-xs text-muted-foreground">
                Enter your details to receive your detailed risk assessment with actionable recommendations.
              </p>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your company name"
                  className="w-full bg-input border border-border/60 focus:border-accent focus:outline-none px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Full name"
                  className="w-full bg-input border border-border/60 focus:border-accent focus:outline-none px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Email <span className="text-accent">*</span>
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="email@company.com"
                  required
                  className="w-full bg-input border border-border/60 focus:border-accent focus:outline-none px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-input border border-border/60 focus:border-accent focus:outline-none px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Pune"
                  className="w-full bg-input border border-border/60 focus:border-accent focus:outline-none px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className="w-full bg-input border border-border/60 focus:border-accent focus:outline-none px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            {/* Market Research Questions */}
            <div className="border-t border-border/30 pt-6 mb-6">
              <h4 className="font-mono text-xs uppercase tracking-widest text-accent mb-4">
                Help Us Understand Your Challenges
              </h4>
              
              <div className="mb-6">
                <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                  What issues have you faced with traditional software/ERP systems?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TRADITIONAL_SYSTEM_ISSUES.map((issue) => (
                    <button
                      key={issue.id}
                      onClick={() => toggleTraditionalIssue(issue.id)}
                      className={cn(
                        "text-left px-3 py-2 border font-mono text-[11px] transition-all duration-150",
                        traditionalIssues.includes(issue.id)
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border/40 text-muted-foreground hover:border-accent/50"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "w-3 h-3 border flex items-center justify-center text-[7px]",
                            traditionalIssues.includes(issue.id)
                              ? "border-accent bg-accent text-accent-foreground"
                              : "border-muted-foreground/40"
                          )}
                        >
                          {traditionalIssues.includes(issue.id) && "✓"}
                        </span>
                        {issue.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                    Estimated annual loss from these problems (₹ Cr)
                  </label>
                  <input
                    type="number"
                    value={estimatedLossCr}
                    onChange={(e) => setEstimatedLossCr(e.target.value)}
                    placeholder="e.g. 2"
                    className="w-full bg-input border border-border/60 focus:border-accent focus:outline-none px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                    What solutions have you tried?
                  </label>
                  <input
                    type="text"
                    value={currentSolutions}
                    onChange={(e) => setCurrentSolutions(e.target.value)}
                    placeholder="e.g. Tally, manual Excel, SAP trial"
                    className="w-full bg-input border border-border/60 focus:border-accent focus:outline-none px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  What is your biggest operational challenge right now?
                </label>
                <textarea
                  value={biggestChallenge}
                  onChange={(e) => setBiggestChallenge(e.target.value)}
                  placeholder="Describe in a few words..."
                  rows={3}
                  className="w-full bg-input border border-border/60 focus:border-accent focus:outline-none px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="mb-6 px-4 py-3 border border-red-500/50 bg-red-500/10 font-mono text-xs text-red-400">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep("input")}
                className="px-6 py-4 border border-border font-mono text-sm uppercase tracking-widest text-muted-foreground hover:border-accent hover:text-accent transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-4 bg-accent text-accent-foreground font-mono text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors"
              >
                Generate My Risk Assessment
              </button>
            </div>

            <p className="font-mono text-[9px] text-muted-foreground/50 mt-4 text-center">
              Your data helps us understand manufacturing challenges in India and improve our recommendations.
            </p>
          </div>
        )}

        {/* Loading State */}
        {step === "loading" && (
          <div className="border border-border/40 bg-card p-12 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mb-6" />
            <p className="font-mono text-sm text-foreground mb-2">Analyzing your operational data...</p>
            <p className="font-mono text-[10px] text-muted-foreground">
              Applying benchmarks from 8+ research sources
            </p>
          </div>
        )}

        {/* Results */}
        {step === "result" && result && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="border-2 border-accent bg-accent/5 p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  Assessment Complete
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-widest px-2 py-1",
                    result.summary.confidenceLevel === "high"
                      ? "bg-green-500/20 text-green-400"
                      : result.summary.confidenceLevel === "medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  )}
                >
                  {result.summary.confidenceLevel} confidence
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Capital at Risk
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-4xl text-foreground">
                    {result.summary.totalCapitalAtRisk}
                  </p>
                  <p className="font-mono text-[9px] text-muted-foreground/60">per year</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Potential Savings with AI
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-4xl text-accent">
                    {result.summary.potentialAnnualSavings}
                  </p>
                  <p className="font-mono text-[9px] text-muted-foreground/60">per year</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Expected ROI Timeline
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-4xl text-foreground">
                    {result.summary.roiTimelineMonths} mo
                  </p>
                  <p className="font-mono text-[9px] text-muted-foreground/60">to positive ROI</p>
                </div>
              </div>

              <p className="font-mono text-xs text-muted-foreground leading-relaxed border-t border-accent/30 pt-4">
                {result.methodology}
              </p>
            </div>

            {/* Calculations Breakdown */}
            <div className="border border-border/40 bg-card p-6">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                Calculation Breakdown
              </h3>
              <div className="space-y-4">
                {result.calculations.map((calc, idx) => (
                  <div key={idx} className="border-b border-border/20 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-mono text-sm text-foreground">{calc.problemArea}</span>
                      <span className="font-mono text-sm text-accent">{calc.potentialSavings}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <p className="font-mono text-[9px] text-muted-foreground/60">Current Annual Loss</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {calc.currentAnnualLoss} = {calc.formula}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-[9px] text-muted-foreground/60">Potential Savings</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {calc.potentialSavings} = {calc.savingsFormula}
                        </p>
                      </div>
                    </div>
                    <p className="font-mono text-[8px] text-muted-foreground/50 mt-1">
                      Source: {calc.source}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Benchmark Comparison */}
            <div className="border border-border/40 bg-card p-6">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                Industry Benchmark Comparison
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-mono text-[9px] text-muted-foreground/60 mb-1">Industry Average</p>
                  <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                    {result.benchmarkComparison.industryAverage}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-muted-foreground/60 mb-1">Top Quartile</p>
                  <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                    {result.benchmarkComparison.topQuartile}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-muted-foreground/60 mb-1">Your Gap</p>
                  <p className="font-mono text-xs text-foreground leading-relaxed">
                    {result.benchmarkComparison.gap}
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="border border-border/40 bg-card p-6">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                Prioritized Recommendations
              </h3>
              <div className="space-y-4">
                {result.recommendations
                  .sort((a, b) => a.priority - b.priority)
                  .map((rec, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <span className="w-6 h-6 bg-accent/20 flex items-center justify-center font-mono text-xs text-accent shrink-0">
                        {rec.priority}
                      </span>
                      <div className="flex-1">
                        <p className="font-mono text-sm text-foreground mb-1">{rec.action}</p>
                        <div className="flex flex-wrap gap-4">
                          <span className="font-mono text-[10px] text-accent">
                            Estimated Impact: {rec.expectedImpact}
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            Timeline: {rec.timelineWeeks} weeks
                          </span>
                        </div>
                        <p className="font-mono text-[8px] text-muted-foreground/50 mt-1">
                          Source: {rec.source}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Data Sources */}
            <div className="border border-border/40 bg-card p-6">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                Data Sources & Citations
              </h3>
              <ul className="space-y-2">
                {result.dataSources.map((source, idx) => (
                  <li key={idx} className="font-mono text-[10px] text-muted-foreground">
                    [{idx + 1}] {source}
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-border/20">
                <p className="font-mono text-[9px] text-muted-foreground/70 leading-relaxed">
                  <strong>Methodology Note:</strong> All numerical estimates are calculated using your inputs (revenue, employee count, selected problems) multiplied by documented industry benchmark rates from the sources above. 
                  These are estimates based on published research and case studies — actual results will vary based on your specific plant conditions, data availability, and implementation approach. 
                  A free plant audit is recommended to validate these estimates with your actual operational data.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="border border-accent/50 bg-accent/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-mono text-sm text-foreground mb-1">
                  Want to validate these estimates for your plant?
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  Book a free plant audit — we verify these calculations with your actual data.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-border font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-accent hover:text-accent transition-colors"
                >
                  New Assessment
                </button>
                <a
                  href={siteConfig.calendarLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCalendarClick("risk_assessment")}
                  className="px-4 py-2 bg-accent text-accent-foreground font-mono text-[10px] uppercase tracking-widest hover:bg-accent/90 transition-colors"
                >
                  Book Plant Audit
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
