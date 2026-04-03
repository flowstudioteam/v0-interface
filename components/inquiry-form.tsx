"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"
import { trackCalendarClick, trackEvent, getStoredSessionId } from "@/lib/use-tracker"

interface FormState {
  fullName: string
  email: string
  phone: string
  company: string
  message: string
}

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  message: "",
}

interface FieldProps {
  label: string
  id: string
  required?: boolean
  error?: string
  children: React.ReactNode
}

function Field({ label, id, required, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
      >
        {label}
        {required && <span className="text-accent ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="font-mono text-[10px] text-destructive-foreground">{error}</p>
      )}
    </div>
  )
}

const inputClass =
  "w-full bg-input border border-border/60 focus:border-accent focus:outline-none px-4 py-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 transition-colors"

export function InquiryForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  const validate = () => {
    const e: Partial<FormState> = {}
    if (!form.fullName.trim()) e.fullName = "Name is required"
    if (!form.email.trim()) {
      e.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address"
    }
    if (form.phone && !/^[+\d\s\-()]{7,15}$/.test(form.phone)) {
      e.phone = "Enter a valid phone number"
    }
    return e
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setStatus("submitting")
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: getStoredSessionId(),
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          company: form.company.trim() || null,
          message: form.message.trim() || null,
          source: "inquiry_form",
        }),
      })
      if (!res.ok) throw new Error("Server error")
      trackEvent("inquiry_submitted", { company: form.company || "unknown" })
      setStatus("success")
      setForm(initialState)
    } catch {
      setStatus("error")
    }
  }

  return (
    <section
      id="contact"
      className="relative pl-6 md:pl-28 pr-6 md:pr-12 py-20 md:py-28"
    >
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] text-accent uppercase tracking-widest">
              06 / Get In Touch
            </span>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl text-foreground leading-none mb-4">
            START THE<br />CONVERSATION
          </h2>
          <p className="font-mono text-sm text-muted-foreground max-w-xl leading-relaxed">
            Tell us about your plant and the challenges you face. We&apos;ll respond within one business
            day with a preliminary assessment — no sales pitch, no obligations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            {status === "success" ? (
              <div className="border border-accent/30 bg-accent/5 p-8">
                <div className="w-8 h-8 bg-accent flex items-center justify-center mb-4">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-foreground" />
                  </svg>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-2xl text-foreground mb-2">
                  MESSAGE RECEIVED
                </h3>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed mb-6">
                  We&apos;ll review your details and get back to you within one business day. In the
                  meantime, you can book a direct call to talk through your plant challenges.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={siteConfig.calendarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCalendarClick("inquiry_thankyou")}
                    className="px-5 py-2.5 bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors"
                  >
                    Book a call
                  </a>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-5 py-2.5 border border-border/40 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                  >
                    Send another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Full Name" id="fullName" required error={errors.fullName}>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Rajesh Kumar"
                      autoComplete="name"
                      className={cn(inputClass, errors.fullName && "border-destructive-foreground")}
                    />
                  </Field>

                  <Field label="Email Address" id="email" required error={errors.email}>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      autoComplete="email"
                      className={cn(inputClass, errors.email && "border-destructive-foreground")}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Phone Number" id="phone" error={errors.phone}>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      className={cn(inputClass, errors.phone && "border-destructive-foreground")}
                    />
                  </Field>

                  <Field label="Company / Plant Name" id="company">
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Acme Auto Parts Pvt Ltd"
                      autoComplete="organization"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="What challenge can we help with?" id="message">
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="e.g. We lose 3-4 hours per shift to unplanned machine breakdowns and I want to understand if predictive maintenance is feasible for our setup…"
                    rows={5}
                    className={cn(inputClass, "resize-none")}
                  />
                </Field>

                {status === "error" && (
                  <p className="font-mono text-[11px] text-destructive-foreground border border-destructive-foreground/30 px-4 py-3">
                    Something went wrong. Please try again or email us directly at{" "}
                    <a href={`mailto:${siteConfig.contact.email}`} className="underline">
                      {siteConfig.contact.email}
                    </a>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className={cn(
                    "self-start px-8 py-4 font-mono text-xs uppercase tracking-widest transition-all duration-150",
                    status === "submitting"
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-accent text-accent-foreground hover:bg-accent/90"
                  )}
                >
                  {status === "submitting" ? "Sending…" : "Send Inquiry"}
                </button>

                <p className="font-mono text-[10px] text-muted-foreground/50 leading-relaxed">
                  By submitting, you agree to be contacted by the FlowStudio team regarding your
                  inquiry. We do not share your data with third parties.
                </p>
              </form>
            )}
          </div>

          {/* Sidebar — contact details */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                Direct Contact
              </h3>
              <div className="flex flex-col gap-4">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="group flex items-start gap-3"
                >
                  <span className="mt-0.5 w-4 h-4 shrink-0 text-accent">
                    <svg viewBox="0 0 16 16" fill="none" className="w-full h-full">
                      <rect x="1" y="3" width="14" height="10" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M1 3l7 6 7-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="font-mono text-xs text-muted-foreground group-hover:text-accent transition-colors break-all">
                    {siteConfig.contact.email}
                  </span>
                </a>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="group flex items-start gap-3"
                >
                  <span className="mt-0.5 w-4 h-4 shrink-0 text-accent">
                    <svg viewBox="0 0 16 16" fill="none" className="w-full h-full">
                      <path d="M3 1h3l1.5 4-2 1.5a9 9 0 004 4L11 9l4 1.5V14a1 1 0 01-1 1C6 15 1 10 1 4a1 1 0 011-1l1-2z" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </span>
                  <span className="font-mono text-xs text-muted-foreground group-hover:text-accent transition-colors">
                    {siteConfig.contact.phoneDisplay}
                  </span>
                </a>
                <a
                  href={siteConfig.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3"
                >
                  <span className="mt-0.5 w-4 h-4 shrink-0 text-accent">
                    <svg viewBox="0 0 16 16" fill="none" className="w-full h-full">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M5 8.5c0 1.4 1.1 2.5 2.5 2.5.5 0 1-.15 1.4-.4l1.6.5-.5-1.6c.25-.4.4-.9.4-1.4C10.4 6.6 9.3 5.5 7.9 5.5S5 6.6 5 8.5z" stroke="currentColor" strokeWidth="1.1" />
                    </svg>
                  </span>
                  <span className="font-mono text-xs text-muted-foreground group-hover:text-accent transition-colors">
                    WhatsApp us
                  </span>
                </a>
              </div>
            </div>

            <div className="border-t border-border/30 pt-8">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                Book a Discovery Call
              </h3>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed mb-4">
                30-minute call to understand your plant setup and identify where AI can make the
                fastest impact. No commitment required.
              </p>
              <a
                href={siteConfig.calendarLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCalendarClick("contact_sidebar")}
                className="inline-flex items-center gap-2 px-5 py-3 bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors"
              >
                Schedule Call
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1 9L9 1M9 1H3M9 1v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </a>
            </div>

            <div className="border border-border/20 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">
                Survey by flowstudio.co.in
              </p>
              <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
                This site is a research and assessment tool. All data collected is used solely to
                understand the AI readiness of Indian manufacturing SMBs. Visit{" "}
                <a
                  href="https://flowstudio.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  flowstudio.co.in
                </a>{" "}
                for the main website.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
