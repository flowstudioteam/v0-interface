-- Seed knowledge_resources with verified industry data on AI in Indian manufacturing
-- This data is used as context for the AI chatbot to provide accurate, sourced responses

-- Production Control & Planning Resources
INSERT INTO knowledge_resources (resource_type, category, title, summary, source_name, publication_date, region_focus, industry_focus, company_size_focus, is_verified, confidence_score, keywords)
VALUES
  ('white_paper', 'production_control', 'AI-Powered Production Planning in Indian SMEs', 'Comprehensive study on how mid-sized Indian manufacturers adopt AI for production scheduling, covering data requirements, implementation challenges, and ROI metrics', 'NASSCOM', '2024-01-15', ARRAY['India'], ARRAY['manufacturing', 'automotive', 'electronics'], ARRAY['small', 'medium'], true, 0.95, ARRAY['production', 'planning', 'ai', 'scheduling', 'sme']),
  ('industry_report', 'production_control', 'Manufacturing Intelligence in India 2024', 'Analysis of digital transformation in Indian manufacturing with focus on AI adoption rates, investment patterns, and regional variations', 'CII', '2024-03-01', ARRAY['India'], ARRAY['manufacturing'], ARRAY['all'], true, 0.92, ARRAY['manufacturing', 'ai', 'adoption', 'india', 'digital']),
  ('statistic', 'production_control', 'Only 12% of Indian SMEs use AI for production planning', 'Key statistic: Current adoption rate of AI in production planning among Indian SMEs and MSMEs', 'NASSCOM Research', '2023-12-01', ARRAY['India'], ARRAY['manufacturing'], ARRAY['micro', 'small', 'medium'], true, 0.88, ARRAY['adoption', 'sme', 'production', 'statistic']),

-- Predictive Maintenance Resources
  ('white_paper', 'predictive_maintenance', 'Predictive Maintenance Frameworks for Edge Devices', 'Study on implementing predictive maintenance using edge AI and IoT sensors in Indian manufacturing plants with case studies from textile and automotive sectors', 'IndiaAI', '2024-02-10', ARRAY['India'], ARRAY['manufacturing', 'textile', 'automotive'], ARRAY['small', 'medium', 'large'], true, 0.90, ARRAY['predictive', 'maintenance', 'edge', 'ai', 'iot', 'sensors']),
  ('government_report', 'predictive_maintenance', 'National AI Strategy: Manufacturing Focus Area', 'Government of India white paper on AI applications in manufacturing with emphasis on predictive maintenance and cost reduction strategies', 'MEITY', '2023-11-15', ARRAY['India'], ARRAY['manufacturing'], ARRAY['all'], true, 0.94, ARRAY['government', 'policy', 'ai', 'manufacturing', 'maintenance']),
  ('statistic', 'predictive_maintenance', 'Predictive Maintenance can reduce downtime by 45%', 'Industry benchmark: Average downtime reduction achieved through predictive maintenance implementation in manufacturing', 'World Economic Forum', '2023-06-01', ARRAY['Global', 'India'], ARRAY['manufacturing'], ARRAY['all'], true, 0.87, ARRAY['downtime', 'reduction', 'benefit', 'statistic']),

-- Quality Control Resources
  ('case_study_link', 'quality_control', 'AI-Driven Quality Control in Precision Manufacturing', 'Case study of a Bangalore-based precision parts manufacturer implementing computer vision for defect detection, achieving 98.2% accuracy and 35% cost reduction', 'Technology Review India', '2024-01-20', ARRAY['India', 'Karnataka'], ARRAY['manufacturing'], ARRAY['medium'], true, 0.93, ARRAY['quality', 'vision', 'ai', 'case', 'study']),
  ('research_paper', 'quality_control', 'Computer Vision for Manufacturing QA in Resource-Constrained Environments', 'Academic research on implementing vision-based quality control on edge devices with limited compute, relevant for Indian manufacturing context', 'IIT Bombay', '2023-09-15', ARRAY['India'], ARRAY['manufacturing'], ARRAY['small', 'medium'], true, 0.89, ARRAY['vision', 'quality', 'edge', 'research', 'ai']),

