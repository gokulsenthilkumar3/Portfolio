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
    heroHeading: "I build software that earns <em>trust.</em>",
    aboutManifesto: "I obsess over the 1% of details users never consciously notice — but always feel.",
    tagline: "I test what others build and build what others test — bridging quality and code.",
    bio: "SDET and full-stack engineer building reliable web products. I design scalable test automation, performance-test APIs with K6, and build production web applications with React, Next.js, Node.js, and PostgreSQL.",
    email: "gokulsenthilkumar3@gmail.com",
    emailZoho: "gokulsenthilkumar3@zohomail.in",
    location: "Sivanmalai, Tamil Nadu, India",
    availability: "open-to-offers" as "available" | "busy" | "open-to-offers",
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
    title: "About Me",
    subtitle: "SDET by day, builder by night.",
    featuredTitle: "Quality Engineering",
    featuredDesc: "Automated testing, load testing, CI/CD quality gates",
    featuredLong: "At CloudAssert I design automated test frameworks, run performance tests with K6, and integrate quality gates into Azure DevOps pipelines — making sure software ships without surprises.",
    secondaryTitle: "Full-Stack Dev",
    secondarySkills: ["React", "Next.js", "PERN", "Node.js"],
    contactHeading: "Get In Touch",
    contactDesc: "Open to thoughtful product, quality, and automation work — and always happy to talk about interesting open source ideas.",
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
    { label: "Profile", id: "profile" },
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
        suffix: "+", 
        duration: 2000 
      },
      { 
        label: "Projects Built",   
        value: this.projects.filter((project) => project.id !== 'forex-prediction').length,
        suffix: "+", 
        duration: 2200 
      },
      { 
        label: "GitHub Repos",
        value: 12, // Public GitHub profile count verified on 2026-09-24; /api/stats refreshes it.
        suffix: "+", 
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
      achievements: [
        "Built end-to-end automation suite covering 200+ test cases with Selenium + TypeScript",
        "Reduced regression cycle from 3 days to 4 hours via parallel test execution"
      ],
      technologies: ["K6", "Azure DevOps", "Selenium", "TestCafe"],
      type: "full-time" as const,
    },
    {
      id: "cloudassert-intern",
      company: "CloudAssert",
      role: "Software Development Engineer in Test (Internship)",
      location: "Coimbatore, Tamil Nadu, India",
      period: { start: "2024-08-01", end: "2025-07-31", present: false },
      description: "Designed automated test frameworks. Selenium suite reduced functional regression from 3 days to 4 hours. K6 identified performance bottlenecks under 500 concurrent users. Integrated quality gates into Azure DevOps CI/CD pipelines.",
      achievements: [
        "Authored K6 load scripts simulating 500 concurrent users; identified 3 critical bottlenecks",
        "Integrated quality gates into Azure DevOps pipelines, blocking deploys on >5% test failure rate"
      ],
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
    },
    {
      id: "velo", title: "Velo",
      description: "An EV scooter-sharing concept for India's Tier-2 cities with a browser-based rider discovery and reservation prototype.",
      technologies: ["HTML", "CSS", "JavaScript"],
      category: "mobile", featured: true, status: "in-progress" as const,
      images: ["/projects/velo-concept.webp"], date: "2026-09-13",
      links: { github: "https://github.com/gokulsenthilkumar3/Velo" },
      problem: "Local riders and operators need clearer access to scooter availability, reservations, and fleet information.",
      responsibility: "Designing the product and implementing the static rider-facing prototype.",
      evidence: "The repository includes a responsive rider UI prototype and product specifications; the planned Android app and backend are not yet implemented."
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
    },
    {
      id: "forex-prediction", title: "Forex Forecasting Research",
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
  blog: [
    {
      id: "k6-regression",
      title: "How I reduced regression testing cycle to 4 hours with K6",
      date: "May 24, 2026",
      readTime: "5 min read",
      category: "Performance Testing",
      excerpt: "A deep dive into migrating from a bulky legacy testing framework to K6, achieving massive parallelization and cutting down our regression suite execution time by 60%.",
      content: "### The Problem\nOur legacy end-to-end testing suite was taking over 10 hours to complete. This created a massive bottleneck in our CI/CD pipeline, forcing developers to wait overnight to get feedback on their PRs.\n\n### Why K6?\nWe evaluated several tools including JMeter and Gatling, but K6 stood out for its developer experience. Being able to write performance scripts in JavaScript meant our frontend and backend teams could easily contribute.\n\n### The Migration\n1. **Identified critical paths**: We started by migrating the top 20% of tests that covered 80% of our user traffic.\n2. **Modularized data generation**: We built a custom data seeder that fed directly into K6's Virtual Users.\n3. **Parallel Execution**: By leveraging K6's execution scenarios, we ran completely isolated tests in parallel across 10 CI runners.\n\n### The Results\nWe brought the 10-hour regression suite down to just under 4 hours, significantly improving developer velocity and reducing our infrastructure costs by avoiding idle compute time."
    },
    {
      id: "cypress-flakiness",
      title: "Eliminating Flakiness in Cypress UI Automation",
      date: "April 12, 2026",
      readTime: "4 min read",
      category: "UI Automation",
      excerpt: "Flaky tests destroy developer trust. Here are 5 battle-tested strategies I implemented to ensure 99.9% reliability in our Cypress test suites.",
      content: "### The Cost of Flaky Tests\nWhen tests fail randomly, developers stop looking at the results. They just hit \"re-run\" and hope for the best. This completely defeats the purpose of automated testing.\n\n### Strategies to fix it\n\n#### 1. Never rely on arbitrary waits\nUsing `cy.wait(5000)` is the biggest anti-pattern in Cypress. Always wait for specific network aliases (`cy.wait('@getUsers')`) or UI state changes.\n\n#### 2. Seed database state per test\nUI tests should never depend on each other. If test A creates a user, test B should not assume that user exists. Use `cy.task()` to seed the database fresh before every spec.\n\n#### 3. Stub 3rd-party services\nIf your test relies on Stripe, PayPal, or an external API, stub it! `cy.intercept()` is your best friend. Only test your integration points in higher-level E2E tests, not in everyday functional UI tests."
    }
  ],

  // ─── MICRO-BLOGS / INSIGHTS ─────────────────────────────────────────────────
  microblogs: [
    {
      id: "insight-1",
      text: "Setting up Playwright with GitHub Actions today. The DX is incredibly smooth compared to my older Selenium setups. Parallel test execution out of the box is a game changer for PR checks.",
      date: "Jul 11, 2026",
    }
  ]
}
