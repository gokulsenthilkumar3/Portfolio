/**
 * 🎯 CENTRALIZED PORTFOLIO CONFIG
 *
 * Curated baseline for portfolio content.
 * The public page uses this curated content as its source of truth. External
 * profile data can be reviewed separately by an administrator before publishing.
 *
 * careerStart: Set this to the start date of your FIRST professional role.
 * This is used by /api/stats to calculate "Years Experience" dynamically —
 * the same value your LinkedIn profile shows for total experience.
 */

export const portfolioConfig = {
  // ─── PERSONAL INFO ──────────────────────────────────────────────────────────
  personal: {
    name: "Gokul Senthilkumar",
    title: "Software Development Engineer in Test",
    heroHeading: "I test the seams. <em>Then I build.</em>",
    aboutManifesto: "My day job is finding the places software breaks. My side projects are where I try to make those places harder to miss.",
    tagline: "SDET at CloudAssert. Building tools for developers, small businesses, and the problems I keep coming back to.",
    bio: "I started in frontend development and moved into quality engineering. At CloudAssert I work on test automation, performance checks, and release confidence. Outside work, I build and document products that stretch from business operations to developer tooling. Some are working applications; others are honest prototypes or research. I want the distinction to be clear.",
    email: "gokulsenthilkumar3@gmail.com",
    emailZoho: "gokulsenthilkumar3@zohomail.in",
    location: "Sivanmalai, Tamil Nadu, India",
    availability: "busy" as "available" | "busy" | "open-to-offers",
    avatar: "/gokul-photo.jpg",
    resume: "/Gokul_S_Resume.pdf",
    github: "https://github.com/gokulsenthilkumar3",
    linkedin: "https://www.linkedin.com/in/gokulsenthilkumar3/",
    twitter: "https://x.com/GokulKangeyanS",
    website: "https://portfolio-ten-plum-98.vercel.app",
    /**
     * careerStart: First day of your first professional role.
     * Used by /api/stats → "Years Experience" stat.
     * Update this if you change jobs or want to adjust the start date.
     * Format: YYYY-MM-DD
     */
    careerStart: "2023-06-01",
  },

  // ─── ABOUT SECTION ──────────────────────────────────────────────────────────
  about: {
    title: "How I work",
    subtitle: "Quality engineering and product building are part of the same practice.",
    projectsHeading: "Work in the open.",
    projectsIntro: "Public repositories at different stages. Each card leads to a note on what is implemented, what is still a prototype, and what is only research.",
    skillsHeading: "Tools I reach for.",
    skillsIntro: "Testing is my daily craft; the rest of this stack comes from building the products alongside it.",
    featuredTitle: "Quality Engineering",
    featuredDesc: "Automated testing, load testing, CI/CD quality gates",
    featuredLong: "At CloudAssert I design automated test frameworks, run performance tests with K6, and integrate quality gates into Azure DevOps pipelines — making sure software ships without surprises.",
    secondaryTitle: "Full-Stack Dev",
    secondarySkills: ["React", "Next.js", "PERN", "Node.js"],
    contactHeading: "Keep the conversation going.",
    contactDesc: "I'm focused on my current work, not looking for a new role. If a project here sparked a question or an idea, you're welcome to write.",
  },

  // ─── THEME & APPEARANCE ─────────────────────────────────────────────────────
  theme: {
    defaultTheme: "dark" as "dark" | "light" | "neon" | "pastel" | "cyberpunk",
    enableCustomizationPanel: true,
    enableThemeSelector: true,
    enableProgressBar: false,
    enableSectionIndicators: false,
    enableScrollToTop: true
  },

  // ─── PRIMARY NAVIGATION ───────────────────────────────────────────────────
  // Keep the visible navigation aligned with the sections rendered on the home page.
  navigation: [
    { label: "Work", id: "projects" },
    { label: "About", id: "about" },
    { label: "Skills", id: "skills" },
    { label: "Contact", id: "contact" },
  ],

  // ─── STATS (static fallbacks — live values come from /api/stats) ────────────
  //
  // These values are dynamically calculated or synced from the config.
  get stats() {
    return [
      { 
        label: "Years Experience", 
        value: Math.max(1, new Date().getFullYear() - new Date(this.personal.careerStart).getFullYear()), 
        suffix: "",
        duration: 2000 
      },
      { 
        label: "Projects Built",   
        value: this.projects.filter((project) => project.kind !== 'research').length,
        suffix: "",
        duration: 2200 
      },
      { 
        label: "GitHub Repos",
        value: 12, // Public GitHub profile count verified on 2026-09-24; /api/stats refreshes it.
        suffix: "",
        duration: 2400 
      },
      { 
        label: "Quality Practices",
        value: 3,
        suffix: "+", 
        duration: 2600 
      },
    ];
  },

  // ─── SEO ────────────────────────────────────────────────────────────────────
  seo: {
    title: "Gokul Senthilkumar | SDET & Full-Stack Developer",
    description: "Portfolio of Gokul Senthilkumar — Software Development Engineer in Test and Full-Stack Developer.",
    keywords: ["SDET", "QA", "Automation", "Full Stack", "React", "Next.js", "TypeScript"],
    ogImage: "/og.png",
    siteUrl: "https://portfolio-ten-plum-98.vercel.app",
    author: "Gokul Senthilkumar",
  },

  // ─── SOCIAL LINKS ───────────────────────────────────────────────────────────
  socialLinks: [
    { platform: "github",    url: "https://github.com/gokulsenthilkumar3",                 icon: "Github"   },
    { platform: "linkedin",  url: "https://www.linkedin.com/in/gokulsenthilkumar3/",       icon: "Linkedin" },
    { platform: "twitter",   url: "https://x.com/GokulKangeyanS",                         icon: "Twitter"  },
    { platform: "email",     url: "mailto:gokulsenthilkumar3@gmail.com",                   icon: "Mail"     },
    { platform: "zohomail",  url: "mailto:gokulsenthilkumar3@zohomail.in",                 icon: "Mail"     },
  ],

  // ─── GISCUS COMMENTING ────────────────────────────────────────────────────────
  // To enable comments, install the Giscus app on your GitHub repo.
  // Generate your configuration at https://giscus.app/ and paste the IDs below.
  giscus: {
    repo: "gokulsenthilkumar3/Portfolio",
    repoId: "R_kgDOMf4eUA",
    category: "Announcements",
    categoryId: "DIC_kwDOMf4eUM4DA_n-",
    mapping: "pathname",
  },

  // ─── EDUCATION ──────────────────────────────────────────────────────────────
  education: [
    {
      id: "kongu",
      institution: "Kongu Engineering College",
      degree: "M.Sc Software Systems (5 years integrated)",
      field: "Software Systems",
      period: { start: "2020-09-01", end: "2025-05-31", present: false },
      grade: "2020-2025",
      achievements: []
    },
    {
      id: "hsc",
      institution: "Vivekananda Vidyalaya Matriculation Higher Secondary School, Muthur",
      degree: "HSC (Tamil Nadu State Board)",
      field: "12th Grade",
      period: { start: "2019-06-01", end: "2020-04-30", present: false },
      grade: "12th",
      achievements: []
    },
    {
      id: "sslc",
      institution: "Vivekananda Vidyalaya Matriculation Higher Secondary School, Muthur",
      degree: "SSLC (Tamil Nadu State Board)",
      field: "10th Grade",
      period: { start: "2017-06-01", end: "2018-05-31", present: false },
      grade: "10th",
      achievements: []
    }
  ],

  // ─── EXPERIENCE ─────────────────────────────────────────────────────────────
  experiences: [
    {
      id: "cloudassert-fte",
      company: "CloudAssert",
      role: "Software Development Engineer in Test",
      location: "Coimbatore, Tamil Nadu, India",
      period: { start: "2025-08-01", present: true },
      description: "Full-time SDET ensuring robust quality gates and test automation frameworks.",
      achievements: ["Developing automated regression coverage and performance checks for release workflows"],
      technologies: ["K6", "Azure DevOps", "Selenium", "TestCafe"],
      type: "full-time" as const,
    },
    {
      id: "cloudassert-intern",
      company: "CloudAssert",
      role: "Software Development Engineer in Test (Internship)",
      location: "Coimbatore, Tamil Nadu, India",
      period: { start: "2024-08-01", end: "2025-07-31", present: false },
      description: "Worked on Selenium automation, K6 performance checks, and Azure DevOps quality gates.",
      achievements: ["Built test automation and performance-checking workflows as part of the quality team"],
      technologies: ["K6", "Azure DevOps", "Selenium"],
      type: "internship" as const,
    },
    {
      id: "emglitz",
      company: "Emglitz Technologies",
      role: "Junior Frontend Developer (Internship)",
      location: "Coimbatore, Tamil Nadu, India",
      period: { start: "2023-06-01", end: "2023-10-31", present: false },
      description: "Built responsive React UIs and contributed to frontend feature development for client-facing web applications.",
      achievements: [],
      technologies: ["React.js", "JavaScript", "HTML", "CSS", "Tailwind CSS"],
      type: "internship" as const,
    }
  ],

  // ─── PROJECTS ───────────────────────────────────────────────────────────────
  projects: [
    {
      id: "forgeos", title: "ForgeOS",
      description: "One evolving browser workspace for 14 developer tools, including VaultIQ and StackForge.",
      technologies: ["TypeScript", "Go", "PostgreSQL", "pnpm"],
      category: "fullstack", featured: true, status: "in-progress" as const,
      images: ["/projects/forgeos-concept.webp"], date: "2026-09-13",
      links: { github: "https://github.com/gokulsenthilkumar3/ForgeOS" },
      problem: "Separate tools made workspace setup and product navigation fragmented.",
      responsibility: "Unifying modules, shared navigation, and workspace configuration.",
      evidence: "VaultIQ and StackForge have working entry points in the shared UI; the migration checklist still lists unfinished parity work."
      ,nextSteps: "Finish module parity, simplify the shared workspace experience, and document which of the former standalone tools are fully integrated.",
      mediaCaption: "Concept illustration for the unified developer workspace; not a product screenshot.",
      mediaType: "concept" as const,
      sourceReviewedAt: "Sep 2026"
    },
    {
      id: "evergreen", title: "EverGreen One",
      description: "A connected business workspace merging yarn operations, noolstitch job work, invoicing, GST, and customer ledgers.",
      technologies: ["TypeScript", "React", "NestJS", "Prisma"],
      category: "fullstack", featured: true, status: "in-progress" as const,
      images: ["/projects/evergreen-concept.webp"], date: "2026-02-08",
      links: { github: "https://github.com/gokulsenthilkumar3/Evergreen" },
      problem: "Yarn and MSME teams need stock, production, billing, and customer records in one workflow.",
      responsibility: "Integrating operations and billing workspaces.",
      evidence: "The repository brings its yarn, job-work, and invoice code into a shared app and package structure."
      ,nextSteps: "Complete the integration between operational modules, replace remaining demo reporting data, and harden import permissions and validation.",
      mediaCaption: "Concept illustration of connected business operations; not a screenshot.",
      mediaType: "concept" as const,
      sourceReviewedAt: "Sep 2026"
    },
    {
      id: "nexora", title: "Nexora",
      description: "A developing operations workspace combining HR, assets, helpdesk, projects, and shared governance.",
      technologies: ["TypeScript", "Next.js", "PostgreSQL", "Docker"],
      category: "fullstack", featured: true, status: "in-progress" as const,
      images: ["/projects/nexora-concept.webp"], date: "2026-05-05",
      links: { github: "https://github.com/gokulsenthilkumar3/NexFlow" },
      problem: "People, workplace, and support processes live in disconnected systems.",
      responsibility: "Combining domain applications around a shared identity and data model.",
      evidence: "Nexora replaces NexFlow and Office Management / HRMS; the merged UI and migration work are still in progress."
      ,nextSteps: "Continue consolidating the former applications and verify each domain workflow against the shared identity and data model.",
      mediaCaption: "Concept illustration for Nexora; not a screenshot of a completed suite.",
      mediaType: "concept" as const,
      sourceReviewedAt: "Sep 2026"
    },
    {
      id: "agroos", title: "AgroOS",
      description: "An India-focused agriculture platform for farm operations, IoT monitoring, cooperatives, direct sales, and cold-chain capacity.",
      technologies: ["TypeScript", "Next.js", "Prisma", "Playwright"],
      category: "fullstack", featured: true, status: "in-progress" as const,
      images: ["/projects/agroos-concept.webp"], date: "2026-09-13",
      links: { github: "https://github.com/gokulsenthilkumar3/AgroOS" },
      problem: "Farm data, sales, and logistics are often managed in separate tools.",
      responsibility: "Building the shared platform and module foundations.",
      evidence: "The repository contains a Next.js app, Prisma schema, and automated test setup; the roadmap marks further modules as MVP work."
      ,nextSteps: "Turn roadmap modules into verified user flows, especially where field operations, sales, and logistics need to share data.",
      mediaCaption: "Concept illustration of the intended agriculture platform; not a shipped interface.",
      mediaType: "concept" as const,
      sourceReviewedAt: "Sep 2026"
    },
    {
      id: "verilexai", title: "VeriLex AI",
      description: "A research and productivity workspace for Indian audit, tax, document review, and legal compliance teams.",
      technologies: ["TypeScript", "Next.js", "Prisma"],
      category: "ai", featured: true, status: "in-progress" as const,
      images: ["/projects/verilexai-concept.webp"], date: "2026-05-31",
      links: { github: "https://github.com/gokulsenthilkumar3/VeriLexAI" },
      problem: "Audit evidence, tax work, documents, and compliance research need reviewable context.",
      responsibility: "Combining those workflows in a single application.",
      evidence: "The repository includes a Next.js app and Prisma data model. AI output is explicitly a draft for professional review."
      ,nextSteps: "Build reviewable evidence trails around the draft-generation workflow and keep professional sign-off explicit.",
      mediaCaption: "Concept illustration of a professional research workspace; not a product screenshot.",
      mediaType: "concept" as const,
      sourceReviewedAt: "Sep 2026"
    },
    {
      id: "ultimate", title: "GrowthTrack Ultimate",
      description: "A local-first personal workspace that brings health, finance, work, family, and companion products into one control center.",
      technologies: ["JavaScript", "TypeScript", "React", "Docker"],
      category: "fullstack", featured: true, status: "in-progress" as const,
      images: ["/projects/ultimate-concept.webp"], date: "2026-09-14",
      links: { github: "https://github.com/gokulsenthilkumar3/Ultimate" },
      problem: "Personal operations are scattered across separate applications.",
      responsibility: "Integrating independent products through one private workspace and gateway.",
      evidence: "OxFin and the canonical Forex app now live here as companion products; the older Forex ensemble folder remains as reference."
      ,nextSteps: "Keep the companion products coherent without implying that every planned area is implemented or connected today.",
      mediaCaption: "Concept illustration of the personal workspace; not a product screenshot.",
      mediaType: "concept" as const,
      sourceReviewedAt: "Sep 2026"
    },
    {
      id: "findthemnow", title: "FindThemNow",
      description: "A lightweight missing-person search and safety web app with a modular JavaScript interface and offline-ready features.",
      technologies: ["JavaScript", "HTML", "CSS", "Service Worker"],
      category: "web", featured: true, status: "in-progress" as const,
      images: ["/projects/findthemnow-concept.webp"], date: "2026-03-31",
      links: { github: "https://github.com/gokulsenthilkumar3/FindThemNow" },
      problem: "Search and emergency information need to be quick to find, especially on limited connections.",
      responsibility: "Building the client-side interface, accessibility, and offline-friendly structure.",
      evidence: "The repository contains a working static web app, JavaScript modules, a manifest, and a service worker; its broader AI and law-enforcement ambitions are not represented here as shipped features."
      ,nextSteps: "Validate the emergency-information flow with real users before treating the more ambitious matching and coordination ideas as product capabilities.",
      mediaCaption: "Concept illustration for search and location; not a depiction of live search data.",
      mediaType: "concept" as const,
      sourceReviewedAt: "Sep 2026"
    },
    {
      id: "velo", title: "Velo",
      description: "An EV scooter-sharing concept for India's Tier-2 cities with a browser-based rider discovery and reservation prototype.",
      technologies: ["HTML", "CSS", "JavaScript"],
      category: "mobile", featured: true, status: "in-progress" as const,
      images: ["/projects/velo-screen.png"], date: "2026-09-13",
      links: { github: "https://github.com/gokulsenthilkumar3/Velo" },
      problem: "Local riders and operators need clearer access to scooter availability, reservations, and fleet information.",
      responsibility: "Designing the product and implementing the static rider-facing prototype.",
      evidence: "The repository includes a responsive rider UI prototype and product specifications; the planned Android app and backend are not yet implemented."
      ,nextSteps: "Test the rider discovery and reservation flow with operators; backend, fleet operations, and a native app remain proposed work.",
      mediaCaption: "Captured from the repository's static rider UI prototype. Scooter markers and availability are sample interface data, not a live fleet.",
      mediaType: "prototype" as const,
      sourceReviewedAt: "Sep 2026"
    },
    {
      id: "lang", title: "Lang",
      description: "Research and design specifications for a memory-safe systems language with gradual verification and a unified toolchain.",
      technologies: ["Language Design", "RFCs", "Formal Methods"],
      category: "tools", featured: true, status: "planned" as const,
      images: ["/projects/lang-concept.webp"], date: "2026-06-26",
      links: { github: "https://github.com/gokulsenthilkumar3/Lang" },
      problem: "Systems development often trades safety, iteration speed, and deployment simplicity against one another.",
      responsibility: "Writing the language vision, research notes, syntax sketches, and RFCs.",
      evidence: "This is a design repository; its README explicitly says no compiler code lives here yet."
      ,nextSteps: "Turn the syntax and safety RFCs into a small executable prototype before claiming language-toolchain capabilities.",
      mediaCaption: "Abstract illustration of syntax and verification ideas; Lang has no compiler implementation yet.",
      mediaType: "concept" as const,
      sourceReviewedAt: "Sep 2026"
    },
    {
      id: "os", title: "OS",
      description: "Phase-zero research and architecture for a capability-based operating system with a proposed microkernel and live-update model.",
      technologies: ["Systems Research", "Architecture", "RFCs"],
      category: "tools", featured: true, status: "planned" as const,
      images: ["/projects/os-concept.webp"], date: "2026-06-26",
      links: { github: "https://github.com/gokulsenthilkumar3/OS" },
      problem: "The project explores security, update, and AI-workload constraints in operating-system design.",
      responsibility: "Documenting architecture, research questions, roadmap gates, and prototype directions.",
      evidence: "The repository describes phase zero as research and architecture, not a completed operating system."
      ,nextSteps: "Use the research questions and architecture gates to scope a first measurable prototype.",
      mediaCaption: "Abstract architecture illustration; this is not a running operating system.",
      mediaType: "concept" as const,
      sourceReviewedAt: "Sep 2026"
    },
    {
      id: "forex-prediction", title: "Forex Forecasting Research",
      kind: "research" as const,
      description: "Forex forecasting research now represented by the canonical Forex app inside GrowthTrack Ultimate.",
      technologies: ["Python", "Deep Learning"], category: "ai",
      featured: false, status: "completed" as const,
      images: ["/projects/forex-prediction.webp"], date: "2024-02-15",
      links: { github: "https://github.com/gokulsenthilkumar3/Ultimate/tree/main/Forex" }
    },
  ],

  // ─── SKILLS ─────────────────────────────────────────────────────────────────
  skills: [
    // Testing
    { id: "selenium",    name: "Selenium",      category: "testing",  proficiency: 5, color: "#43B02A", icon: "🧪" },
    { id: "playwright",  name: "Playwright",    category: "testing",  proficiency: 4, color: "#2EAD33", icon: "🎭" },
    { id: "k6",          name: "K6",            category: "testing",  proficiency: 5, color: "#7D64FF", icon: "⚡" },
    { id: "jest",        name: "Jest",          category: "testing",  proficiency: 4, color: "#C21325", icon: "✅" },
    { id: "cypress",     name: "Cypress",       category: "testing",  proficiency: 3, color: "#17202C", icon: "🌲" },
    // Frontend
    { id: "react",       name: "React",         category: "frontend", proficiency: 4, color: "#61DAFB", icon: "⚛️"  },
    { id: "nextjs",      name: "Next.js",       category: "frontend", proficiency: 4, color: "#000000", icon: "▲"  },
    { id: "typescript",  name: "TypeScript",    category: "frontend", proficiency: 4, color: "#3178C6", icon: "🔷" },
    { id: "tailwind",    name: "Tailwind CSS",  category: "frontend", proficiency: 4, color: "#06B6D4", icon: "💨" },
    // Backend
    { id: "nodejs",      name: "Node.js",       category: "backend",  proficiency: 4, color: "#339933", icon: "🟢" },
    { id: "postgresql",  name: "PostgreSQL",    category: "backend",  proficiency: 3, color: "#4169E1", icon: "🐘" },
    { id: "mongodb",     name: "MongoDB",       category: "backend",  proficiency: 3, color: "#47A248", icon: "🍃" },
    // DevOps
    { id: "azure-devops",name: "Azure DevOps",  category: "devops",   proficiency: 5, color: "#0078D4", icon: "☁️"  },
    { id: "git",         name: "Git",           category: "devops",   proficiency: 4, color: "#F05032", icon: "🔀" },
    { id: "docker",      name: "Docker",        category: "devops",   proficiency: 3, color: "#2496ED", icon: "🐳" },
    { id: "postman",     name: "Postman",       category: "tools",    proficiency: 5, color: "#FF6C37", icon: "🚀" },
    { id: "testcafe",    name: "TestCafe",      category: "testing",  proficiency: 4, color: "#09A8D0", icon: "☕" }
  ],

  // ─── CERTIFICATIONS ───────────────────────────────────────────────────────
  certifications: [
    {
      id: "azure-data-scientist",
      name: "Microsoft Certified: Azure Data Scientist Associate",
      issuer: "Microsoft",
      issued: "Oct 2025",
      expires: "Oct 2026",
      credentialId: "CF46B47AB0825559",
      url: "https://learn.microsoft.com/en-in/users/gokulkangeyans-3703/credentials/cf46b47ab0825559"
    },
    {
      id: "python-basics",
      name: "Python Basics",
      issuer: "Skillsoft",
      issued: "Nov 2022",
      credentialId: "61920547"
    }
  ],

  // ─── LANGUAGES ────────────────────────────────────────────────────────────
  languages: [
    { id: "tamil", name: "Tamil", proficiency: "Native / Mother tongue" },
    { id: "english", name: "English", proficiency: "Professional working proficiency" },
    { id: "japanese", name: "Japanese", proficiency: "Elementary proficiency", info: "Duolingo Score 10 - Mar 2026" },
    { id: "spanish", name: "Spanish", proficiency: "Elementary proficiency", info: "Duolingo Score 10 - Mar 2026" }
  ],

  // ─── BLOG / INSIGHTS ─────────
  blog: [],

  // ─── MICRO-BLOGS / INSIGHTS ─────────────────────────────────────────────────
  microblogs: []
}
