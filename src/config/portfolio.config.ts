/**
 * 🎯 CENTRALIZED PORTFOLIO CONFIG
 *
 * Single source of truth for all portfolio data.
 * Edit this file to update your portfolio content.
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
    tagline: "SDET | Full-Stack Dev | Open Source Enthusiast",
    bio: "I'm an SDET at CloudAssert, Coimbatore, where I design automated test frameworks, run performance tests with K6, and integrate quality gates into Azure DevOps pipelines. Outside testing, I build full-stack web apps with React, Next.js, and the PERN stack.",
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
    careerStart: "2024-06-01",
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
    contactDesc: "Not currently looking for new roles, but I'm always happy to chat about interesting projects, open source, or just tech in general.",
  },

  // ─── THEME & APPEARANCE ─────────────────────────────────────────────────────
  theme: {
    defaultTheme: "dark" as "dark" | "light" | "neon" | "pastel" | "cyberpunk",
    enableCustomizationPanel: true,
    enableThemeSelector: true,
    enableProgressBar: true,
    enableSectionIndicators: true,
    enableScrollToTop: true
  },

  // ─── STATS (static fallbacks — live values come from /api/stats) ────────────
  //
  // These values are used as fallbacks when the GitHub API is unavailable.
  // "Years Experience" and "GitHub Repos" are overridden at runtime by /api/stats.
  // "Tests Written" is a manual signal with no public API — update it here.
  stats: [
    { label: "Years Experience", value: 1,   suffix: "+", duration: 2000 },
    { label: "Projects Built",   value: 10,  suffix: "+", duration: 2200 },
    { label: "GitHub Repos",     value: 13,  suffix: "+", duration: 2400 },
    { label: "Tests Written",    value: 100, suffix: "+", duration: 2600 },
  ],

  // ─── SEO ────────────────────────────────────────────────────────────────────
  seo: {
    title: "Gokul Senthilkumar | SDET & Full-Stack Developer",
    description: "Portfolio of Gokul Senthilkumar — Software Development Engineer in Test and Full-Stack Developer.",
    keywords: ["SDET", "QA", "Automation", "Full Stack", "React", "Next.js", "TypeScript"],
    ogImage: "/og-image.png",
  },

  // ─── SOCIAL LINKS ───────────────────────────────────────────────────────────
  socialLinks: [
    { platform: "github",    url: "https://github.com/gokulsenthilkumar3",                 icon: "Github"   },
    { platform: "linkedin",  url: "https://www.linkedin.com/in/gokulsenthilkumar3/",       icon: "Linkedin" },
    { platform: "twitter",   url: "https://x.com/GokulKangeyanS",                         icon: "Twitter"  },
    { platform: "email",     url: "mailto:gokulsenthilkumar3@gmail.com",                   icon: "Mail"     },
    { platform: "zohomail",  url: "mailto:gokulsenthilkumar3@zohomail.in",                 icon: "Mail"     },
  ],

  // ─── EDUCATION ──────────────────────────────────────────────────────────────
  education: [
    {
      id: "kongu",
      institution: "Kongu Engineering College",
      degree: "Master of Science - MS",
      field: "Software Systems",
      period: { start: "2020-09-01", end: "2025-05-31", present: false },
      grade: "5th year",
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
      company: "Cloud Assert",
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
      company: "Cloud Assert",
      role: "Software Development Engineer in Test (Internship)",
      location: "Coimbatore, Tamil Nadu, India",
      period: { start: "2024-08-01", end: "2025-07-31", present: false },
      description: "Designed automated test frameworks, ran K6 performance tests, and integrated quality gates into Azure DevOps CI/CD pipelines.",
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
      id: "weaver-book",
      title: "Weaver Book",
      description: "Inventory management web app for the weaving sector. Automated vendor sync reduced manual errors by 60%.",
      tech: ["PHP", "MySQL", "HTML", "CSS"],
      category: "web",
      featured: true,
      images: ["/projects/weaver-book.png"],
      date: "2023-01-15",
      links: { github: "https://github.com/gokulsenthilkumar3" }
    },
    {
      id: "car-renovation-spa",
      title: "Car Renovation Spa",
      description: "Full-stack car service booking platform with real-time renovation progress tracking and appointment management.",
      tech: ["React.js", "Node.js", "MongoDB", "Express"],
      category: "fullstack",
      featured: true,
      images: ["/projects/car-spa.png"],
      date: "2023-08-20",
      links: { github: "https://github.com/gokulsenthilkumar3" }
    },
    {
      id: "yarn-management",
      title: "Yarn Management System",
      description: "Enterprise yarn inventory and production tracking system for textile manufacturers.",
      tech: ["React", "Node.js", "PostgreSQL", "Express"],
      category: "fullstack",
      featured: true,
      images: ["/projects/yarn-management.png"],
      date: "2024-01-10",
      links: { github: "https://github.com/gokulsenthilkumar3/Yarn-Management" }
    },
    {
      id: "oxfin",
      title: "OxFin",
      description: "Personal finance tracker with expense categorization, budget planning, and visual spending analytics.",
      tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
      category: "fullstack",
      featured: true,
      images: ["/projects/oxfin.png"],
      date: "2024-06-01",
      links: { github: "https://github.com/gokulsenthilkumar3/OxFin" }
    },
    {
      id: "selenium-framework",
      title: "Selenium Test Framework",
      description: "Production-grade Selenium + TypeScript test framework with parallel execution, reporting, and CI/CD integration.",
      tech: ["Selenium", "TypeScript", "Jest", "Azure DevOps"],
      category: "testing",
      featured: true,
      images: ["/projects/selenium-framework.png"],
      date: "2024-09-01",
      links: { github: "https://github.com/gokulsenthilkumar3" }
    },
    {
      id: "k6-performance-suite",
      title: "K6 Performance Suite",
      description: "Comprehensive load testing suite for REST APIs, simulating 500+ concurrent users with threshold-based CI gates.",
      tech: ["K6", "JavaScript", "Grafana", "InfluxDB"],
      category: "testing",
      featured: false,
      images: ["/projects/k6-suite.png"],
      date: "2024-11-01",
      links: { github: "https://github.com/gokulsenthilkumar3" }
    },
    {
      id: "portfolio-v4",
      title: "Portfolio v4",
      description: "This portfolio — built with Next.js 15, Three.js 3D components, admin panel, and live data syncing from GitHub.",
      tech: ["Next.js", "TypeScript", "Three.js", "Tailwind CSS"],
      category: "web",
      featured: false,
      images: ["/projects/portfolio.png"],
      date: "2025-01-01",
      links: { github: "https://github.com/gokulsenthilkumar3/Portfolio" }
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
    { id: "git",         name: "Git",           category: "devops",   proficiency: 5, color: "#F05032", icon: "🔀" },
    { id: "docker",      name: "Docker",        category: "devops",   proficiency: 3, color: "#2496ED", icon: "🐳" },
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
}
