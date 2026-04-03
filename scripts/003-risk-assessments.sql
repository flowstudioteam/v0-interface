-- Risk Assessment Submissions
-- Stores the plant inputs and the ZAI-generated report for each assessment.

CREATE TABLE IF NOT EXISTS risk_assessments (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id           TEXT NOT NULL,

  -- Plant inputs collected from the form
  industry             TEXT NOT NULL,
  annual_turnover_cr   NUMERIC(12, 2),          -- in Indian Crore (₹)
  employee_count       INTEGER,
  primary_bottleneck   TEXT NOT NULL,           -- e.g. "Predictive Maintenance"
  secondary_bottleneck TEXT,
  monthly_downtime_hrs NUMERIC(6, 1),           -- self-reported downtime hours/month
  rejection_rate_pct   NUMERIC(5, 2),           -- % of production rejected / reworked

  -- ZAI-generated report (stored as structured JSON)
  report               JSONB,

  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_risk_assessments_session ON risk_assessments(session_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_created ON risk_assessments(created_at DESC);
