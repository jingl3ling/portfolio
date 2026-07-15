export type Track = "technical" | "venture";

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  title: string;
  track: Track;
  year: string;
  role?: string;
  tagline: string; // one line for the index
  tags: string[];
  image?: string; // /public path to a thumbnail; falls back to a placeholder
  award?: string;
  overview: string; // case-study intro paragraph
  highlights: string[]; // achievement bullets (from resume)
  stack: string[];
  links?: ProjectLink[];
  attribution?: string; // honesty flag (team / forked / client)
  featured?: boolean;
}

export const projects: Project[] = [
  // ---------------- TECHNICAL ----------------
  {
    slug: "heartbeat-glowing-heart",
    title: "Heartbeat-Synced Glowing Heart",
    track: "technical",
    year: "2026",
    role: "Solo — hardware, firmware, app, AI",
    tagline:
      "A Wi-Fi IoT gift that pulses to a real heartbeat, with a Claude pipeline that turns biometric data into mood-based light.",
    tags: ["ESP32", "IoT", "Claude AI", "Fabrication"],
    overview:
      "A Mother's Day gift built end to end: an ESP32 microcontroller drives WS2812b LED strips to simulate a heartbeat, a companion app runs an integrated Claude AI pipeline that analyzes incoming heartbeat data, and the user can retune the device's light to reflect different moods. Housed in a hand-finished, laser-cut acrylic box with an SLA 3D-printed transparent heart.",
    highlights: [
      "Engineered a custom, Wi-Fi-enabled IoT device on an ESP32 with a breakout board and WS2812b LED lightstrips to simulate a live heartbeat.",
      "Built a companion app with an integrated Claude AI pipeline to analyze heartbeat data and let the user customize lighting to reflect moods.",
      "Fabricated a custom casing with Makerspace tools — laser-cut white acrylic bonded to a hand-finished SLA 3D-printed transparent heart.",
    ],
    stack: ["ESP32 / Arduino", "WS2812b", "Claude API", "Python", "Laser cut + SLA print"],
    featured: true,
  },
  {
    slug: "immersive-gallery",
    title: "Immersive Gallery",
    track: "technical",
    year: "2026",
    role: "Team of 4 — 3D engine & AI UX",
    award: "3rd Place — AI Tinkerers Claude Hackathon",
    tagline:
      "An infinite-canvas digital gallery where a Claude assistant reshapes the environment in real time from natural-language prompts.",
    tags: ["React Three Fiber", "WebGL", "Claude AI", "Hackathon"],
    overview:
      "An immersive, infinite-canvas gallery that rethinks how people browse media. A Claude-powered 'Gallery Assistant' changes colors, layouts, frames, and effects in real time from natural language, and context-aware interactions trigger ambient music, color-matched floating emojis, and background shifts as you zoom into an image.",
    highlights: [
      "Awarded 3rd place for an immersive, infinite-canvas gallery that redefines interactive media viewing.",
      "Integrated a Claude 'Gallery Assistant' that alters the environment in real time via natural-language prompts.",
      "Architected context-aware UX: background music, color-matched floating emojis, and ambient shifts on zoom.",
    ],
    stack: ["React 19", "Three.js / R3F", "TypeScript", "Vite", "CopilotKit", "Claude API"],
    links: [{ label: "Live demo", href: "https://immersive-gallery-five.vercel.app/" }],
    attribution:
      "Team hackathon project (4 collaborators), forked from an original author — credited on the project page.",
    featured: true,
  },
  {
    slug: "njit-degree-finder",
    title: "NJIT Major & Degree Finder",
    track: "technical",
    year: "2026",
    role: "Web Developer @ NJIT",
    tagline:
      "A production React + Elasticsearch tool that queries and compares 68 majors and 211 degree programs on njit.edu.",
    tags: ["React", "TypeScript", "Elasticsearch", "Production"],
    overview:
      "NJIT's interactive Degree Finder, shipped on the university's main site. Built in React and TypeScript with Elasticsearch to rapidly query, filter, and render academic data across 68 majors and 211 distinct degree programs, plus a custom degree comparison tool translated pixel-perfect from third-party vendor designs.",
    highlights: [
      "Engineered the Degree Finder in React + TypeScript with Elasticsearch across 68 majors and 211 degree programs.",
      "Built a custom degree comparison tool and embedded the app seamlessly into the university's main website.",
      "Translated third-party vendor designs into pixel-perfect frontend components.",
    ],
    stack: ["React", "TypeScript", "Elasticsearch", "Drupal", "Twig"],
    links: [{ label: "Live on njit.edu", href: "https://www.njit.edu/academics/degrees" }],
    featured: true,
  },
  {
    slug: "njit-web-platform",
    title: "NJIT Web Platform Engineering",
    track: "technical",
    year: "2023–present",
    role: "Web Developer @ NJIT",
    tagline:
      "AI-assisted dev workflows, a university-wide Drupal 7→10 migration, and tooling that audits 30,000+ sites.",
    tags: ["Drupal", "PHP", "AI Agents", "DevOps"],
    overview:
      "Ongoing platform engineering for NJIT: integrating AI agents into developer workflows, migrating the university web platform, and building automation at scale across tens of thousands of sites.",
    highlights: [
      "Integrated Openclaw AI agents into Slack to automate code reviews — a multi-agent system that accelerated feedback loops.",
      "Orchestrated a university-wide Drupal 7→10 migration with Elasticsearch integration and PHP→Twig template rewrites.",
      "Built a People Directory managing 2,300+ profiles via Workfolio APIs, compiled from React into the Drupal theme.",
      "Wrote automated PHP scripts auditing 30,000+ sites to fix accessibility issues and purge dead 404 URLs.",
      "Managed Acquia + Bluehost hosting, DNS, and secure SSH file/DB sync across dev, staging, and production.",
    ],
    stack: ["Drupal", "PHP", "React", "Elasticsearch", "Acquia", "SSH"],
  },
  {
    slug: "gesture-speaker-wristband",
    title: "Gesture-Controlled Speaker-Wristband",
    track: "technical",
    year: "2022",
    role: "Senior Design — UIUC",
    tagline:
      "An Arduino wearable + speaker system controlled by hand gestures, with ambient lighting over Bluetooth.",
    tags: ["Arduino", "Embedded", "Bluetooth", "IMU"],
    overview:
      "A gesture-controlled speaker-and-wristband system with ambient lighting, conceived, designed, and built for senior design. The wristband reads motion from an IMU and drives audio + light on the speaker over a Bluetooth link.",
    highlights: [
      "Designed and built a gesture-controlled speaker-wristband with ambient lighting using Arduino.",
      "Established a Bluetooth link between speaker and wristband via AT mode on an HC-05 module.",
      "Integrated an MPU9250 IMU with a 16x4 LCD, WS2812b lightstrip, and an 8-ohm speaker.",
    ],
    stack: ["Arduino", "HC-05 Bluetooth", "MPU9250 IMU", "WS2812b", "C/C++"],
  },

  // ---------------- VENTURES ----------------
  {
    slug: "althy",
    title: "Althy",
    track: "venture",
    year: "2025–2026",
    role: "Founder — product, UX, engineering",
    award: "Bentley University Incubator — Phase 1 & 2 awards",
    tagline:
      "An AI wellness planner taken from research to a live beta web + iOS app, pitched to investors across the startup ecosystem.",
    tags: ["Startup", "AI", "Full-stack", "iOS"],
    overview:
      "Althy is an AI wellness planning app. As founder I directed a 4-person team across UI/UX, user research, and business development — translating a 50-student survey into a prioritized roadmap (syllabus parsing, wellness tracking, calendar sharing), engineering the alpha/beta, and shipping live web + iOS betas for active user testing.",
    highlights: [
      "Secured Phase 1 & 2 awards from the Bentley University Incubator; led a 4-person cross-functional team.",
      "Set product strategy + UX in Figma from a 50-student survey; roadmap included automated syllabus parsing and wellness tracking.",
      "Engineered alpha/beta with full-stack deploy on Vercel + Railway; Google & Microsoft SSO via GCP and Azure.",
      "Shipped live beta web + iOS apps through the Apple Developer Program for user testing.",
      "Pitched to investors and communities at Startup Grind, AI Tinkerers, NJII, and Columbia University.",
    ],
    stack: ["React", "Node / Express", "PostgreSQL", "OpenAI", "Vercel", "Railway", "Figma"],
    links: [{ label: "althyplanner.com", href: "https://www.althyplanner.com/" }],
    featured: true,
  },
  {
    slug: "dream2product",
    title: "Dream2Product",
    track: "venture",
    year: "2025",
    role: "NSF I-Corps — customer discovery lead",
    tagline:
      "B2B customer discovery for a manufacturing platform — 20+ interviews turned into user-centric prototypes and strategy.",
    tags: ["NSF I-Corps", "B2B", "Product Discovery", "Figma"],
    overview:
      "A National Science Foundation I-Corps venture exploring a new manufacturing platform. I led B2B customer discovery — 20+ targeted interviews with manufacturers and entrepreneurs — and translated findings into rapid prototypes and strategic workbooks.",
    highlights: [
      "Led B2B customer discovery: 20+ interviews with manufacturers and entrepreneurs to surface workflow pain points.",
      "Built rapid UI/UX prototypes with Figma Make from qualitative interview data.",
      "Synthesized market research + technical hypotheses into strategic workbooks and stakeholder presentations.",
    ],
    stack: ["Figma Make", "Customer discovery", "Market research"],
  },
  {
    slug: "teamup",
    title: "TeamUp",
    track: "venture",
    year: "2026",
    role: "Founder",
    tagline: "A new venture — details coming soon.",
    tags: ["Startup"],
    overview:
      "TeamUp is an early-stage venture. Full write-up in progress — check back soon.",
    highlights: ["Details coming soon."],
    stack: [],
  },
  {
    slug: "otb-english",
    title: "OTB English",
    track: "venture",
    year: "2023–2024",
    role: "Co-Founder & Project Manager",
    tagline:
      "Co-founded an ed-tech product: a push-dictionary and AI speaking chatbot, leading a 10-developer team.",
    tags: ["Ed-tech", "Product Management", "AI Chatbot", "Figma"],
    overview:
      "An ed-tech venture for Business English learners. I conceptualized and prototyped a high-fidelity push-dictionary in Figma, led a 10-developer team through weekly delivery, and spearheaded an AI speaking chatbot that lets students practice with lecture content.",
    highlights: [
      "Prototyped a high-fidelity push-dictionary in Figma so students could record and quickly retrieve learned phrases.",
      "Ran weekly delivery with a 10-developer team: feedback, debugging, and sprint planning.",
      "Spearheaded an AI chatbot to help students practice speaking against lecture content.",
    ],
    stack: ["Figma", "Product management", "AI chatbot"],
  },
];

