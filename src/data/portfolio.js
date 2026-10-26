// All personal content lives in this file — it's the only one you need to edit.
// Any link left as an empty string is hidden automatically (no broken links).

export const site = {
  name: 'Sanny',
  initial: 'S',
  role: 'BS Information Technology — Cor Jesu College',
  tagline:
    'I build across blockchain, augmented reality, and product design — usually on projects where several moving parts need to add up to something someone else can rely on.',
  intro:
    "Hi, I'm Sanny — a BS Information Technology in Cor Jesu College Inc, student building across blockchain, augmented reality, and product design.",
  aside:
    'Currently learning React and GSAP animation, Solidity, and the privacy side of building software.',
  status: 'Open for collaborations',
  location: 'Digos City, Philippines',
  timezone: 'Asia/Manila',
  email: 'sannysabio14@gmail.com',
  github: 'https://github.com/shoyooi',
  linkedin: '',
}

// Each project renders as a card. Fill in `image` (a file in public/projects/),
// `github`, and `demo` as they become available — empty values are hidden.
export const projects = [
  {
    id: 'budget-chain',
    status: 'Capstone — in progress',
    category: 'Blockchain',
    year: '2026',
    title: 'Blockchain Budget Management System',
    description:
      'A transparent fund-monitoring platform for organizations on the Polygon Amoy testnet, where every allocation and expense is recorded by a smart contract.',
    stack: ['Next.js', 'Node.js', 'Solidity', 'Polygon Amoy', 'MongoDB Atlas'],
    image: '/projects/budget-chain.png',
    github: '',
    demo: 'https://chainbudget.vercel.app/',
  },
  {
    id: 'desktop-components',
    status: 'Built',
    category: 'AR / Education',
    year: '2025',
    title: 'AR Desktop Component Identification',
    description:
      'An augmented-reality learning tool that names and explains desktop hardware in English or Cebuano when students point a device at it.',
    stack: ['Unity', 'AR Foundation', 'C#', 'JSON'],
    image: '/projects/desktop-components.png',
    github: 'https://github.com/sannysabio-ux/DESKTOP_COMPONENTS',
    demo: '',
    bg: '#ffffff',
  },
  {
    id: 'explore',
    status: 'Prototype — Milestone 2',
    category: 'Product Design',
    year: '2025',
    title: 'Explore: Rizal Avenue Discovery',
    description:
      'A hyperlocal discovery app surfacing the hidden gems of Rizal Avenue, Digos City, prototyped across seven screens in Figma.',
    stack: ['Figma', 'Product design', 'Venture research'],
    image: '/projects/explore.png',
    github: '',
    demo: '',
  }
]

// Shown as the pop-in slideshow. Images live in public/certificates/.
// Newest first.
export const certificates = [
  {
    id: 'ignite-lite',
    title: 'Ignite Lite — Philippines',
    issuer: 'Wadhwani Foundation',
    detail: 'Certificate of Content Completion · 24 hours of coursework in ideation, business modeling, and financial planning',
    date: 'July 13, 2026',
    image: '/certificates/cert-ignite.jpg',
  },
  {
    id: 'network-defense',
    title: 'Network Defense',
    issuer: 'Cisco Networking Academy',
    detail: 'Offered by the DICT-ITU DTC Initiative',
    date: 'May 23, 2026',
    image: '/certificates/cert-network.jpg',
  },
  {
    id: 'cyber-threat-management',
    title: 'Cyber Threat Management',
    issuer: 'Cisco Networking Academy',
    detail: 'Offered by the DICT-ITU DTC Initiative',
    date: 'May 23, 2026',
    image: '/certificates/cert-threat.jpg',
  },
  {
    id: 'endpoint-security',
    title: 'Endpoint Security',
    issuer: 'Cisco Networking Academy',
    detail: 'Offered by the DICT-ITU DTC Initiative',
    date: 'May 22, 2026',
    image: '/certificates/cert-endpoint.jpg',
  },
  {
    id: 'cert-base',
    title: 'BASE PH',
    issuer: 'Base PH',
    detail: 'Certificate of Participation',
    date: 'September 19, 2025',
    image: '/certificates/cert-base.png',
  },
]
  
export const about = {
  quote: 'Most of what I build sits between two or three disciplines at once.',
  short: [
    "I'm Sanny, a BS Information Technology student at the College of Computing and Information Sciences, Cor Jesu College, based in Digos City. My work spans a blockchain capstone, an AR learning app, and a venture prototype for local discovery — projects that each need a working build and a clear case for why it matters.",
    "Right now I'm learning front-end animation with React and GSAP, smart-contract development with Solidity, and the information assurance and data privacy side of building software people can trust.",
  ],
  focus: [
    {
      title: 'Blockchain and smart contracts',
      text: 'Building transparent fund-tracking on Polygon with Solidity, Next.js, and wallet-based sign-in.',
    },
    {
      title: 'AR and interactive learning',
      text: 'Unity and AR Foundation experiences that teach hardware identification in English and Cebuano.',
    },
    {
      title: 'Product design and venture research',
      text: 'Prototyping local-discovery ideas in Figma and testing whether they hold up as ventures.',
    },
    {
      title: 'Security, privacy, and documentation',
      text: 'Information assurance coursework, data-privacy case analysis, and system documentation that others can follow.',
    },
  ],
  learning: ['React and GSAP animation', 'Solidity and smart-contract security', 'Information assurance and data privacy'],
}
