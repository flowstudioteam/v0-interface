-- Knowledge Management Schema for AI Manufacturing Platform
-- This migration creates tables for curated knowledge resources, case studies,
-- industry benchmarks, enhanced surveys, and ecosystem directory

-- 1. KNOWLEDGE RESOURCES - Research, reports, white papers, statistics
CREATE TABLE IF NOT EXISTS knowledge_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Classification
  resource_type TEXT NOT NULL CHECK (resource_type IN (
    'research_paper', 'white_paper', 'industry_report', 'government_report',
    'case_study_link', 'news_article', 'statistic', 'regulation', 'best_practice'
  )),
  category TEXT NOT NULL CHECK (category IN (
    'production_control', 'predictive_maintenance', 'quality_control',
    'inventory_planning', 'supply_chain', 'edge_ai', 'robotics',
    'workforce', 'sustainability', 'general'
  )),
  
  -- Content
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content_text TEXT, -- Full text for AI retrieval
  source_url TEXT,
  source_name TEXT NOT NULL, -- e.g., "McKinsey", "NASSCOM", "MeitY"
  publication_date DATE,
  
  -- Regional focus
  region_focus TEXT[] DEFAULT '{}', -- e.g., ['india', 'tamil_nadu', 'pune']
  industry_focus TEXT[] DEFAULT '{}', -- e.g., ['automotive', 'textiles', 'pharmaceuticals']
  company_size_focus TEXT[] DEFAULT '{}', -- e.g., ['sme', 'mid_market', 'enterprise']
  
  -- Validation & Quality
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMPTZ,
  verified_by TEXT,
  confidence_score NUMERIC(3,2) DEFAULT 0.80, -- 0.00 to 1.00
  
  -- Search optimization
  keywords TEXT[] DEFAULT '{}',
  embedding_vector JSONB, -- For future vector search
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_type ON knowledge_resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_resources(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_region ON knowledge_resources USING GIN(region_focus);
CREATE INDEX IF NOT EXISTS idx_knowledge_industry ON knowledge_resources USING GIN(industry_focus);
CREATE INDEX IF NOT EXISTS idx_knowledge_keywords ON knowledge_resources USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_knowledge_verified ON knowledge_resources(is_verified) WHERE is_verified = TRUE;

-- 2. CASE STUDIES - Documented AI implementations with outcomes
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Company info (anonymized if needed)
  company_name TEXT, -- NULL if anonymous
  company_size TEXT CHECK (company_size IN ('micro', 'small', 'medium', 'large')),
  industry TEXT NOT NULL,
  sub_industry TEXT,
  location_state TEXT,
  location_city TEXT,
  employee_count_range TEXT,
  annual_revenue_range TEXT,
  
  -- Problem & Solution
  title TEXT NOT NULL,
  challenge_summary TEXT NOT NULL,
  challenge_details TEXT,
  solution_type TEXT NOT NULL CHECK (solution_type IN (
    'production_control', 'predictive_maintenance', 'quality_control',
    'inventory_planning', 'supply_chain', 'edge_ai', 'robotics', 'custom_ai'
  )),
  solution_description TEXT NOT NULL,
  implementation_partner TEXT,
  technology_stack TEXT[],
  
  -- Timeline & Investment
  implementation_duration_months INTEGER,
  investment_range TEXT,
  payback_period_months INTEGER,
  
  -- Outcomes (quantified)
  outcome_summary TEXT NOT NULL,
  efficiency_gain_percent NUMERIC(5,2),
  cost_reduction_percent NUMERIC(5,2),
  quality_improvement_percent NUMERIC(5,2),
  downtime_reduction_percent NUMERIC(5,2),
  roi_percent NUMERIC(6,2),
  other_metrics JSONB, -- Flexible for case-specific metrics
  
  -- Learnings
  key_success_factors TEXT[],
  challenges_faced TEXT[],
  lessons_learned TEXT,
  
  -- Status & Validation
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_anonymous BOOLEAN DEFAULT FALSE,
  data_source TEXT, -- 'self_reported', 'partner_submitted', 'researched'
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_case_studies_industry ON case_studies(industry);
CREATE INDEX IF NOT EXISTS idx_case_studies_solution ON case_studies(solution_type);
CREATE INDEX IF NOT EXISTS idx_case_studies_state ON case_studies(location_state);
CREATE INDEX IF NOT EXISTS idx_case_studies_published ON case_studies(is_published) WHERE is_published = TRUE;
CREATE INDEX IF NOT EXISTS idx_case_studies_featured ON case_studies(is_featured) WHERE is_featured = TRUE;

-- 3. INDUSTRY BENCHMARKS - Validated metrics by industry/region
CREATE TABLE IF NOT EXISTS industry_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Segmentation
  industry TEXT NOT NULL,
  sub_industry TEXT,
  region TEXT DEFAULT 'india',
  state TEXT,
  company_size TEXT CHECK (company_size IN ('micro', 'small', 'medium', 'large', 'all')),
  
  -- Benchmark data
  metric_name TEXT NOT NULL,
  metric_category TEXT NOT NULL CHECK (metric_category IN (
    'adoption_rate', 'investment', 'roi', 'efficiency',
    'quality', 'downtime', 'labor', 'cost_structure'
  )),
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT NOT NULL, -- e.g., '%', 'INR lakhs', 'hours', 'ratio'
  
  -- Context
  year INTEGER NOT NULL,
  quarter INTEGER, -- 1-4, NULL for annual
  sample_size INTEGER,
  data_source TEXT NOT NULL,
  source_url TEXT,
  
  -- Validation
  confidence_level TEXT DEFAULT 'medium' CHECK (confidence_level IN ('low', 'medium', 'high')),
  methodology_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_benchmarks_industry ON industry_benchmarks(industry);
CREATE INDEX IF NOT EXISTS idx_benchmarks_metric ON industry_benchmarks(metric_name);
CREATE INDEX IF NOT EXISTS idx_benchmarks_year ON industry_benchmarks(year DESC);
CREATE INDEX IF NOT EXISTS idx_benchmarks_category ON industry_benchmarks(metric_category);

-- 4. ENHANCED SURVEY RESPONSES - Deep pain point data
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  
  -- Survey type
  survey_type TEXT NOT NULL CHECK (survey_type IN (
    'ai_readiness', 'pain_point_deep_dive', 'industry_pulse', 'quick_assessment'
  )),
  
  -- Company profile
  company_name TEXT,
  industry TEXT,
  sub_industry TEXT,
  company_size TEXT,
  employee_count TEXT,
  annual_revenue_range TEXT,
  location_state TEXT,
  location_city TEXT,
  
  -- Respondent info
  respondent_role TEXT,
  respondent_department TEXT,
  decision_making_authority TEXT,
  
  -- AI Readiness dimensions (1-5 scale stored as JSONB)
  readiness_scores JSONB, -- {data_infrastructure: 3, process_maturity: 2, workforce_skills: 2, leadership_buy_in: 4}
  
  -- Pain points (detailed)
  pain_points JSONB, -- [{area: 'quality', severity: 5, frequency: 'daily', estimated_cost_monthly: 500000, failed_solutions: [...]}]
  
  -- Current state
  current_automation_level TEXT,
  existing_ai_systems TEXT[],
  it_infrastructure_status TEXT,
  data_collection_maturity TEXT,
  
  -- Investment & Budget
  annual_tech_budget_range TEXT,
  ai_budget_allocation_percent NUMERIC(5,2),
  preferred_investment_model TEXT, -- 'capex', 'opex', 'hybrid'
  
  -- Goals & Timeline
  primary_goals TEXT[],
  expected_roi_timeline TEXT,
  implementation_urgency TEXT,
  
  -- Barriers & Concerns
  adoption_barriers TEXT[],
  top_concerns TEXT[],
  previous_failed_initiatives TEXT,
  
  -- Free-form insights
  additional_comments TEXT,
  specific_questions TEXT[],
  
  -- Consent & Status
  consent_to_contact BOOLEAN DEFAULT FALSE,
  consent_to_aggregate BOOLEAN DEFAULT TRUE,
  is_complete BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER
);

