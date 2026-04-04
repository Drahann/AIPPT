import { SlideContent } from '@/lib/types'

export const MOCK_SLIDES: SlideContent[] = [
  { layout: 'cover', title: 'AI Presentation Generator', subtitle: 'Theme-aware slide layout engine' },
  { layout: 'section-header', title: 'Core Technology', subtitle: 'CHAPTER ONE: CORE TECHNOLOGY' },
  { layout: 'text-center', title: 'Overview', subtitle: 'A concise framing statement for this section.', body: [{ type: 'paragraph', text: 'This section introduces context and intent before details begin.' }] },
  { layout: 'text-bullets', title: 'HIGHLIGHTS / LOWLIGHTS', subtitle: "TODAY'S DATE", body: [{ type: 'bullet', items: ['Delivered a faster review workflow for leadership reporting.', 'Removed repeated manual handoff in cross-functional updates.', 'Improved quality controls for high-risk operational metrics.', 'Clarified ownership and decision criteria for blocked tasks.', 'Reduced turnaround time for dashboard updates across teams.', 'Created reusable documentation links for future onboarding.'] }] },
  { layout: 'image-text', title: 'Polished Layout', body: [{ type: 'paragraph', text: 'Auto spacing and alignment keep each slide clean and consistent.' }], image: { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426', prompt: 'dashboard screenshot', alt: 'Dashboard' } },
  { layout: 'text-image', title: 'Problem Statement', body: [{ type: 'paragraph', text: 'Most teams still rely on manual handoff and disconnected reports, which causes slow decisions and low confidence in KPI interpretation.' }], image: { url: 'https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&q=80&w=2070', prompt: 'problem analysis visual', alt: 'Problem context' } },
  { layout: 'image-center', title: 'Technical Overview', body: [{ type: 'paragraph', text: 'A concise explanation of the visual, focused on the system structure and what the audience should understand first.' }], image: { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070', prompt: 'presentation room', alt: 'Presentation' } },
  { layout: 'image-full', title: 'Full Background Scene', image: { url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=2029', prompt: 'abstract background', alt: 'Background' } },
  { layout: 'cards-2', title: 'Solution Coverage', subtitle: 'Enterprise Scenarios', cards: [
    { heading: 'Business Plan', body: 'Investor-ready storytelling slides' },
    { heading: 'Annual Review', body: 'Data-first reporting pages' }
  ] },
  { layout: 'cards-3', title: 'Workflow', subtitle: 'AI Rendering Pipeline', cards: [
    { heading: 'Ingestion', body: 'Parse structure and key points from documents', icon: 'search' },
    { heading: 'Matching', body: 'Select best-fit layouts automatically', icon: 'zap' },
    { heading: 'Generation', body: 'Render instantly and export safely', icon: 'check' }
  ] },
  { layout: 'cards-4', title: 'Solution Coverage', cards: [
    { heading: 'Business Plan', body: 'Investor-ready storytelling slides', icon: 'trending-up' },
    { heading: 'Annual Review', body: 'Data-first reporting pages', icon: 'target' },
    { heading: 'Training', body: 'Clear educational presentation structures', icon: 'users' },
    { heading: 'Brand Launch', body: 'High-impact visual communication', icon: 'globe' }
  ] },
  { layout: 'comparison', title: 'Comparison', subtitle: '(Task)', left: {
    heading: 'Teamwork (Task)',
    items: [
      'User can create/edit/view/delete the task.',
      '!User can add subtask for the main task.',
      '!Comment feature added for the task.',
      '!Select project is mandatory for task create.',
      'If user is a member of project?',
      'Project owner can view and delete the task.',
    ],
    tone: 'positive'
  }, right: {
    heading: 'DigitalCRM (Task)',
    items: [
      'User can create/edit/view/delete the task.',
      '!No subtask feature added.',
      '!No comment feature added.',
      '!Not mandatory in DigitalCRM.',
      'If user is a member of project?',
      'Project owner can only view the task.',
    ],
    tone: 'negative'
  } },
  { layout: 'timeline', title: 'Roadmap & Milestones', events: [
    { date: '0-12个月', title: '推广模式', description: '聚焦航空、国防领域已验证标杆客户，深度匹配其高危工序实训成本高、专家经验难沉淀等核心痛点，定制硬件+虚拟场景+量化评估最小可行方案。' },
    { date: '12-24个月', title: '规模增长', description: '深度绑定哈尔滨工业大学智能人机交互研究中心等校企合作平台，将灯塔案例转化为联合品牌资产。策划产教对接会，定向邀请东北地区重点企业。' },
    { date: '24个月后', title: '行业领先', description: '提炼标准化推广包，依托前期建立的区域实训示范点，以技术展示+本地化服务模式实现区域市场渗透。' },
    { date: '2026+', title: '全球扩张', description: '通过全球性峰会实现跨域复制，构建标杆引领-区域扎根-生态辐射的可持续增长体系。' }
  ] },
  { layout: 'milestone-list', title: 'Annual Achievement List', subtitle: 'Program Timeline', events: [
    { date: '2022', title: 'Foundation', description: 'Completed core architecture and delivered first enterprise pilot with measurable baseline gains.' },
    { date: '2023', title: 'Expansion', description: 'Scaled across departments and reduced reporting cycle time through standardized workflows.' },
    { date: '2024', title: 'Optimization', description: 'Introduced governance controls and improved cross-team data consistency in production.' },
    { date: '2025', title: 'Impact', description: 'Reached strategic milestones with stable operations and stronger decision velocity.' }
  ] },
  { layout: 'metrics', title: 'Proof and Momentum', subtitle: 'Trusted by data-driven teams', metrics: [
    { value: '20+', label: 'Organizations onboarded', icon: 'star' },
    { value: '60%', label: 'Faster reporting cycle', icon: 'clock' },
    { value: '91%', label: 'Less manual cleanup', icon: 'settings' },
    { value: '3.5x', label: 'More actionable insights', icon: 'globe' },
    { value: '48h', label: 'Average deployment time', icon: 'rocket' },
    { value: '99.2%', label: 'Cross-system consistency', icon: 'check' }
  ] },
  { layout: 'quote', title: 'User Quotes', cards: [
    { heading: 'Jordan Lee - Operations', body: 'The best quotes connect directly to your narrative.' },
    { heading: 'Maya Chen - Finance', body: 'Keep each quote focused on one practical gain.' },
    { heading: 'Alex Rivera - Product', body: 'Concise testimonials are easier to scan and trust.' },
    { heading: 'Sofia Patel - Strategy', body: 'Use this block for compact proof points.' }
  ] },
  { layout: 'quote-no-avatar', title: 'Voice Highlights', cards: [
    { heading: 'CFO - Manufacturing', body: 'Reporting dropped from weeks to days with strong audit confidence.' },
    { heading: 'Lead - Retail', body: 'One data source removed cross-team confusion and sped decisions.' },
    { heading: 'Director - Energy', body: 'Quarterly decisions now use clearer assumptions.' },
    { heading: 'Manager - Public Sector', body: 'Context and evidence stay aligned in one place.' },
    { heading: 'VP Strategy - Enterprise', body: 'Feedback remains compact and comparable on one slide.' }
  ] },
  { layout: 'ending', title: 'Thank You', subtitle: 'Questions: contact@aippt.com' },
  { layout: 'chart-bar', title: 'Headline', subtitle: 'PROJECT NAME', body: [{ type: 'paragraph', text: 'Brief context paragraph for the chart area.' }], chart: { type: 'bar', title: 'Label', categories: ['A', 'B', 'C', 'D'], series: [{ name: 'Series', values: [82, 56, 41, 74] }] } },
  { layout: 'chart-bar-compare', title: 'Product Performance Comparison', chart: { type: 'bar', title: 'KPI Comparison', categories: ['Conversion Rate', 'Retention', 'Task Success', 'Satisfaction'], series: [{ name: 'Before', values: [2.6, 3.1, 2.7, 3.0] }, { name: 'After', values: [3.8, 4.2, 3.9, 4.4] }] } },
  { layout: 'chart-line', title: 'Active Users', chart: { type: 'line', title: 'DAU Trend', categories: ['Jan', 'Feb', 'Mar', 'Apr'], series: [{ name: 'DAU', values: [1200, 1800, 2400, 3600] }] } },
  { layout: 'chart-pie', title: 'Subtitle', subtitle: 'Caption', body: [{ type: 'bullet', items: ['Priority segment with high retention and growth.', 'Strong adoption in the mainstream digital channel.', 'Stable contribution from mature enterprise users.', 'Emerging segment with upside potential next quarter.'] }], chart: { type: 'pie', title: 'Company Name', categories: ['Data Point A', 'Data Point B', 'Data Point C', 'Data Point D'], series: [{ name: 'Share', values: [26, 31, 22, 21] }] } },
  { layout: 'cards-split', title: 'Key features', subtitle: 'From raw signals to confident decisions', cards: [
    { heading: 'ESG data aggregation', body: 'Unify scattered data into one reliable source of truth.', image: { url: 'https://images.unsplash.com/photo-1618477462146-050d2767eac4?auto=format&fit=crop&q=80&w=1400' } },
    { heading: 'AI-assisted carbon accounting', body: 'Automatically identify, calculate, and validate emissions data.', image: { url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80&w=1400' } },
    { heading: 'Scenario modeling', body: 'Explore what-if projections with transparent models.', image: { url: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&q=80&w=1400' } },
    { heading: 'Reporting automation', body: 'Generate audit-ready reports in minutes.', image: { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1400' } },
    { heading: 'Board-ready insights', body: 'Turn multi-source signals into executive summaries.', image: { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1400' } }
  ] },
  { layout: 'staggered-cards', title: 'Design Trends', cards: [
    { heading: 'Glassmorphism', body: 'Soft shadows and frosted surfaces', icon: 'star' },
    { heading: 'Motion', body: 'Fine-grained transition and interaction', icon: 'zap' },
    { heading: 'Minimalism', body: 'Whitespace and rhythm first', icon: 'shield' }
  ] },
  { layout: 'features-list-image', title: 'Why choose us', subtitle: 'Built for professional teams', cards: [
    { heading: 'One-click PPTX', body: 'Export directly to Microsoft Office', image: { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070', prompt: 'export workflow' } },
    { heading: 'Online presenting', body: 'Presenter view and notes supported', image: { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2070', prompt: 'online presentation' } }
  ] },
  { layout: 'metrics-rings', title: 'Problem Statistics', subtitle: '数据支撑', metrics: [
    { value: '75%', label: 'Users lack confidence in reporting workflows', icon: 'trending-up' },
    { value: '62%', label: 'Teams report repeated manual handoff issues', icon: 'star' },
    { value: '81%', label: 'Leaders need faster KPI visibility', icon: 'target' }
  ] },
  { layout: 'list-featured', title: '8 insights or principles you need to know', subtitle: 'PRODUCT / FEATURE NAME', cards: [
    { heading: 'FIRST THING', body: 'Use this slide for principles, product decisions, and user needs.' },
    { heading: 'SECOND THING', body: 'Keep each block short and direct.' },
    { heading: 'THIRD THING', body: 'Focus each point on essential information.' },
    { heading: 'FOURTH THING', body: 'Remove blocks when density gets high.' },
    { heading: 'FIFTH THING', body: 'Dense slides are harder to scan.' },
    { heading: 'SIXTH THING', body: 'Use this for insights or strategic tradeoffs.' },
    { heading: 'SEVENTH THING', body: 'The layout compresses as point count grows.' },
    { heading: 'EIGHTH THING', body: 'Split into two slides when needed.' }
  ] },
  { layout: 'team-members', title: 'Growth 2024 Project', subtitle: 'Firstname Lastname', cards: [
    { heading: 'Soundharya', body: 'Core design lead for the experience team.', icon: 'brush' },
    { heading: 'Daniel', body: 'Senior product designer focusing on growth.', icon: 'layout' },
    { heading: 'Jasmine', body: 'Project manager overseeing the Q1 roadmap.', icon: 'calendar' },
    { heading: 'Wendy', body: 'Delivery lead for the cross-platform initial release.', icon: 'rocket' },
    { heading: 'Ben', body: 'Fullstack engineer building the layout engine.', icon: 'code' },
    { heading: 'Sarah', body: 'UX Researcher validating customer feedback.', icon: 'search' }
  ] },
  { layout: 'cards-4-featured', title: 'Next Steps', cards: [
    { heading: 'Market Pilot', body: 'Deploy the beta version to the initial group of 500 users to gather quantitative feedback.' },
    { heading: 'Feature Expansion', body: 'Integrate advanced analytics and real-time collaboration tools into the core platform.' },
    { heading: 'Brand Alignment', body: 'Refresh all visual assets to match the new organic branding guidelines.' },
    { heading: 'Seed Round', body: 'Close the current funding round with institutional partners by the end of Q3.' }
  ] },
  { 
    layout: 'grid-2x2-featured', 
    title: 'Readings & course text', 
    cards: [
      { heading: 'Muriel Cooper (MIT Press)', body: 'March 14, 2023 by David Reinfurt, Robert Wiesenberger.' },
      { heading: 'Architectural Digest at 100', body: 'March 14, 2023 by Amy Astley, et al.' },
      { heading: 'Design, Second Edition', body: 'The Definitive Visual Guide by Judith Miller, et al.' },
      { heading: 'Arranging Things', body: 'Hardcover by Colin King, Sam Cochran.' }
    ] 
  },
  {
    layout: 'cards-3-featured',
    title: 'Course outline',
    cards: [
      { heading: 'Week 1', body: 'A paragraph is a structural unit in writing that focuses on a central idea.\n\nParagraphs help organize thoughts and information, guiding readers through the text.' },
      { heading: 'Week 2', body: 'A paragraph is a structural unit in writing that focuses on a central idea.\n\nParagraphs help organize thoughts and information, guiding readers through the text.' },
      { heading: 'Week 3', body: 'A paragraph is a structural unit in writing that focuses on a central idea.\n\nParagraphs help organize thoughts and information, guiding readers through the text.' }
    ]
  },
  {
    layout: 'cards-3-stack',
    title: 'EXECUTIVE SUMMARY',
    cards: [
      { heading: 'Market Analysis', body: 'Our research indicates a 25% increase in demand for sustainable energy solutions.\n\nWe recommend doubling the R&D budget for our solar panel initiative.' },
      { heading: 'Operational Efficiency', body: 'Supply chain optimization has reduced logistical costs by 12% this quarter.\n\nImplement automated inventory tracking across all regional warehouses.' },
      { heading: 'Future Growth', body: 'Expansion into emerging markets is expected to yield 15% revenue growth by 2026.\n\nPrioritize strategic partnerships with local distributors in SE Asia.' }
    ]
  },
]
