"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"
import { trackCalendarClick, trackEvent, getStoredSessionId } from "@/lib/use-tracker"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const industries = [
  "Auto Parts",
  "Metal Fabrication",
  "Plastic & Injection Molding",
  "Food Processing",
  "Textile",
  "Pharma",
  "Electronics Assembly",
  "Engineering Goods",
  "Other",
]

const turnoverRanges = ["5-10 Cr", "10-25 Cr", "25-50 Cr", "50+ Cr"]
const employeeRanges = ["10-50", "50-100", "100-250", "250+"]
const lossRanges = ["<1L", "1-3L", "3-8L", "8-15L", ">15L"]
const budgetRanges = ["<5L", "5-12L", "12-25L", "25L+"]
const monthlyBudgetRanges = ["<10K", "10-25K", "25-50K", "50K+"]
const timelineOptions = ["Within 1 month", "1-3 months", "3-6 months", "Just exploring"]
const communicationChannels = ["WhatsApp", "Phone Call", "On-site Visit", "Email", "Video Call"]
const constraints = ["No new hardware", "Limited internet", "Minimal training needed", "Data security concerns", "Union considerations"]
const roles = ["Owner", "Plant Head", "Production Manager", "IT Head", "Other"]
const referralSources = ["Google", "LinkedIn", "Twitter/X", "Industry Event", "Referral", "Other"]

const problems = [
  { id: "procurement", label: "Procurement & Supplier Delays", loss: "₹2-8 Lakh/month" },
  { id: "dispatch", label: "Order Fulfillment Blocks", loss: "₹3-10 Lakh/month" },
  { id: "qc-rejects", label: "QC Rejects & Manual Inspection", loss: "₹5-15 Lakh/month" },
  { id: "breakdown", label: "Machine Breakdown & Downtime", loss: "₹8-25 Lakh/month" },
  { id: "predictive", label: "Predictive Maintenance Gaps", loss: "₹4-12 Lakh/month" },
  { id: "inventory", label: "Inventory Mismatch & Stock-outs", loss: "₹3-10 Lakh/month" },
  { id: "productivity", label: "Productivity & Manpower Tracking", loss: "₹2-6 Lakh/month" },
  { id: "planning", label: "Sales vs Production Mismatch", loss: "₹5-15 Lakh/month" },
  { id: "vision", label: "Visual Defect Detection", loss: "₹8-20 Lakh/month" },
  { id: "data", label: "Data Scattered in Excel/Tally", loss: "₹5-12 Lakh/month" },
]

const desiredOutcomes = {
  quality: [
    "Reduce manual inspection time",
    "WhatsApp/SMS alerts for rejects",
    "Auto-generate reports in Excel format",
    "Integrate with existing ERP/Tally",
    "Camera-based defect detection",
    "Real-time quality dashboard",
  ],
  maintenance: [
    "Predict breakdowns before they happen",
    "Mobile alerts for maintenance team",
    "Spare parts inventory tracking",
    "Maintenance history analytics",
    "Integration with existing CMMS",
  ],
  inventory: [
    "Automatic reorder alerts",
    "Supplier performance tracking",
    "Stock-out prediction",
    "ABC analysis automation",
    "Integration with Tally/accounting",
  ],
  operations: [
    "Real-time production tracking",
    "Worker productivity visibility",
    "Automated scheduling",
    "Dispatch coordination",
    "Customer delivery tracking",
  ],
}

interface FormData {
  // Step 1: Company Basics
  companyName: string
  turnoverRange: string
  city: string
  state: string
  industry: string
  employeeCount: string
  // Step 2: Problems
  selectedProblems: string[]
  problemDescriptions: Record<string, string>
  // Step 3: Money Value
  problemLosses: Record<string, string>
  currentSolutions: Record<string, string>
  paybackPeriod: string
  maxInvestment: string
  monthlyBudget: string
  // Step 4: Outcomes
  desiredOutcomes: string[]
  threeMonthGoal: string
  // Step 5: Team & Style
  primaryRole: string
  decisionMaker: string
  preferredChannels: string[]
  implementationConstraints: string[]
  timeline: string
  // Step 6: Contact
  fullName: string
  designation: string
  phone: string
  whatsapp: string
  email: string
  consentToContact: boolean
  wantsFreeAudit: boolean
  referralSource: string
}