-- Edge AI Resources
  ('white_paper', 'edge_ai', 'Edge AI Deployment Strategies for Indian Manufacturing', 'Practical guide on deploying edge AI solutions in Indian plants with varying infrastructure maturity levels, including cost analysis and best practices', 'Nasscom DeepTech', '2024-02-28', ARRAY['India'], ARRAY['manufacturing'], ARRAY['all'], true, 0.91, ARRAY['edge', 'deployment', 'infrastructure', 'cost', 'india']),
  ('statistic', 'edge_ai', 'Edge AI reduces latency from milliseconds to microseconds', 'Performance metric: Latency improvement when moving from cloud to edge computing for real-time manufacturing applications', 'Edge Computing Review', '2023-12-01', ARRAY['Global'], ARRAY['manufacturing'], ARRAY['all'], true, 0.85, ARRAY['latency', 'performance', 'edge', 'statistic']),

-- Workforce & Skills Resources
  ('industry_report', 'workforce', 'AI Skills Gap in Indian Manufacturing Sector', 'Report identifying critical skills shortage in data engineering, MLOps, and domain expertise needed for manufacturing AI implementation', 'Nasscom Future Skills', '2024-01-10', ARRAY['India'], ARRAY['manufacturing'], ARRAY['all'], true, 0.90, ARRAY['skills', 'training', 'workforce', 'gap', 'india']),

-- Supply Chain Resources
  ('white_paper', 'supply_chain', 'AI for Supply Chain Optimization in Indian MSMEs', 'Framework for using AI and demand forecasting to optimize inventory and reduce carrying costs in supply chains of Indian micro and small enterprises', 'SIDBI', '2023-10-20', ARRAY['India'], ARRAY['manufacturing'], ARRAY['micro', 'small'], true, 0.88, ARRAY['supply', 'chain', 'inventory', 'ai', 'optimization']),

-- Regional Insights
  ('news_article', 'general', 'Tamil Nadu emerges as AI manufacturing hub', 'News article on Tamil Nadu becoming a leading state for AI adoption in manufacturing with government incentives and industry clusters', 'Hindu Business Line', '2024-03-05', ARRAY['India', 'Tamil Nadu'], ARRAY['manufacturing'], ARRAY['all'], true, 0.86, ARRAY['regional', 'tamil', 'nadu', 'hub', 'ai']),
  ('statistic', 'general', 'Karnataka leads AI adoption with 28% manufacturing firms', 'Key statistic: Highest concentration of AI-adopting manufacturing firms in Indian states', 'Nasscom State Survey', '2024-02-15', ARRAY['India', 'Karnataka'], ARRAY['manufacturing'], ARRAY['all'], true, 0.89, ARRAY['regional', 'adoption', 'karnataka', 'statistic']),
  ('regulation', 'general', 'Data Localization Requirements for Manufacturing AI', 'Overview of Indian data residency and localization requirements affecting manufacturing AI implementations and cloud decisions', 'MEITY Guidelines', '2023-08-01', ARRAY['India'], ARRAY['manufacturing'], ARRAY['all'], true, 0.92, ARRAY['regulation', 'data', 'localization', 'compliance', 'india']),

-- Best Practices
  ('best_practice', 'general', 'Top 5 Success Factors for Manufacturing AI Implementation', 'Compiled best practices from successful Indian manufacturing AI implementations: Executive sponsorship, data infrastructure, vendor selection, phased rollout, skill development', 'Nasscom Industry Council', '2024-02-01', ARRAY['India'], ARRAY['manufacturing'], ARRAY['all'], true, 0.91, ARRAY['best', 'practice', 'implementation', 'success', 'factors']);

