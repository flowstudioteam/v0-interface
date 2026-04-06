import React, { useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface ReadinessScores {
  data_infrastructure: number
  it_maturity: number
  workforce_capability: number
  financial_readiness: number
  organizational_alignment: number
}

interface SurveyResponse {
  sessionId: string
  surveyType: "ai_readiness" | "pain_point_deep_dive"
  companyProfile: {
    company_name: string
    industry: string
    company_size: string
    employee_count: string
    annual_revenue_range: string
    location_state: string
  }
  readinessScores: ReadinessScores
  painPoints: {
    problem: string
    severity: number
    annual_loss_estimate: string
    failed_attempts: number
  }[]
  currentState: {
    automation_level: string
    data_collection_maturity: string
    ai_systems_in_use: string[]
  }
}

interface AIReadinessAssessmentProps {
  sessionId?: string
  onComplete?: (response: SurveyResponse) => void
  onSkip?: () => void
}

export function AIReadinessAssessment({
  sessionId = "",
  onComplete,
  onSkip,
}: AIReadinessAssessmentProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [companyProfile, setCompanyProfile] = useState({
    company_name: "",
    industry: "",
    company_size: "small",
    employee_count: "",
    annual_revenue_range: "",
    location_state: "",
  })

  const [readinessScores, setReadinessScores] = useState<ReadinessScores>({
    data_infrastructure: 50,
    it_maturity: 50,
    workforce_capability: 50,
    financial_readiness: 50,
    organizational_alignment: 50,
  })

  const [painPoints, setPainPoints] = useState([
    { problem: "", severity: 5, annual_loss_estimate: "", failed_attempts: 0 },
  ])

  const [currentState, setCurrentState] = useState({
    automation_level: "manual",
    data_collection_maturity: "scattered",
    ai_systems_in_use: [] as string[],
  })

  const handleScoreChange = (key: keyof ReadinessScores, value: number) => {
    setReadinessScores(prev => ({ ...prev, [key]: value }))
  }

  const handlePainPointChange = (
    index: number,
    key: string,
    value: any
  ) => {
    const updated = [...painPoints]
    ;(updated[index] as any)[key] = value
    setPainPoints(updated)
  }

  const addPainPoint = () => {
    setPainPoints([
      ...painPoints,
      { problem: "", severity: 5, annual_loss_estimate: "", failed_attempts: 0 },
    ])
  }

  const handleSubmit = async () => {
    const response: SurveyResponse = {
      sessionId,
      surveyType: "ai_readiness",
      companyProfile,
      readinessScores,
      painPoints: painPoints.filter(p => p.problem),
      currentState,
    }

    // Save to database
    try {
      await fetch("/api/survey/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      })
    } catch (err) {
      console.error("[survey] Save failed:", err)
    }

    onComplete?.(response)
  }

  const averageReadiness = Math.round(
    Object.values(readinessScores).reduce((a, b) => a + b, 0) / 5
  )

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Progress indicator */}
      <div className="mb-8 flex gap-2">
        {[1, 2, 3, 4, 5].map(s => (
          <div
            key={s}
            className={cn(
              "h-1 flex-1 transition-all",
              step >= s ? "bg-accent" : "bg-border"
            )}
          />
        ))}
      </div>

      {/* Step 1: Company Profile */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block font-mono text-sm text-foreground mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={companyProfile.company_name}
              onChange={e =>
                setCompanyProfile({ ...companyProfile, company_name: e.target.value })
              }
              className="w-full px-3 py-2 border border-border bg-background text-foreground font-mono text-sm"
              placeholder="e.g., TechAuto Components"
            />
          </div>

          <div>
            <label className="block font-mono text-sm text-foreground mb-2">
              Industry
            </label>
            <select
              value={companyProfile.industry}
              onChange={e =>
                setCompanyProfile({ ...companyProfile, industry: e.target.value })
              }
              className="w-full px-3 py-2 border border-border bg-background text-foreground font-mono text-sm"
            >
              <option value="">Select industry</option>
              <option value="Automotive">Automotive</option>
              <option value="Electronics">Electronics</option>
              <option value="Textile">Textile</option>
              <option value="Precision">Precision Engineering</option>
              <option value="Chemicals">Chemicals & Pharmaceuticals</option>
              <option value="Food">Food & Beverage</option>
              <option value="Metal">Metal & Steel</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-sm text-foreground mb-2">
                Company Size
              </label>
              <select
                value={companyProfile.company_size}
                onChange={e =>
                  setCompanyProfile({ ...companyProfile, company_size: e.target.value })
                }
                className="w-full px-3 py-2 border border-border bg-background text-foreground font-mono text-sm"
              >
                <option value="micro">Micro (< 10 employees)</option>
                <option value="small">Small (10-50 employees)</option>
                <option value="medium">Medium (50-250 employees)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-sm text-foreground mb-2">
                Employee Count
              </label>
              <input
                type="number"
                value={companyProfile.employee_count}
                onChange={e =>
                  setCompanyProfile({ ...companyProfile, employee_count: e.target.value })
                }
                className="w-full px-3 py-2 border border-border bg-background text-foreground font-mono text-sm"
                placeholder="e.g., 85"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-sm text-foreground mb-2">
              Location (State)
            </label>
            <select
              value={companyProfile.location_state}
              onChange={e =>
                setCompanyProfile({ ...companyProfile, location_state: e.target.value })
              }
              className="w-full px-3 py-2 border border-border bg-background text-foreground font-mono text-sm"
            >
              <option value="">Select state</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Telangana">Telangana</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Haryana">Haryana</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full px-4 py-3 bg-accent text-accent-foreground font-mono text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Next: Readiness Scores
          </button>
        </div>
      )}

      {/* Step 2: Readiness Assessment */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-lg mb-2 text-foreground">
              AI Readiness Assessment
            </h3>
            <p className="font-mono text-xs text-muted-foreground mb-6">
              Rate your current state on a scale of 1-100 for each dimension
            </p>
          </div>

          {Object.entries(readinessScores).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between mb-2">
                <label className="font-mono text-sm text-foreground capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                <span className="font-[family-name:var(--font-display)] text-xl text-accent">
                  {value}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={e =>
                  handleScoreChange(key as keyof ReadinessScores, parseInt(e.target.value))
                }
                className="w-full h-2 bg-border accent-accent cursor-pointer"
              />
              <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                <span>Not ready</span>
                <span>Fully ready</span>
              </div>
            </div>
          ))}

          <div className="border-t border-border pt-4 mt-6">
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-foreground">Average Readiness Score</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-3 bg-border rounded">
                  <div
                    className="h-full bg-accent rounded transition-all"
                    style={{ width: `${averageReadiness}%` }}
                  />
                </div>
                <span className="font-[family-name:var(--font-display)] text-2xl text-accent">
                  {averageReadiness}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 px-4 py-3 border border-border text-foreground font-mono text-sm uppercase tracking-widest hover:bg-border/50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 px-4 py-3 bg-accent text-accent-foreground font-mono text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Next: Pain Points
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Pain Points */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-lg mb-2 text-foreground">
              Top Manufacturing Pain Points
            </h3>
            <p className="font-mono text-xs text-muted-foreground mb-6">
              Identify your most critical operational challenges and their impact
            </p>
          </div>

          {painPoints.map((point, idx) => (
            <div key={idx} className="border border-border/40 p-4 space-y-3">
              <input
                type="text"
                value={point.problem}
                onChange={e => handlePainPointChange(idx, "problem", e.target.value)}
                placeholder="e.g., Unplanned equipment downtime"
                className="w-full px-3 py-2 border border-border bg-background text-foreground font-mono text-sm"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-xs text-muted-foreground mb-1 block">
                    Severity (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={point.severity}
                    onChange={e => handlePainPointChange(idx, "severity", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-border bg-background text-foreground font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-muted-foreground mb-1 block">
                    Est. Annual Loss
                  </label>
                  <input
                    type="text"
                    value={point.annual_loss_estimate}
                    onChange={e => handlePainPointChange(idx, "annual_loss_estimate", e.target.value)}
                    placeholder="e.g., ₹50 lakhs"
                    className="w-full px-3 py-2 border border-border bg-background text-foreground font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs text-muted-foreground mb-1 block">
                  Prior failed improvement attempts
                </label>
                <input
                  type="number"
                  min="0"
                  value={point.failed_attempts}
                  onChange={e => handlePainPointChange(idx, "failed_attempts", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground font-mono text-sm"
                />
              </div>
            </div>
          ))}

          <button
            onClick={addPainPoint}
            className="w-full px-4 py-2 border border-border text-foreground font-mono text-xs uppercase tracking-widest hover:bg-border/50 transition-colors"
          >
            + Add Another Pain Point
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 px-4 py-3 border border-border text-foreground font-mono text-sm uppercase tracking-widest hover:bg-border/50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex-1 px-4 py-3 bg-accent text-accent-foreground font-mono text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Next: Current State
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Current State */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-lg mb-2 text-foreground">
              Current Operational State
            </h3>
            <p className="font-mono text-xs text-muted-foreground mb-6">
              Baseline assessment of your existing systems and infrastructure
            </p>
          </div>

          <div>
            <label className="font-mono text-sm text-foreground mb-3 block">
              Current Automation Level
            </label>
            <div className="space-y-2">
              {[
                { value: "manual", label: "Mostly manual (spreadsheets, pen & paper)" },
                { value: "partial", label: "Partially automated (some legacy systems)" },
                { value: "integrated", label: "Integrated ERP/MES systems" },
                { value: "real_time", label: "Real-time monitoring in place" },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="automation"
                    value={opt.value}
                    checked={currentState.automation_level === opt.value}
                    onChange={e => setCurrentState({ ...currentState, automation_level: e.target.value })}
                    className="w-4 h-4"
                  />
                  <span className="font-mono text-sm text-foreground">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="font-mono text-sm text-foreground mb-3 block">
              Data Collection Maturity
            </label>
            <div className="space-y-2">
              {[
                { value: "scattered", label: "Scattered across systems, mostly manual" },
                { value: "partial", label: "Partially centralized (some automated collection)" },
                { value: "structured", label: "Structured but siloed (different departments)" },
                { value: "integrated", label: "Integrated and real-time" },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="data"
                    value={opt.value}
                    checked={currentState.data_collection_maturity === opt.value}
                    onChange={e => setCurrentState({ ...currentState, data_collection_maturity: e.target.value })}
                    className="w-4 h-4"
                  />
                  <span className="font-mono text-sm text-foreground">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="flex-1 px-4 py-3 border border-border text-foreground font-mono text-sm uppercase tracking-widest hover:bg-border/50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="flex-1 px-4 py-3 bg-accent text-accent-foreground font-mono text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Review & Submit
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Review & Submit */}
      {step === 5 && (
        <div className="space-y-6">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-lg mb-2 text-foreground">
              Assessment Summary
            </h3>
            <p className="font-mono text-xs text-muted-foreground mb-6">
              Review your responses before submitting
            </p>
          </div>

          <div className="border border-border/40 p-6 space-y-4">
            <div>
              <span className="font-mono text-[10px] text-muted-foreground block">COMPANY</span>
              <p className="font-mono text-sm text-foreground mt-1">
                {companyProfile.company_name || "N/A"} • {companyProfile.industry || "N/A"}
              </p>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground block">AI READINESS</span>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 h-2 bg-border rounded">
                  <div
                    className="h-full bg-accent rounded"
                    style={{ width: `${averageReadiness}%` }}
                  />
                </div>
                <span className="font-[family-name:var(--font-display)] text-lg text-accent">
                  {averageReadiness}%
                </span>
              </div>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground block">TOP PAIN POINTS</span>
              <div className="space-y-2 mt-2">
                {painPoints
                  .filter(p => p.problem)
                  .slice(0, 3)
                  .map((p, i) => (
                    <p key={i} className="font-mono text-xs text-foreground">
                      {i + 1}. {p.problem} (Severity: {p.severity}/10)
                    </p>
                  ))}
              </div>
            </div>
          </div>

          <div className="bg-background/50 border border-border/40 p-4 rounded">
            <p className="font-mono text-xs text-muted-foreground">
              Your assessment will be securely saved and help us provide tailored insights and recommendations. You'll receive a detailed report and analysis.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(4)}
              className="flex-1 px-4 py-3 border border-border text-foreground font-mono text-sm uppercase tracking-widest hover:bg-border/50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-accent text-accent-foreground font-mono text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Submit Assessment
            </button>
          </div>

          {onSkip && (
            <button
              onClick={onSkip}
              className="w-full px-4 py-2 text-muted-foreground font-mono text-xs uppercase tracking-widest hover:text-foreground transition-colors"
            >
              Skip for now
            </button>
          )}
        </div>
      )}
    </div>
  )
}
