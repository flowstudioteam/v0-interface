-- FlowStudio: Visitor Intelligence & Data Capture Schema
-- Run once against the Neon database to create all required tables.

-- ─────────────────────────────────────────────────────────────
-- 1. VISITORS
-- Captures every unique visitor session. One row per page load.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS visitors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    TEXT NOT NULL,                  -- client-generated ephemeral ID
  ip_address    TEXT,
  user_agent    TEXT,
  referrer      TEXT,
  utm_source    TEXT,
  utm_medium    TEXT,
  utm_campaign  TEXT,
  country       TEXT,
  city          TEXT,
  device_type   TEXT,                           -- 'mobile' | 'tablet' | 'desktop'
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visitors_session ON visitors(session_id);
CREATE INDEX IF NOT EXISTS idx_visitors_first_seen ON visitors(first_seen_at DESC);

-- ─────────────────────────────────────────────────────────────
-- 2. PAGE EVENTS
-- Granular interaction log: scrolls, clicks, section views, etc.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    TEXT NOT NULL,
  event_type    TEXT NOT NULL,                  -- 'page_view' | 'section_view' | 'cta_click' | 'calendar_click' | 'scroll_depth'
  event_label   TEXT,                           -- e.g. section id, CTA label
  metadata      JSONB,                          -- arbitrary extra data
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_events_session ON page_events(session_id);
CREATE INDEX IF NOT EXISTS idx_page_events_type    ON page_events(event_type);
CREATE INDEX IF NOT EXISTS idx_page_events_created ON page_events(created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- 3. ASSESSMENT SUBMISSIONS
-- Full form payload from the 6-step AI Readiness Assessment.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessment_submissions (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id               TEXT NOT NULL,

  -- Step 1: Company basics
  company_name             TEXT,
  turnover_range           TEXT,
  city                     TEXT,
  state                    TEXT,
  industry                 TEXT,
  employee_count           TEXT,

  -- Step 2: Problems
  selected_problems        TEXT[],
  problem_descriptions     JSONB,

  -- Step 3: Money & budget
  problem_losses           JSONB,
  current_solutions        JSONB,
  payback_period           TEXT,
  max_investment           TEXT,
  monthly_budget           TEXT,

  -- Step 4: Outcomes
  desired_outcomes         TEXT[],
  three_month_goal         TEXT,

  -- Step 5: Team & working style
  primary_role             TEXT,
  decision_maker           TEXT,
  preferred_channels       TEXT[],
  implementation_constraints TEXT[],
  timeline                 TEXT,

  -- Step 6: Contact
  full_name                TEXT,
  designation              TEXT,
  phone                    TEXT,
  whatsapp                 TEXT,
  email                    TEXT,
  consent_to_contact       BOOLEAN DEFAULT FALSE,
  wants_free_audit         BOOLEAN DEFAULT FALSE,
  referral_source          TEXT,

  submitted_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_session   ON assessment_submissions(session_id);
CREATE INDEX IF NOT EXISTS idx_assessments_email     ON assessment_submissions(email);
CREATE INDEX IF NOT EXISTS idx_assessments_submitted ON assessment_submissions(submitted_at DESC);

-- ─────────────────────────────────────────────────────────────
-- 4. CHAT INTERACTIONS
-- Every message sent through the AI chat widget.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_interactions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content       TEXT NOT NULL,
  matched_faq   TEXT,                           -- key of the matched FAQ response (if any)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_created ON chat_interactions(created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- 5. CALENDAR CLICKS
-- Tracks every click on the booking calendar link for attribution.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS calendar_clicks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    TEXT NOT NULL,
  source_label  TEXT NOT NULL,                  -- e.g. 'hero_cta', 'footer', 'assessment_thankyou'
  email         TEXT,                           -- if known at time of click
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calendar_session ON calendar_clicks(session_id);
CREATE INDEX IF NOT EXISTS idx_calendar_created ON calendar_clicks(created_at DESC);