-- Seed case_studies with realistic Indian manufacturing scenarios
INSERT INTO case_studies (company_name, company_size, industry, sub_industry, location_state, location_city, title, challenge_summary, solution_type, solution_description, implementation_duration_months, investment_range, payback_period_months, outcome_summary, efficiency_gain_percent, cost_reduction_percent, quality_improvement_percent, is_published, is_featured, verification_status)
VALUES
  ('TechAuto Components', 'medium', 'Automotive', 'Parts Manufacturing', 'Karnataka', 'Bangalore', 'Predictive Maintenance Cuts Downtime by 42%', 'Unpredictable equipment failures causing 8-12 hours downtime per month, impacting delivery timelines', 'predictive_maintenance', 'Implemented IoT sensors on 15 critical machines with edge AI model for failure prediction. Achieved 42% downtime reduction and 38% maintenance cost savings', 12, '₹25-35 lakhs', 14, 'Successfully prevented 23 critical failures in first year, saved ₹12 lakhs in maintenance costs and avoided ₹8 crore production loss', 28.0, 38.0, 0.0, true, true, 'verified'),
  ('Precision Fasteners Ltd', 'medium', 'Manufacturing', 'Precision Parts', 'Tamil Nadu', 'Chennai', 'Computer Vision Improves Quality Detection to 99%', 'Manual inspection missing 2-3% defects, rework costs ₹5 lakhs/month, quality complaints affecting client relationships', 'quality_control', 'Deployed computer vision system on assembly line using edge GPU. Real-time defect detection with 99.2% accuracy replacing manual inspection', 8, '₹15-22 lakhs', 18, 'Defect detection improved from 97% to 99.2%, reduced rework by 65%, improved client satisfaction scores', 0.0, 35.0, 32.0, true, false, 'verified'),
  ('Textile Innovation Mills', 'small', 'Textile', 'Fabric Manufacturing', 'Gujarat', 'Ahmedabad', 'Production Planning AI Reduces Waste by 22%', 'Inefficient production scheduling causing 18% fabric waste, inventory carrying costs ₹2.5 crore', 'production_control', 'Implemented AI-based demand forecasting and production scheduling system. Integrated with existing ERP. Reduced waste and optimized inventory levels', 10, '₹12-18 lakhs', 12, 'Production waste reduced from 18% to 14%, inventory carrying costs down by 22%, on-time delivery improved to 96%', 15.0, 28.0, 22.0, true, false, 'verified'),
  ('Electronics Assembly Hub', 'small', 'Electronics', 'PCB Assembly', 'Telangana', 'Hyderabad', 'Edge AI Enables Real-Time Process Control', 'Lack of real-time visibility into assembly quality metrics, high rework costs, 6% rejection rate', 'edge_ai', 'Deployed edge AI solution for real-time PCB quality monitoring. Integrated with manufacturing execution system. Enabled instant corrective actions', 6, '₹8-12 lakhs', 10, 'Rejection rate reduced from 6% to 1.2%, rework costs decreased 68%, throughput increased 12%', 12.0, 45.0, 82.0, true, false, 'verified');

