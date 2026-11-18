// All personal content lives in this file — edit here to customize the portfolio.
// Any link left as an empty string is hidden automatically (no broken links).

export const site = {
  name: 'Sanny',
  fullName: 'Sanny Sabio',
  initial: 'S',
  badgeNumber: 'NO. 001',
  portrait: '/profile.webp',
  role: 'Full-Stack & Systems Developer',
  collegeRole: 'BS Information Technology — Cor Jesu College',
  tagline:
    'I design and build fast, expressive web, desktop, AR, and Web3 systems with a focus on detail and motion.',
  taglineHighlight: 'fast, expressive',
  status: 'Available for work',
  location: 'Digos City, Philippines',
  coordinates: '06°45′N 125°21′E',
  timezone: 'Asia/Manila',
  emailUser: 'sannysabio14',
  emailDomain: 'gmail.com',
  get email() {
    return [this.emailUser, this.emailDomain].join(String.fromCharCode(64))
  },
  github: 'https://github.com/shoyooi',
  githubHandle: '@shoyooi',
  linkedin: '',
  instagram: '',
  resume: '', // Optional path to a PDF in public/ (e.g. '/resume.pdf'); interactive CV modal works out of the box
  formEndpoint: '', // Optional Formspree/Web3Forms URL; falls back to mailto composer when empty
}

export const about = {
  lead:
    'I turn complex ideas into clean, considered digital experiences — where scalable architecture, design, and motion work together.',
  short: [
    'I am Sanny Sabio, a Full-Stack & Systems Developer based in Digos City, Davao del Sur, currently pursuing my BS in Information Technology at Cor Jesu College while engineering production campus platforms, Web3 applications, and interactive learning tools.',
    'From co-creating the Cor Jesu College EDTECH hall-booking and equipment management platform (Laravel 12, Vue 3, TypeScript, Electron) to building on-chain budget governance on Polygon Amoy and bilingual AR hardware labs in Unity, I care deeply about reliability, security, and craft.',
  ],
  stats: [
    { value: 3, suffix: '+', label: 'Years building' },
    { value: 4, suffix: '+', label: 'Systems shipped' },
    { value: 5, suffix: '', label: 'Verified credentials' },
  ],
}