// smaller creative / web pieces (shown in Experiments, not the main toggle)
export interface Experiment {
  title: string;
  year: string;
  blurb: string;
  href?: string;
}

// export const experiments: Experiment[] = [
//   {
//     title: "Spurlock Museum — Visit Page",
//     year: "2022",
//     blurb:
//       "Redesigned the museum's visit page with custom icons and map instructions in the UIUC brand system; built in Figma + SASS.",
//     href: "https://www.spurlock.illinois.edu/visit/",
//   },
//   {
//     title: "Blues Dancing — Online Exhibition",
//     year: "2022",
//     blurb:
//       "Turned a physical Blues Dancing exhibition into a curated virtual one — photos, video, audio, and a web interface to the curator's spec.",
//     href: "https://www.spurlock.illinois.edu/exhibits/online/blues/",
//   },
//   {
//     title: "Music Composition",
//     year: "2026",
//     blurb:
//       "To fill.",
//   },
// ];

export const experiments: Experiment[] = [
  {
    title: "TO FILL",
    year: "2026",
    blurb:
      "To fill",
  },
  {
    title: "TO FILL",
    year: "2026",
    blurb:
      "To fill",
  },
  {
    title: "TO FILL",
    year: "2026",
    blurb:
      "To fill",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const byTrack = (track: Track) => projects.filter((p) => p.track === track);