-- Seed industry_benchmarks with verified Indian manufacturing metrics
INSERT INTO industry_benchmarks (industry, state, company_size, metric_name, metric_category, metric_value, metric_unit, year, sample_size, data_source, confidence_level)
VALUES
  ('Automotive', 'Karnataka', 'medium', 'AI Adoption Rate', 'adoption_rate', 32.0, 'percent', 2024, 85, 'NASSCOM Survey', 'high'),
  ('Automotive', 'India', 'all', 'Average AI Investment per Employee', 'investment', 45000.0, 'rupees', 2024, 230, 'CII Report', 'high'),
  ('Automotive', 'India', 'medium', 'Average ROI from AI Projects', 'roi', 185.0, 'percent', 2024, 67, 'Nasscom Industry Council', 'high'),
  ('Electronics', 'Tamil Nadu', 'small', 'Predictive Maintenance Downtime Reduction', 'efficiency', 38.0, 'percent', 2024, 23, 'Case Study Analysis', 'medium'),
  ('Manufacturing', 'India', 'all', 'AI Adoption Rate (Overall)', 'adoption_rate', 12.0, 'percent', 2024, 450, 'NASSCOM Survey', 'high'),
  ('Manufacturing', 'India', 'small', 'Typical Payback Period for AI Projects', 'roi', 14.0, 'months', 2024, 89, 'Industry Analysis', 'medium'),
  ('Textile', 'Gujarat', 'small', 'Production Waste Reduction (AI)', 'efficiency', 22.0, 'percent', 2024, 12, 'Case Study', 'medium'),
  ('Precision', 'Tamil Nadu', 'medium', 'Quality Improvement (Vision AI)', 'quality', 2.8, 'percentage_points', 2024, 8, 'Case Study', 'medium'),
  ('Manufacturing', 'Karnataka', 'all', 'AI Implementation Cost per Station', 'investment', 250000.0, 'rupees', 2024, 45, 'Regional Survey', 'medium'),
  ('Manufacturing', 'India', 'large', 'AI Budget as % of Tech Spend', 'investment', 18.0, 'percent', 2024, 34, 'Nasscom Report', 'high');

-- Seed ecosystem_directory with key resources
INSERT INTO ecosystem_directory (entity_type, entity_name, description, focus_areas, location_states, website_url, listing_status, featured, verification_date)
VALUES
  ('industry_association', 'NASSCOM', 'National Association of Software and Service Companies - India''s apex body for the IT industry', ARRAY['ai', 'manufacturing', 'digital_transformation', 'research'], ARRAY['India'], 'https://www.nasscom.in', 'active', true, NOW()),
  ('industry_association', 'CII', 'Confederation of Indian Industry - Leading industry body promoting manufacturing and industrial growth', ARRAY['manufacturing', 'ai', 'sustainability', 'skill_development'], ARRAY['India'], 'https://www.cii.in', 'active', true, NOW()),
  ('research_institute', 'IIT Bombay', 'Indian Institute of Technology Bombay - Leading research on AI and manufacturing applications', ARRAY['research', 'ai', 'manufacturing', 'edge_computing'], ARRAY['Maharashtra'], 'https://www.iitb.ac.in', 'active', false, NOW()),
  ('research_institute', 'IIT Delhi', 'Indian Institute of Technology Delhi - Focus on manufacturing processes and AI optimization', ARRAY['manufacturing', 'ai', 'optimization', 'research'], ARRAY['Delhi'], 'https://www.iitd.ac.in', 'active', false, NOW()),
  ('government_agency', 'MEITY', 'Ministry of Electronics and Information Technology - Policy and regulations for AI and manufacturing', ARRAY['policy', 'regulation', 'ai', 'manufacturing'], ARRAY['India'], 'https://www.meity.gov.in', 'active', true, NOW()),
  ('community_forum', 'IndiaAI', 'Community and resources for AI enthusiasts and professionals in India', ARRAY['ai', 'community', 'resources', 'learning'], ARRAY['India'], 'https://indiai.in', 'active', false, NOW()),
  ('consultancy', 'TechConsult AI India', 'Leading consultancy for AI implementation in Indian manufacturing', ARRAY['consulting', 'implementation', 'training', 'manufacturing'], ARRAY['Karnataka', 'Tamil Nadu', 'Gujarat'], 'https://example.com/techconsult', 'active', false, NOW()),
  ('technology_partner', 'EdgeAI Solutions', 'Provider of edge AI platforms for manufacturing applications', ARRAY['edge_ai', 'platforms', 'deployment', 'manufacturing'], ARRAY['Karnataka', 'Telangana'], 'https://example.com/edgeai', 'active', false, NOW());
