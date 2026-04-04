/**
 * FlowStudio Site Configuration
 * Single source of truth for contact details, links, and branding.
 * Update values here — every component reads from this file.
 */

/**
 * FlowStudio Site Configuration
 * Single source of truth for contact details, links, and branding.
 * Update values here — every component reads from this file.
 */
export const siteConfig = {
  company: {
    name: "FlowStudio",
    fullName: "FlowStudio AI Systems",
    tagline: "AI Systems for Indian Manufacturing SMBs",
    description:
      "We build AI systems for India’s manufacturing MSMEs.
We create deep operational systems designed around factory workflows.
Instead of broad horizontal products, we focus on how manufacturers actually run.
That means less manual effort, clearer decisions, and better business outcomes.and deploy AI systems for manufacturing SMBs in India, starting with the most painful operational bottlenecks: production control, predictive maintenance, quality control, and planning.",
  },

  contact: {
    email: "team@flowstudio.co.in",
    phone: "+918669427514",
    phoneDisplay: "+91 866 942 7514",
    whatsappLink: "https://wa.me/918669427514",
  },

  /** Calendar booking link used on every CTA that opens a direct conversation. */
  calendarLink: "https://cal.com/flow-studio-wddqy7/30min",

  social: {
    linkedin: "https://linkedin.com/company/flowstudio",
    twitter: "https://twitter.com/flowstudioai",
  },

  nav: [
    { id: "hero", label: "Home" },
    { id: "problems", label: "Bottlenecks" },
    { id: "case-studies", label: "Case Studies" },
    { id: "market", label: "Market Insights" },
    { id: "assessment", label: "Assessment" },
    { id: "chat", label: "Ask AI" },
    { id: "contact", label: "Contact" },
  ],
}
