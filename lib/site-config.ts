/**
 * FlowStudio Site Configuration
 * Single source of truth for contact details, links, and branding.
 * Update values here — every component reads from this file.
 */

export const SITE_CONFIG = {
  company: {
    name: "FlowStudio",
    fullName: "FlowStudio AI Systems",
    tagline: "AI Systems for Indian Manufacturing SMBs",
    description:
      "We build and deploy AI systems for manufacturing SMBs in India, starting with the most painful operational bottlenecks: production control, predictive maintenance, quality control, and planning.",
  },

  contact: {
    email: "team@theraidflowstudio.co.in",
    phone: "+91-866-9427514",
    phoneDisplay: "+91 866 942 7514",
    whatsappLink: "https://wa.me/918669427514",
  },

  /**
   * Calendar booking link for discovery calls and demos.
   * This is used on every CTA that initiates a direct conversation.
   */
  calendarLink: "https://calendar.app.google/49oSvU4DxdkEifyj7",

  social: {
    linkedin: "https://linkedin.com/company/flowstudio",
    twitter: "https://twitter.com/flowstudioai",
  },

  nav: {
    items: [
      { id: "hero", label: "Home" },
      { id: "problems", label: "Bottlenecks" },
      { id: "case-studies", label: "Case Studies" },
      { id: "market", label: "Market Insights" },
      { id: "assessment", label: "Assessment" },
      { id: "chat", label: "Ask AI" },
      { id: "contact", label: "Contact" },
    ],
  },
} as const

/** Alias so components can import either `siteConfig` or `SITE_CONFIG` */
export const siteConfig = SITE_CONFIG
