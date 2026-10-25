// All personal content lives in this file — it's the only one you need to edit.
// Any link left as an empty string is hidden automatically (no broken links).

export const site = {
  name: 'Sho',
  initial: 'S',
  role: 'BS Information Technology — Cor Jesu College',
  tagline:
    'I build across blockchain, augmented reality, and product design — usually on projects where several moving parts need to add up to something someone else can rely on.',
  location: 'Digos City, Philippines',
  timezone: 'Asia/Manila',
  email: '',
  github: 'https://github.com/sannysabio-ux',
  linkedin: '',
}

// Each project renders as a card. Fill in `image` (a file in public/projects/),
// `github`, and `demo` as they become available — empty values are hidden.
export const projects = [
  {
    id: 'budget-chain',
    status: 'Capstone — in progress',
    title: 'Blockchain Budget Management System',
    description:
      'A transparent fund-monitoring platform for organizations on the Polygon Amoy testnet, where every allocation and expense is recorded by a smart contract.',
    stack: ['Next.js', 'Node.js', 'Solidity', 'Polygon Amoy', 'MongoDB Atlas'],
    image: '',
    github: '',
    demo: '',
  },
  {
    id: 'desktop-components',
    status: 'Built',
    title: 'AR Desktop Component Identification',
    description:
      'An augmented-reality learning tool that names and explains desktop hardware in English or Cebuano when students point a device at it.',
    stack: ['Unity', 'AR Foundation', 'C#', 'JSON'],
    image: '',
    github: 'https://github.com/sannysabio-ux/DESKTOP_COMPONENTS',
    demo: '',
  },
  {
    id: 'explore',
    status: 'Prototype — Milestone 2',
    title: 'Explore: Rizal Avenue Discovery',
    description:
      'A hyperlocal discovery app surfacing the hidden gems of Rizal Avenue, Digos City, prototyped across seven screens in Figma.',
    stack: ['Figma', 'Product design', 'Venture research'],
    image: '',
    github: '',
    demo: '',
  },
  {
    id: 'notifyme',
    status: 'Documentation',
    title: 'NotifyMe: Student Task Reminder',
    description:
      'A task-reminder system for students, documented end to end, from the XML processing pipeline to the security model protecting user data.',
    stack: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'RabbitMQ'],
    image: '',
    github: '',
    demo: '',
  },
]

export const about = {
  quote: 'Most of what I build sits between two or three disciplines at once.',
  short: [
    "I'm Sho, a BS Information Technology student at the College of Computing and Information Sciences, Cor Jesu College, based in Digos City. My work spans a blockchain capstone, an AR learning app, and a venture prototype for local discovery — projects that each need a working build and a clear case for why it matters.",
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