export const projects = [
  {
    id: 'edtech-system',
    status: 'Built — in campus use',
    category: 'Full-Stack / EdTech',
    year: '2025',
    title: 'Cor Jesu College EDTECH System',
    description:
      'Institutional hall-booking and equipment borrowing management platform co-created for Cor Jesu College, uniting reservation workflows, approvals, asset tracking, and an offline-capable Electron desktop client.',
    stack: ['Laravel 12', 'Vue 3', 'Vuetify 3', 'TypeScript', 'Electron'],
    image: '',
    github: 'https://github.com/EDTECH-CJC/Edtech',
    privateRepo: true,
    privateRepoNote: 'Private CJC Campus Repo (Org Access Required)',
    demo: '',
    brief: {
      headline: 'Institutional Facility Booking & Asset Tracking Platform',
      summary:
        'Co-created for Cor Jesu College to replace manual paper reservation slips with a unified full-stack web and desktop system supporting conflict-free hall scheduling, multi-stage approvals, and real-time equipment inventory.',
      metrics: [
        { label: 'DEPLOYMENT', value: 'Campus Production' },
        { label: 'PLATFORMS', value: 'Web & Electron Desktop' },
        { label: 'ARCHITECTURE', value: 'Laravel 12 + Vue 3' },
      ],
      highlights: [
        'Automated hall & laboratory conflict detection with multi-stage administrative approval routing',
        'Real-time equipment borrowing, serial-level inventory tracking, and return verification logs',
        'Offline-capable Electron desktop client synchronized with a typed Vue 3 + Vuetify 3 interface',
      ],
    },
  },
  {
    id: 'budget-chain',
    status: 'Capstone — in progress',
    category: 'Web3 Finance',
    year: '2026',
    title: 'ChainBudget',
    fullTitle: 'Blockchain Budget Management System',
    description:
      'Transparent organizational fund-monitoring platform powered by the Polygon Amoy network, recording every allocation, milestone approval, and expense disbursement on-chain.',
    stack: ['Next.js', 'Solidity', 'Polygon Amoy', 'Node.js', 'MongoDB Atlas'],
    image: '/projects/budget-chain.webp',
    github: '',
    demo: 'https://chainbudget.vercel.app/',
    bg: '#ffffff',
    fit: 'contain',
    brief: {
      headline: 'Verifiable On-Chain Budget & Expense Governance',
      summary:
        'Designed for organizations requiring tamper-proof financial accountability. ChainBudget anchors budget allocations and expense disbursements to Polygon Amoy smart contracts while indexing activity for fast dashboard analytics.',
      metrics: [
        { label: 'NETWORK', value: 'Polygon Amoy L2' },
        { label: 'CONTRACTS', value: 'Solidity EVM' },
        { label: 'FRONTEND', value: 'Next.js + Wallet Auth' },
      ],
      highlights: [
        'Immutable smart-contract ledger recording organizational allocations and department spending',
        'Role-based approval workflows with wallet-authenticated transaction signing',
        'Hybrid Next.js + MongoDB Atlas indexer for instant audit search and visual financial reporting',
      ],
    },
  },
  {
    id: 'desktop-components',
    status: 'Built',
    category: 'AR / Education',
    year: '2025',
    title: 'AR Desktop Component Lab',
    fullTitle: 'AR Desktop Component Identification',
    description:
      'Augmented-reality hardware learning application built in Unity that identifies desktop computer components and overlays interactive explanations in English and Cebuano.',
    stack: ['Unity', 'AR Foundation', 'C#', 'JSON', '3D UI'],
    image: '/projects/desktop-components.webp',
    github: 'https://github.com/sannysabio-ux/DESKTOP_COMPONENTS',
    demo: '',
    bg: '#ffffff',
    brief: {
      headline: 'Bilingual Augmented-Reality Hardware Identification',
      summary:
        'An mobile AR laboratory tool enabling IT students to point their camera at physical motherboard and desktop hardware to inspect 3D callouts, functional diagrams, and localized English/Cebuano lessons.',
      metrics: [
        { label: 'ENGINE', value: 'Unity + AR Foundation' },
        { label: 'LANGUAGES', value: 'English & Cebuano' },
        { label: 'DATA LAYER', value: 'Structured JSON' },
      ],
      highlights: [
        'Low-latency camera tracking and spatial callout overlays for core PC hardware components',
        'Instant runtime language switching between English and Cebuano technical explanations',
        'Modular JSON curriculum schema allowing educators to extend component definitions cleanly',
      ],
    },
  },
  {
    id: 'explore',
    status: 'Prototype — Milestone 2',
    category: 'Product Design',
    year: '2025',
    title: 'Explore: Rizal Avenue',
    fullTitle: 'Explore: Rizal Avenue Discovery',
    description:
      'Hyperlocal urban discovery and merchant-spotlight concept surfacing hidden culinary and cultural gems along Rizal Avenue, Digos City across a 7-screen Figma prototype.',
    stack: ['Figma', 'Product Design', 'Design Systems', 'Venture Research'],
    image: '/projects/explore.webp',
    github: '',
    demo: '',
    bg: '#ffffff',
    fit: 'contain',
    brief: {
      headline: 'Hyperlocal Corridor Discovery & Venture Prototype',
      summary:
        'Created to bridge independent local merchants along Rizal Avenue with students and visitors through curated walking routes, verified reviews, and lightweight digital storefronts.',
      metrics: [
        { label: 'STAGE', value: 'Milestone 2 Prototype' },
        { label: 'SCOPE', value: '7 Interactive Screens' },
        { label: 'TOOLING', value: 'Figma Design System' },
      ],
      highlights: [
        'End-to-end onboarding, map-based corridor browsing, merchant cards, and bookmark flows',
        'Reusable component token library optimized for mobile one-handed navigation',
        'Backed by customer-discovery interviews and Wadhwani Ignite venture modeling',
      ],
    },
  },
]

export const skills = [
  {
    category: 'Languages',
    items: ['TypeScript', 'JavaScript', 'PHP', 'Solidity', 'C#', 'Dart'],
  },
  {
    category: 'Frontend & Mobile',
    items: ['Vue 3', 'Vuetify 3', 'React', 'Next.js', 'Flutter', 'GSAP'],
  },
  {
    category: 'Backend & Desktop',
    items: ['Laravel 12', 'Node.js', 'Electron', 'MongoDB Atlas', 'MySQL', 'REST APIs'],
  },
  {
    category: 'AR, Web3 & Tools',
    items: ['Unity', 'AR Foundation', 'Polygon Amoy', 'Figma', 'Git & GitHub', 'Vercel'],
  },
]

