import { streamText, convertToModelMessages, type UIMessage } from "ai"
import { sql } from "@/lib/db"

export const maxDuration = 30

const SYSTEM_PROMPT = `You are the FlowStudio AI assistant — an expert on AI applications in Indian manufacturing, specifically for small and medium businesses (SMBs/MSMEs).

FlowStudio builds and deploys deep workflow-specific AI agents for manufacturing SMBs in India. The company focuses on the most painful operational bottlenecks: production control, predictive maintenance, quality control, and planning. Unlike SaaS vendors that sell generic dashboards, FlowStudio installs AI agents that integrate directly into plant operations.

When answering questions:
- Be specific, data-backed, and cite real Indian manufacturing context
- Reference verified sources: WEF AI Playbook for India SMEs (2025), Deloitte Smart Manufacturing Survey, NASSCOM AI Adoption Index, EY-CII reports
- Give concrete ROI numbers where possible (e.g. "72% downtime reduction", "₹8 Cr saved annually")
- Acknowledge the real barriers MSMEs face: cost sensitivity, scattered data in Excel/Tally, limited digital infrastructure, workforce concerns
- Be honest about timelines — most implementations take 6–12 weeks for first results
- When relevant, mention that FlowStudio offers a free plant audit and can be contacted at team@theraidflowstudio.co.in or +91 866 942 7514
- Keep answers concise and practical — these are busy plant owners and managers

Key facts to use:
- India has 63+ million MSMEs contributing 30% of GDP
- WEF estimates $490–685 billion in untapped AI value for Indian SMEs
- MSME AI adoption is at ~8% vs 23% for large enterprises
- Predictive maintenance ROI: typically 6–12 months payback
- Computer vision quality inspection: 60–90% reduction in defect escape rate
- India AI market growing at 25–35% CAGR
- Government IndiaAI Mission: ₹10,300 Cr allocated for AI infrastructure`

export async function POST(req: Request) {
  const { messages, sessionId }: { messages: UIMessage[]; sessionId?: string } = await req.json()

  // Log the user's latest message to DB (fire-and-forget)
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")
  if (lastUserMsg && sessionId) {
    const userText = lastUserMsg.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("") ?? ""

    sql`
      INSERT INTO chat_interactions (session_id, role, content)
      VALUES (${sessionId}, 'user', ${userText.slice(0, 2000)})
    `.catch(() => {})
  }

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 600,
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: async ({ messages: allMessages }) => {
      // Log assistant reply to DB
      const assistantMsg = [...allMessages].reverse().find((m) => m.role === "assistant")
      if (assistantMsg && sessionId) {
        const text = assistantMsg.parts
          ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
          .map((p) => p.text)
          .join("") ?? ""

        await sql`
          INSERT INTO chat_interactions (session_id, role, content)
          VALUES (${sessionId}, 'assistant', ${text.slice(0, 2000)})
        `.catch(() => {})
      }
    },
  })
}