CREATE INDEX IF NOT EXISTS idx_survey_type ON survey_responses(survey_type);
CREATE INDEX IF NOT EXISTS idx_survey_industry ON survey_responses(industry);
CREATE INDEX IF NOT EXISTS idx_survey_state ON survey_responses(location_state);
CREATE INDEX IF NOT EXISTS idx_survey_complete ON survey_responses(is_complete) WHERE is_complete = TRUE;
CREATE INDEX IF NOT EXISTS idx_survey_session ON survey_responses(session_id);

-- 5. ECOSYSTEM DIRECTORY - Vendors, consultants, associations
CREATE TABLE IF NOT EXISTS ecosystem_directory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Entity type
  entity_type TEXT NOT NULL CHECK (entity_type IN (
    'solution_vendor', 'system_integrator', 'consultant', 
    'industry_association', 'government_body', 'research_institution',
    'training_provider', 'funding_agency'
  )),
  
  -- Basic info
  name TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  
  -- Contact
  contact_email TEXT,
  contact_phone TEXT,
  headquarters_city TEXT,
  headquarters_state TEXT,
  operating_regions TEXT[] DEFAULT '{}',
  
  -- Specialization
  industries_served TEXT[] DEFAULT '{}',
  solutions_offered TEXT[] DEFAULT '{}', -- For vendors/integrators
  company_sizes_served TEXT[] DEFAULT '{}',
  
  -- Credentials
  certifications TEXT[],
  partnerships TEXT[],
  notable_clients TEXT[],
  years_in_business INTEGER,
  
  -- For government/associations
  scheme_names TEXT[], -- e.g., ['SAMARTH Udyog', 'PLI Scheme']
  funding_available BOOLEAN,
  
  -- Validation
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  listing_status TEXT DEFAULT 'active' CHECK (listing_status IN ('pending', 'active', 'suspended')),
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ecosystem_type ON ecosystem_directory(entity_type);
CREATE INDEX IF NOT EXISTS idx_ecosystem_industries ON ecosystem_directory USING GIN(industries_served);
CREATE INDEX IF NOT EXISTS idx_ecosystem_solutions ON ecosystem_directory USING GIN(solutions_offered);
CREATE INDEX IF NOT EXISTS idx_ecosystem_active ON ecosystem_directory(listing_status) WHERE listing_status = 'active';
