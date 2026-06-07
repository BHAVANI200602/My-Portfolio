import { Project, EducationEntry, TechSkill } from "./types";

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
    features: [
      "Visual Element Identification",
      "Dynamic Error Recovery",
      "Interactive Session Logging",
      "Industrial Scale Proxy Management"
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
    features: [
      "Live Workload Charting",
      "Network Trace Exporter",
      "Developer Log Filtering",
      "Vite Fast Manifesting"
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
    features: [
      "Local Document Redaction",
      "Image-to-PDF Conversion",
      "Lossless PDF Compression",
      "Multi-File PDF Bundler"
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
    features: [
      "Compiler Stack Diagnostic Linker",
      "Autonomous Reference Trait Scraper",
      "Inline Target Replacements",
      "Terminal Assist Automation"
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

export const SKILLS: TechSkill[] = [
  // Languages
  { name: "C", color: "#00599C", category: "Language" },
  { name: "HTML5", color: "#E34F26", category: "Language" },
  { name: "JAVA", color: "#E76F00", category: "Language" },
  { name: "JAVASCRIPT", color: "#F7DF1E", textColor: "#000000", category: "Language" },
  { name: "POWERSHELL", color: "#012456", category: "Language" },
  { name: "PYTHON", color: "#3776AB", category: "Language" },
  { name: "WINDOWS TERMINAL", color: "#4D4D4D", category: "Language" },

  // Cloud/Platforms
  { name: "AZURE", color: "#0078D4", category: "Cloud" },
  { name: "FIREBASE", color: "#FFCA28", textColor: "#000000", category: "Cloud" },
  { name: "GOOGLE CLOUD", color: "#4285F4", category: "Cloud" },
  { name: "NETLIFY", color: "#00C7B7", category: "Cloud" },
  { name: "RENDER", color: "#46E3B7", textColor: "#000000", category: "Cloud" },
  { name: "VERCEL", color: "#000000", category: "Cloud" },

  // Frameworks/Libraries
  { name: "CUDA", color: "#76B900", category: "Framework" },
  { name: "EXPRESS.JS", color: "#000000", category: "Framework" },
  { name: "NPM", color: "#CB3837", category: "Framework" },
  { name: "NODE.JS", color: "#339933", category: "Framework" },
  { name: "REACT", color: "#20232A", category: "Framework" },
  { name: "TAILWIND CSS", color: "#06B6D4", category: "Framework" },
  { name: "VITE", color: "#646CFF", category: "Framework" },
  { name: "APACHE", color: "#D22128", category: "Framework" },
  { name: "APACHE TOMCAT", color: "#F89917", textColor: "#000000", category: "Framework" },

  // Databases
  { name: "MYSQL", color: "#4479A1", category: "Database" },
  { name: "MONGODB", color: "#13aa52", category: "Database" },
  { name: "POSTGRES", color: "#336791", category: "Database" },
  { name: "SUPABASE", color: "#3ECF8E", category: "Database" },

  // Design
  { name: "CANVA", color: "#00C4CC", category: "Design" },
  { name: "FIGMA", color: "#F24E1E", category: "Design" },

  // Data & AI
  { name: "NUMPY", color: "#013243", category: "Data & AI" },
  { name: "PANDAS", color: "#150458", category: "Data & AI" },
  { name: "PYTORCH", color: "#EE4C2C", category: "Data & AI" },
  { name: "SCIKIT-LEARN", color: "#F7931E", category: "Data & AI" },
  { name: "PLOTLY", color: "#3F4F75", category: "Data & AI" },

  // CI/CD & Git
  { name: "GITHUB ACTIONS", color: "#2088FF", category: "CI/CD & Git" },
  { name: "GITLAB CI", color: "#FC6D26", category: "CI/CD & Git" },
  { name: "GIT", color: "#F05032", category: "CI/CD & Git" },
  { name: "GITHUB", color: "#24292E", category: "CI/CD & Git" },
  { name: "GITLAB", color: "#E24329", category: "CI/CD & Git" },

  // Testing & Devops
  { name: "PLAYWRIGHT", color: "#2EAD33", category: "Testing & Devops" },
  { name: "PUPPETEER", color: "#00D8A2", category: "Testing & Devops" },
  { name: "SELENIUM", color: "#43B02A", category: "Testing & Devops" },
  { name: "DOCKER", color: "#0db7ed", category: "Testing & Devops" }
];
