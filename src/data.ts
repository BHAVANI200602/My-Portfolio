import { Project, EducationEntry } from "./types";

export const PERSONAL_BIO = {
  name: "Bhavani Shankar",
  title: "Systems Architect & Developer",
  tagline: "Building resilient platforms & visual browser automation solutions",
  aboutMe: "I am a developer, who struggles to build, scale, deploy, and understand end-to-end sys design, cloud architecture, DSA etc. Through that struggle, I create tooling and platforms that lower the barrier to complex visual and system operations.",
  email: "ratgrey73@gmail.com",
  github: "https://github.com/BHAVANI200602",
  linkedin: "https://www.linkedin.com/in/bhavani-02-24-2006-shankar/",
  leetcode: "https://leetcode.com/u/GV2023006238/",
};

export const PROJECTS: Project[] = [
  {
    id: "browser-agent",
    title: "Browser Agent v4",
    subtitle: "Enterprise Browser Automation",
    description: "An enterprise-grade AI browser automation agent designed to navigate and execute critical web flows. It visually understands pages through Set-of-Mark (SoM) grounding and coordinates operations autonomously.",
    bulletPoints: [
      "Set-of-Mark (SoM) grounding overlay for advanced layout comprehension.",
      "Vision-Language model integration for resilient, prompt-driven action planning.",
      "Handles complicated multi-step flows, authentications, and data exports autonomously.",
      "Designed specifically for enterprise scrapers, automated workflows, and robust QA testing suites."
    ],
    tags: ["TypeScript", "Playwright", "Puppeteer", "Node.js", "VLM Integration", "Docker"],
    githubUrl: "https://github.com/BHAVANI200602",
    year: "2026"
  },
  {
    id: "footprints",
    title: "Footprints",
    subtitle: "Modern Web Footprints Tracer",
    description: "A developer tracking client built to record, trace, and inspect rapid feedback loops during application testing. Highly optimized frontend tracing leveraging lightweight React rendering.",
    bulletPoints: [
      "Ultra-fast local telemetry processing showing event streams in real time.",
      "Beautiful lightweight visual graphics representing browser and API workloads.",
      "Zero-latency overhead built using TypeScript and Vite."
    ],
    tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "Local Storage"],
    githubUrl: "https://github.com/BHAVANI200602",
    liveUrl: "https://ais-dev-gs2wmlohnz2hjh2xxsji4g-344687067743.asia-southeast1.run.app",
    year: "2025"
  },
  {
    id: "pdf-forge",
    title: "PDF Forge",
    subtitle: "Privacy-First Client-Side PDF Utilities",
    description: "A comprehensive tool suite for fast file conversions, merging, compressing, splitting, and securing PDFs. Designed with absolute compliance in mind, performing all visual processing locally inside the client's browser.",
    bulletPoints: [
      "100% Client-Side execution guarantees complete document confidentiality.",
      "Includes batch image conversions, layout splitting, compression ratios, and direct merging.",
      "Optimized WASM-based compilers for smooth high-resolution output."
    ],
    tags: ["TypeScript", "React", "Tailwind CSS", "WASM compilers", "Local Forging"],
    githubUrl: "https://github.com/BHAVANI200602",
    year: "2025"
  },
  {
    id: "scapegoat",
    title: "Scapegoat",
    subtitle: "State-of-the-Art VS Code AI Coding Assistant",
    description: "An AI programmer extension for VS Code that acts as a localized diagnostic assistant. It targets debugger compile-time stacks directly, pulling workspace snippets to generate correct, drop-in terminal actions.",
    bulletPoints: [
      "Intelligently parses VS Code compiler errors without copy-paste cycles.",
      "Scrapes exact relevant local class and reference snippets for absolute contextual accuracy.",
      "Suggests high-precision code fixes and automated workspace refactors instantly."
    ],
    tags: ["VS Code Extension", "TypeScript", "Node.js", "AI diagnostics", "Workspace Scraper"],
    githubUrl: "https://github.com/BHAVANI200602",
    year: "2025"
  }
];

export const EDUCATION: EducationEntry[] = [
  {
    degree: "B.Tech in Computer Science & Engineering",
    institution: "GITAM Deemed to be University",
    period: "2023 - Present",
    description: "Deep diving into Algorithms, Computer Systems Architecture, Distributed Platforms, and Enterprise AI systems. Actively experimenting with browser micro-agents and visual LLM integrations.",
    location: "Visakhapatnam, India"
  },
  {
    degree: "Intermediate Board (M.P.C)",
    institution: "Sri Chaitanya Jr College",
    period: "2021 - 2023",
    description: "Rigorous focus on foundational Mathematics, Physics, and Chemistry, establishing strong logic engines and computational mental models.",
    location: "Andhra Pradesh, India"
  }
];
