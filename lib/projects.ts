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
  thumbnail?: string; // /public path to a thumbnail; falls back to a placeholder
  media_type?: "image" | "video" | "3d" | "embeded"; // for the media placeholder; defaults to image
  image?: string; // /public path to a image; falls back to a placeholder
  video?: string; // /public path to a video; falls back to a placeholder
  embed?: string; // /public path to an embedded content; falls back to a placeholder
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
    slug: "openclaw-agent-team",
    title: "OpenClaw Agent Team",
    track: "technical",
    year: "2026",
    role: "Solo — architecture & orchestration",
    tagline:
      "A self-hosted multi-agent dev team in Discord — Claude orchestrates two local Ollama agents that write, review, and ship code straight to GitHub.",
    tags: ["Multi-agent", "Discord", "Claude API", "Ollama"],
    thumbnail: "/img/hacks_thumbnail.JPG",
    media_type: "image",
    image: "/img/hacks.jpg",
    overview:
      "A three-agent development team living in Discord: Deborah orchestrates as the boss, Ava writes code, and Marcus does QA. Deborah runs on an Anthropic Claude model while Ava and Marcus run on a smaller model served locally by Ollama on a Mac mini. A fine-grained GitHub personal access token lets the team read the repo, make changes, and push commits automatically.",
    highlights: [
      "Architected a 3-agent team — Deborah (orchestrator), Ava (writer), and Marcus (QA) — collaborating over Discord to plan, write, and review code.",
      "Ran the orchestrator on Anthropic's Claude API while the writer and QA agents ran on a smaller model self-hosted with Ollama on a Mac mini.",
      "Configured a fine-grained GitHub personal access token so the team can read/write the repo and push commits automatically, unattended.",
    ],
    stack: ["Discord API", "Claude API", "Ollama", "Mac mini", "GitHub API"],
    featured: true,
  },
  {
    slug: "heartbeat-glowing-heart",
    title: "Heartbeat-Synced Glowing Heart",
    track: "technical",
    year: "2026",
    role: "Solo — hardware, firmware, app, AI",
    tagline:
      "A Wi-Fi IoT gift that pulses to a real heartbeat, with a Claude pipeline that turns biometric data into mood-based light.",
    tags: ["ESP32", "IoT", "Claude AI", "Fabrication"],
    thumbnail: "/img/heart_thumbnail.png",
    image: "/img/heart.jpg",
    media_type: "image",
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
    thumbnail: "/img/immersive_gallery_thumb.avif",
    media_type: "embeded",
    embed: "https://immersive-gallery-five.vercel.app/",
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
    thumbnail: "/img/degree_finder.png",
    media_type: "image",
    image: "/img/degree_finder.png",
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
    slug: "pixel-portal",
    title: "Pixel Portal",
    track: "technical",
    year: "2026",
    role: "Solo — creative coding",
    tagline:
      "A generative pixel-art stage visualizer inspired by Rezz's live shows — a spiraling portal, rim lights, and spotlights, computed pixel by pixel in Canvas 2D.",
    tags: ["Creative Coding", "Canvas", "Generative Art", "Next.js"],
    media_type: "embeded",
    embed: "https://rezz-inspired-portal.vercel.app/",
    overview:
      "A tiny-canvas pixel-art rendering technique — every frame is generated pixel by pixel rather than drawn with images — used to build a hypnotic stage portal in the style of Rezz's concert visuals: a single spiraling line, a rim of lights, and flanking spotlight rows, all procedural. Spun out of a portfolio experiment into its own app, with a soundtrack and multiple selectable visuals per track next on the roadmap.",
    highlights: [
      "Built a tiny-canvas, pixel-by-pixel rendering technique in Canvas 2D — no images or textures, every pixel computed from a procedural function each frame.",
      "Designed the portal as a single continuous spiral, ring lights, and side spotlights, tuned frame-by-frame against real concert reference photos.",
      "Spun the project out into its own repo and deployment, with audio-reactive visuals and multiple selectable scenes per track planned next.",
    ],
    stack: ["Next.js", "TypeScript", "Canvas 2D", "Vercel"],
    links: [{ label: "Live site", href: "https://rezz-inspired-portal.vercel.app/" }],
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
    thumbnail: "/img/althy_logo.png",
    media_type: "embeded",
    embed: "https://www.althyplanner.com/",
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
    thumbnail: "/img/dream2product_thumbnail.png",
    media_type: "embeded",
    embed: "https://glory-vote-50157517.figma.site/",
    award: "NSF I-Corps — customer discovery grant",
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
    role: "Founder — Northeast Regional I-Corps, customer discovery lead",
    tagline:
      "Customer discovery through the Northeast Regional I-Corps for a platform that helps students find teammates for courses, hackathons, and personal projects.",
    tags: ["I-Corps", "Startup", "Product Discovery", "Ed-tech"],
    overview:
      "TeamUp is a platform for students to find project teammates — for a class, a hackathon, or a personal side project. Through the Northeast Regional I-Corps program, I ran structured customer discovery to validate the problem and shape the product direction before building.",
    highlights: [
      "Completed the Northeast Regional I-Corps program, running structured customer discovery interviews to validate the problem before building.",
      "Validated demand for a teammate-matching platform for students across coursework, hackathons, and personal projects.",
      "Translated interview findings into a prioritized product direction and go-to-market hypothesis.",
    ],
    stack: ["I-Corps", "Customer discovery", "Market research"],
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

// smaller creative / web pieces (shown in the Experiments & creative section)
export interface Experiment {
  title: string;
  year: string;
  blurb: string;
  href?: string;
  kind?: "painting" | "music"; // picks the placeholder treatment below
  image?: string; // /public path to a painting photo, once one exists
  audio?: string; // /public path to a track, once one exists
}

export const experiments: Experiment[] = [
  {
    title: "Untitled Painting I",
    year: "2026",
    blurb: "Acrylic on canvas — painting coming soon.",
    kind: "painting",
  },
  {
    title: "Untitled Painting II",
    year: "2026",
    blurb: "Acrylic on canvas — painting coming soon.",
    kind: "painting",
  },
  {
    title: "Untitled Track",
    year: "2026",
    blurb: "Original composition — track coming soon.",
    kind: "music",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const byTrack = (track: Track) => projects.filter((p) => p.track === track);