export const certificates = [
  {
    id: 'ignite-lite',
    title: 'Ignite Lite — Philippines',
    issuer: 'Wadhwani Foundation',
    year: '2026',
    date: 'July 13, 2026',
    detail: 'Certificate of Content Completion · 24 hours of coursework in ideation, business modeling, and financial planning',
    tags: ['Venture Ideation', 'Business Modeling', 'Financial Planning', '24-Hr Program'],
    image: '/certificates/cert-ignite.webp',
  },
  {
    id: 'network-defense',
    title: 'Network Defense',
    issuer: 'Cisco Networking Academy',
    year: '2026',
    date: 'May 23, 2026',
    detail: 'Offered by the DICT-ITU DTC Initiative · Network hardening, firewall configuration, and access control',
    tags: ['Network Hardening', 'Access Control', 'Firewall Defense', 'DICT-ITU DTC'],
    image: '/certificates/cert-network.webp',
  },
  {
    id: 'cyber-threat-management',
    title: 'Cyber Threat Management',
    issuer: 'Cisco Networking Academy',
    year: '2026',
    date: 'May 23, 2026',
    detail: 'Offered by the DICT-ITU DTC Initiative · Governance, threat intelligence, vulnerability assessment, and incident response',
    tags: ['Threat Intelligence', 'Incident Response', 'Risk Assessment', 'Security Governance'],
    image: '/certificates/cert-threat.webp',
  },
  {
    id: 'endpoint-security',
    title: 'Endpoint Security',
    issuer: 'Cisco Networking Academy',
    year: '2026',
    date: 'May 22, 2026',
    detail: 'Offered by the DICT-ITU DTC Initiative · Host protection, OS security, malware analysis, and endpoint forensics',
    tags: ['Endpoint Protection', 'OS Hardening', 'Malware Defense', 'System Forensics'],
    image: '/certificates/cert-endpoint.webp',
  },
  {
    id: 'cert-base',
    title: 'Base Community Townhall IRL',
    issuer: 'Base Philippines',
    year: '2025',
    date: 'September 19, 2025',
    detail: 'Certificate of Participation · Base Community Townhall IRL held at Cor Jesu College of Digos City',
    tags: ['Base L2 Ecosystem', 'Onchain Builders', 'Web3 Community', 'Smart Contracts'],
    image: '/certificates/cert-base.webp',
  },
]

export const timeline = [
  {
    period: '2025 — PRESENT',
    tag: 'Campus Platform',
    role: 'Co-Creator & Full-Stack Developer',
    org: 'Cor Jesu College EDTECH System · Digos City',
    detail:
      'Co-architected the institutional hall-booking, multi-stage approval workflow, and equipment inventory platform using Laravel 12, Vue 3, Vuetify 3, TypeScript, and an offline-capable Electron desktop client.',
  },
  {
    period: '2025 — 2026',
    tag: 'Capstone & R&D',
    role: 'Blockchain, AR & Systems Developer',
    org: 'Applied Engineering & Independent Builds · Digos City',
    detail:
      'Engineered an on-chain budget governance platform on Polygon Amoy (Solidity, Next.js, Node.js), a bilingual English/Cebuano AR hardware-identification app in Unity, and a 7-screen discovery prototype in Figma.',
  },
  {
    period: '2023 — PRESENT',
    tag: 'Education',
    role: 'BS in Information Technology',
    org: 'Cor Jesu College (CJC) · Digos City',
    detail:
      'Relevant coursework in Software Engineering, Full-Stack Web & Desktop Architecture, Database Systems, Mobile Development with Flutter, Information Assurance, and Data Privacy.',
  },
  {
    period: '2025 — 2026',
    tag: 'Credentials',
    role: 'Cybersecurity & Venture Training',
    org: 'Cisco Networking Academy · Wadhwani Foundation · Base PH',
    detail:
      'Completed Network Defense, Cyber Threat Management, and Endpoint Security under the DICT-ITU DTC Initiative, alongside 24 hours of entrepreneurship coursework in Wadhwani Ignite Lite and Base PH.',
  },
]

export const activity = {
  totalCommits: '540+',
  headlineLabel: 'Commits & Shipments / Year',
  subtitle:
    'Continuous development activity and code shipments on GitHub across full-stack campus platforms, AR tools, and Web3 systems.',
  stats: [
    { value: '96', label: 'Active days' },
    { value: '18d', label: 'Longest streak' },
    { value: '34', label: 'Peak in 1 day' },
  ],
  handle: '@shoyooi',
  profileUrl: 'https://github.com/shoyooi',
  months: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
}