const initialFormData: FormData = {
  companyName: "",
  turnoverRange: "",
  city: "",
  state: "",
  industry: "",
  employeeCount: "",
  selectedProblems: [],
  problemDescriptions: {},
  problemLosses: {},
  currentSolutions: {},
  paybackPeriod: "",
  maxInvestment: "",
  monthlyBudget: "",
  desiredOutcomes: [],
  threeMonthGoal: "",
  primaryRole: "",
  decisionMaker: "",
  preferredChannels: [],
  implementationConstraints: [],
  timeline: "",
  fullName: "",
  designation: "",
  phone: "",
  whatsapp: "",
  email: "",
  consentToContact: false,
  wantsFreeAudit: false,
  referralSource: "",
}

export function AssessmentWizard() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalSteps = 6

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

  const updateFormData = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: keyof FormData, item: string) => {
    const currentArray = formData[field] as string[]
    if (currentArray.includes(item)) {
      updateFormData(field, currentArray.filter(i => i !== item))
    } else {
      if (field === "selectedProblems" && currentArray.length >= 3) return
      updateFormData(field, [...currentArray, item])
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: getStoredSessionId(),
          companyName: formData.companyName,
          contactName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          industry: formData.industry,
          companySize: formData.employeeCount,
          annualRevenue: formData.turnoverRange,
          location: `${formData.city}, ${formData.state}`,
          problems: formData.selectedProblems,
          budgetRange: formData.maxInvestment,
          expectedRoi: formData.paybackPeriod,
          timeline: formData.timeline,
          currentTools: formData.currentSolutions ? Object.values(formData.currentSolutions).join(", ") : null,
          decisionMakers: formData.decisionMaker,
          outcomes: formData.desiredOutcomes,
          workingStyle: formData.preferredChannels.join(", "),
          rawAnswers: formData,
        }),
      })
      trackEvent("assessment_submitted", { problems: formData.selectedProblems })
    } catch {
      // Silent — still show thank you
    } finally {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.companyName && formData.turnoverRange && formData.industry && formData.employeeCount
      case 2:
        return formData.selectedProblems.length > 0
      case 3:
        return formData.paybackPeriod && formData.maxInvestment
      case 4:
        return formData.desiredOutcomes.length > 0
      case 5:
        return formData.primaryRole && formData.preferredChannels.length > 0 && formData.timeline
      case 6:
        return formData.fullName && formData.phone && formData.email && formData.consentToContact
      default:
        return true
    }
  }

  if (isSubmitted) {
    return <ThankYouScreen formData={formData} onReset={() => { setIsSubmitted(false); setFormData(initialFormData); setCurrentStep(1) }} />
  }

  return (
    <section ref={sectionRef} id="assessment" className="relative py-16 md:py-32 px-4 sm:pl-6 md:pl-28 sm:pr-6 md:pr-12">
      {/* Section header */}
      <div ref={headerRef} className="mb-8 md:mb-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">04 / Assessment</span>
        <h2 className="mt-3 font-[var(--font-bebas)] text-3xl sm:text-5xl md:text-7xl tracking-tight leading-none">
          FREE AI READINESS CHECK
        </h2>
        <p className="mt-3 max-w-lg font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
          5-minute assessment for personalized ROI estimates.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 transition-all duration-300",
                i + 1 <= currentStep ? "bg-accent" : "bg-border"
              )}
            />
          ))}
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Form container */}
      <div className="max-w-3xl border border-border/40 bg-card/30 p-4 sm:p-6 md:p-12">
        {currentStep === 1 && (
          <Step1CompanyBasics
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {currentStep === 2 && (
          <Step2Problems
            formData={formData}
            toggleArrayItem={toggleArrayItem}
            updateFormData={updateFormData}
          />
        )}
        {currentStep === 3 && (
          <Step3MoneyValue
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {currentStep === 4 && (
          <Step4Outcomes
            formData={formData}
            toggleArrayItem={toggleArrayItem}
            updateFormData={updateFormData}
          />
        )}
        {currentStep === 5 && (
          <Step5TeamStyle
            formData={formData}
            updateFormData={updateFormData}
            toggleArrayItem={toggleArrayItem}
          />
        )}
        {currentStep === 6 && (
          <Step6Contact
            formData={formData}
            updateFormData={updateFormData}
          />
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border/30">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className={cn(
              "font-mono text-xs uppercase tracking-widest transition-colors",
              currentStep === 1
                ? "text-muted-foreground/30 cursor-not-allowed"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            ← Previous
          </button>
          
          {currentStep < totalSteps ? (
            <button
              onClick={() => setCurrentStep(prev => Math.min(totalSteps, prev + 1))}
              disabled={!canProceed()}
              className={cn(
                "px-6 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-200",
                canProceed()
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className={cn(
                "px-6 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-200",
                canProceed() && !isSubmitting
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {isSubmitting ? "Submitting..." : "Submit Assessment"}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

function Step1CompanyBasics({ formData, updateFormData }: { formData: FormData; updateFormData: (field: keyof FormData, value: FormData[keyof FormData]) => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-[var(--font-bebas)] text-2xl tracking-tight mb-2">Company Basics</h3>
        <p className="font-mono text-xs text-muted-foreground">Tell us about your manufacturing operation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
            Company Name *
          </label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => updateFormData("companyName", e.target.value)}
            className="w-full bg-input border border-border px-4 py-3 font-mono text-sm text-foreground focus:border-accent focus:outline-none transition-colors"
            placeholder="Your company name"
          />
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
            Annual Turnover *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {turnoverRanges.map((range) => (
              <button
                key={range}
                onClick={() => updateFormData("turnoverRange", range)}
                className={cn(
                  "px-4 py-3 border font-mono text-xs transition-all duration-200",
                  formData.turnoverRange === range
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-foreground/40"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
            Industry *
          </label>
          <select
            value={formData.industry}
            onChange={(e) => updateFormData("industry", e.target.value)}
            className="w-full bg-input border border-border px-4 py-3 font-mono text-sm text-foreground focus:border-accent focus:outline-none transition-colors"
          >
            <option value="">Select industry</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
            Employee Count *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {employeeRanges.map((range) => (
              <button
                key={range}
                onClick={() => updateFormData("employeeCount", range)}
                className={cn(
                  "px-4 py-3 border font-mono text-xs transition-all duration-200",
                  formData.employeeCount === range
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-foreground/40"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
            City
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => updateFormData("city", e.target.value)}
            className="w-full bg-input border border-border px-4 py-3 font-mono text-sm text-foreground focus:border-accent focus:outline-none transition-colors"
            placeholder="Plant city"
          />
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
            State
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => updateFormData("state", e.target.value)}
            className="w-full bg-input border border-border px-4 py-3 font-mono text-sm text-foreground focus:border-accent focus:outline-none transition-colors"
            placeholder="Plant state"
          />
        </div>
      </div>
    </div>
  )
}

function Step2Problems({ formData, toggleArrayItem, updateFormData }: { formData: FormData; toggleArrayItem: (field: keyof FormData, item: string) => void; updateFormData: (field: keyof FormData, value: FormData[keyof FormData]) => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-[var(--font-bebas)] text-2xl tracking-tight mb-2">Select Your Bottlenecks</h3>
        <p className="font-mono text-xs text-muted-foreground">
          Choose 1-3 problems that cost you the most ({formData.selectedProblems.length}/3 selected)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {problems.map((problem) => {
          const isSelected = formData.selectedProblems.includes(problem.id)
          const isDisabled = formData.selectedProblems.length >= 3 && !isSelected

          return (
            <button
              key={problem.id}
              onClick={() => toggleArrayItem("selectedProblems", problem.id)}
              disabled={isDisabled}
              className={cn(
                "p-4 border text-left transition-all duration-200",
                isSelected
                  ? "border-accent bg-accent/10"
                  : isDisabled
                  ? "border-border/30 opacity-50 cursor-not-allowed"
                  : "border-border hover:border-foreground/40"
              )}
            >
              <div className="flex items-start justify-between">
                <span className={cn(
                  "font-mono text-sm",
                  isSelected ? "text-accent" : "text-foreground"
                )}>
                  {problem.label}
                </span>
                <div className={cn(
                  "w-4 h-4 border-2 flex items-center justify-center flex-shrink-0 ml-2",
                  isSelected ? "border-accent bg-accent" : "border-muted-foreground/40"
                )}>
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" className="text-accent-foreground" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground mt-1 block">
                Est. loss: {problem.loss}
              </span>
            </button>
          )
        })}
      </div>

      {/* Description fields for selected problems */}
      {formData.selectedProblems.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-border/30">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Describe your pain (optional)
          </p>
          {formData.selectedProblems.map((problemId) => {
            const problem = problems.find(p => p.id === problemId)
            return (
              <div key={problemId}>
                <label className="font-mono text-xs text-foreground block mb-2">
                  {problem?.label}
                </label>
                <textarea
                  value={formData.problemDescriptions[problemId] || ""}
                  onChange={(e) => updateFormData("problemDescriptions", {
                    ...formData.problemDescriptions,
                    [problemId]: e.target.value
                  })}
                  className="w-full bg-input border border-border px-4 py-3 font-mono text-sm text-foreground focus:border-accent focus:outline-none transition-colors resize-none"
                  rows={2}
                  placeholder="Describe how this affects your plant..."
                  maxLength={200}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Step3MoneyValue({ formData, updateFormData }: { formData: FormData; updateFormData: (field: keyof FormData, value: FormData[keyof FormData]) => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-[var(--font-bebas)] text-2xl tracking-tight mb-2">Money Value & Budget</h3>
        <p className="font-mono text-xs text-muted-foreground">Help us understand your investment expectations</p>
      </div>

      {/* Loss estimates per problem */}
      {formData.selectedProblems.length > 0 && (
        <div className="space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Estimated monthly loss per problem
          </p>
          {formData.selectedProblems.map((problemId) => {
            const problem = problems.find(p => p.id === problemId)
            return (
              <div key={problemId}>
                <label className="font-mono text-xs text-foreground block mb-2">
                  {problem?.label}
                </label>
                <div className="flex flex-wrap gap-2">
                  {lossRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => updateFormData("problemLosses", {
                        ...formData.problemLosses,
                        [problemId]: range
                      })}
                      className={cn(
                        "px-3 py-2 border font-mono text-xs transition-all duration-200",
                        formData.problemLosses[problemId] === range
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border text-muted-foreground hover:border-foreground/40"
                      )}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="pt-6 border-t border-border/30">
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-3">
          Desired Payback Period *
        </label>
        <div className="flex flex-wrap gap-2">
          {["3 months", "6 months", "12 months"].map((period) => (
            <button
              key={period}
              onClick={() => updateFormData("paybackPeriod", period)}
              className={cn(
                "px-4 py-3 border font-mono text-xs transition-all duration-200",
                formData.paybackPeriod === period
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:border-foreground/40"
              )}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-3">
            Max One-Time Investment *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {budgetRanges.map((range) => (
              <button
                key={range}
                onClick={() => updateFormData("maxInvestment", range)}
                className={cn(
                  "px-3 py-3 border font-mono text-xs transition-all duration-200",
                  formData.maxInvestment === range
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-foreground/40"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-3">
            Monthly Subscription Budget
          </label>
          <div className="grid grid-cols-2 gap-2">
            {monthlyBudgetRanges.map((range) => (
              <button
                key={range}
                onClick={() => updateFormData("monthlyBudget", range)}
                className={cn(
                  "px-3 py-3 border font-mono text-xs transition-all duration-200",
                  formData.monthlyBudget === range
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-foreground/40"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Step4Outcomes({ formData, toggleArrayItem, updateFormData }: { formData: FormData; toggleArrayItem: (field: keyof FormData, item: string) => void; updateFormData: (field: keyof FormData, value: FormData[keyof FormData]) => void }) {
  // Determine which outcomes to show based on selected problems
  const relevantOutcomes: string[] = []
  
  formData.selectedProblems.forEach(problemId => {
    if (["qc-rejects", "vision"].includes(problemId)) {
      relevantOutcomes.push(...desiredOutcomes.quality)
    }
    if (["breakdown", "predictive"].includes(problemId)) {
      relevantOutcomes.push(...desiredOutcomes.maintenance)
    }
    if (["procurement", "inventory"].includes(problemId)) {
      relevantOutcomes.push(...desiredOutcomes.inventory)
    }
    if (["dispatch", "productivity", "planning", "data"].includes(problemId)) {
      relevantOutcomes.push(...desiredOutcomes.operations)
    }
  })

  const uniqueOutcomes = Array.from(new Set(relevantOutcomes))

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-[var(--font-bebas)] text-2xl tracking-tight mb-2">Desired Outcomes</h3>
        <p className="font-mono text-xs text-muted-foreground">What features matter most to you?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {uniqueOutcomes.map((outcome) => {
          const isSelected = formData.desiredOutcomes.includes(outcome)
          return (
            <button
              key={outcome}
              onClick={() => toggleArrayItem("desiredOutcomes", outcome)}
              className={cn(
                "p-4 border text-left transition-all duration-200 flex items-center justify-between",
                isSelected
                  ? "border-accent bg-accent/10"
                  : "border-border hover:border-foreground/40"
              )}
            >
              <span className={cn(
                "font-mono text-sm",
                isSelected ? "text-accent" : "text-foreground"
              )}>
                {outcome}
              </span>
              <div className={cn(
                "w-4 h-4 border-2 flex items-center justify-center flex-shrink-0 ml-2",
                isSelected ? "border-accent bg-accent" : "border-muted-foreground/40"
              )}>
                {isSelected && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" className="text-accent-foreground" />
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
          What exact result do you want in the first 3 months?
        </label>
        <textarea
          value={formData.threeMonthGoal}
          onChange={(e) => updateFormData("threeMonthGoal", e.target.value)}
          className="w-full bg-input border border-border px-4 py-3 font-mono text-sm text-foreground focus:border-accent focus:outline-none transition-colors resize-none"
          rows={3}
          placeholder="Describe your ideal outcome..."
        />
      </div>
    </div>
  )
}

function Step5TeamStyle({ formData, updateFormData, toggleArrayItem }: { formData: FormData; updateFormData: (field: keyof FormData, value: FormData[keyof FormData]) => void; toggleArrayItem: (field: keyof FormData, item: string) => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-[var(--font-bebas)] text-2xl tracking-tight mb-2">Team & Working Style</h3>
        <p className="font-mono text-xs text-muted-foreground">Help us understand how to work with you best</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-3">
            Your Role *
          </label>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => updateFormData("primaryRole", role)}
                className={cn(
                  "px-3 py-2 border font-mono text-xs transition-all duration-200",
                  formData.primaryRole === role
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-foreground/40"
                )}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-3">
            Decision Making
          </label>
          <div className="flex flex-col gap-2">
            {["I am the decision maker", "Need to involve others", "Evaluating for someone"].map((option) => (
              <button
                key={option}
                onClick={() => updateFormData("decisionMaker", option)}
                className={cn(
                  "px-3 py-2 border font-mono text-xs transition-all duration-200 text-left",
                  formData.decisionMaker === option
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-foreground/40"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-3">
          Preferred Communication *
        </label>
        <div className="flex flex-wrap gap-2">
          {communicationChannels.map((channel) => {
            const isSelected = formData.preferredChannels.includes(channel)
            return (
              <button
                key={channel}
                onClick={() => toggleArrayItem("preferredChannels", channel)}
                className={cn(
                  "px-3 py-2 border font-mono text-xs transition-all duration-200",
                  isSelected
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-foreground/40"
                )}
              >
                {channel}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-3">
          Implementation Constraints
        </label>
        <div className="flex flex-wrap gap-2">
          {constraints.map((constraint) => {
            const isSelected = formData.implementationConstraints.includes(constraint)
            return (
              <button
                key={constraint}
                onClick={() => toggleArrayItem("implementationConstraints", constraint)}
                className={cn(
                  "px-3 py-2 border font-mono text-xs transition-all duration-200",
                  isSelected
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-foreground/40"
                )}
              >
                {constraint}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-3">
          Timeline *
        </label>
        <div className="flex flex-wrap gap-2">
          {timelineOptions.map((option) => (
            <button
              key={option}
              onClick={() => updateFormData("timeline", option)}
              className={cn(
                "px-4 py-3 border font-mono text-xs transition-all duration-200",
                formData.timeline === option
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:border-foreground/40"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Step6Contact({ formData, updateFormData }: { formData: FormData; updateFormData: (field: keyof FormData, value: FormData[keyof FormData]) => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-[var(--font-bebas)] text-2xl tracking-tight mb-2">Contact Information</h3>
        <p className="font-mono text-xs text-muted-foreground">How can we reach you with your personalized results?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => updateFormData("fullName", e.target.value)}
            className="w-full bg-input border border-border px-4 py-3 font-mono text-sm text-foreground focus:border-accent focus:outline-none transition-colors"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
            Designation
          </label>
          <input
            type="text"
            value={formData.designation}
            onChange={(e) => updateFormData("designation", e.target.value)}
            className="w-full bg-input border border-border px-4 py-3 font-mono text-sm text-foreground focus:border-accent focus:outline-none transition-colors"
            placeholder="Your title"
          />
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData("phone", e.target.value)}
            className="w-full bg-input border border-border px-4 py-3 font-mono text-sm text-foreground focus:border-accent focus:outline-none transition-colors"
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
            WhatsApp Number
          </label>
          <input
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => updateFormData("whatsapp", e.target.value)}
            className="w-full bg-input border border-border px-4 py-3 font-mono text-sm text-foreground focus:border-accent focus:outline-none transition-colors"
            placeholder="Same as phone / Different"
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            className="w-full bg-input border border-border px-4 py-3 font-mono text-sm text-foreground focus:border-accent focus:outline-none transition-colors"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-3">
          How did you hear about us?
        </label>
        <div className="flex flex-wrap gap-2">
          {referralSources.map((source) => (
            <button
              key={source}
              onClick={() => updateFormData("referralSource", source)}
              className={cn(
                "px-3 py-2 border font-mono text-xs transition-all duration-200",
                formData.referralSource === source
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:border-foreground/40"
              )}
            >
              {source}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-border/30">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.consentToContact}
            onChange={(e) => updateFormData("consentToContact", e.target.checked)}
            className="mt-1 w-4 h-4 accent-accent"
          />
          <span className="font-mono text-xs text-muted-foreground">
            I consent to be contacted by Flow Studio regarding this assessment and related services. *
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.wantsFreeAudit}
            onChange={(e) => updateFormData("wantsFreeAudit", e.target.checked)}
            className="mt-1 w-4 h-4 accent-accent"
          />
          <span className="font-mono text-xs text-muted-foreground">
            I want a free 30-minute plant audit call with a Flow Studio expert
          </span>
        </label>
      </div>
    </div>
  )
}

function ThankYouScreen({ formData, onReset }: { formData: FormData; onReset: () => void }) {
  // Calculate estimated savings based on selections
  const estimatedMonthlySavings = formData.selectedProblems.length * 5 // Simplified calculation

  return (
    <section id="assessment" className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12">
      <div className="max-w-3xl">
        <div className="mb-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Assessment Complete</span>
          <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-6xl tracking-tight">
            THANK YOU, {formData.fullName.split(" ")[0].toUpperCase()}
          </h2>
        </div>

        <div className="border border-accent bg-accent/5 p-8 mb-8">
          <h3 className="font-[var(--font-bebas)] text-2xl tracking-tight text-accent mb-4">
            Your Preliminary Assessment
          </h3>
          <p className="font-mono text-sm text-foreground leading-relaxed mb-6">
            Based on your responses for {formData.companyName}, here&apos;s what we see:
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-start justify-between py-3 border-b border-border/30">
              <span className="font-mono text-xs text-muted-foreground">Selected Bottlenecks</span>
              <span className="font-mono text-sm text-foreground text-right max-w-xs">
                {formData.selectedProblems.map(id => 
                  problems.find(p => p.id === id)?.label
                ).join(", ")}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/30">
              <span className="font-mono text-xs text-muted-foreground">Estimated Monthly Loss</span>
              <span className="font-[var(--font-bebas)] text-2xl text-destructive">
                ₹{estimatedMonthlySavings}-{estimatedMonthlySavings * 3} Lakh
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/30">
              <span className="font-mono text-xs text-muted-foreground">Potential Annual Savings</span>
              <span className="font-[var(--font-bebas)] text-2xl text-accent">
                ₹{estimatedMonthlySavings * 12}-{estimatedMonthlySavings * 36} Lakh
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="font-mono text-xs text-muted-foreground">Expected ROI Period</span>
              <span className="font-mono text-sm text-foreground">3-6 months</span>
            </div>
          </div>

          <p className="font-mono text-xs text-muted-foreground">
            Our team will review your assessment and reach out within 24 hours with a detailed analysis 
            and customized solution recommendations.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <a
            href={siteConfig.calendarLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCalendarClick("thankyou_cta")}
            className="px-6 py-3 bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors"
          >
            Book Your Plant Walkthrough →
          </a>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="px-6 py-3 border border-border font-mono text-xs uppercase tracking-widest text-muted-foreground hover:border-accent hover:text-accent transition-colors"
          >
            Email the Team
          </a>
          <button
            onClick={onReset}
            className="px-6 py-3 border border-border/40 font-mono text-xs uppercase tracking-widest text-muted-foreground/60 hover:border-foreground hover:text-foreground transition-colors"
          >
            Start New Assessment
          </button>
        </div>

        <p className="mt-6 font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest">
          Or reach us directly: {siteConfig.contact.email} &nbsp;·&nbsp; {siteConfig.contact.phoneDisplay}
        </p>
      </div>
    </section>
  )
}
