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
    tagline: "I test what others build and build what others test — bridging quality and code.",
    bio: "SDET and full-stack engineer building reliable web products. I design scalable test automation, performance-test APIs with K6, and build production web applications with React, Next.js, Node.js, and PostgreSQL.",
    email: "gokulsenthilkumar3@gmail.com",
    emailZoho: "gokulsenthilkumar3@zohomail.in",
    location: "Sivanmalai, Tamil Nadu, India",
    availability: "open" as "available" | "busy" | "open-to-offers" | "open",
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
        value: this.projects.length,  
        suffix: "+", 
        duration: 2200 
      },
      { 
        label: "GitHub Repos",     
        value: 0, // Fallback; live value is synced via /api/stats
        suffix: "+", 
        duration: 2400 
      },
      { 
        label: "Tests Written",    
        value: this.projects.filter(p => p.category === 'testing').length * 50, 
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
    ogImage: "/og-image.png",
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
      id: "vaultiq",
      title: "VaultIQ",
      description: "Centralized office asset management system to track, assign, and manage organizational assets.",
      technologies: ["TypeScript", "Next.js", "PostgreSQL", "Tailwind CSS"],
      category: "fullstack",
      featured: true,
      images: ["/projects/vaultiq.png"],
      icon: "AppWindow",
      date: "2026-05-05",
      links: { github: "https://github.com/gokulsenthilkumar3/VaultIQ", live: "https://gokulsenthilkumar3.github.io/VaultIQ" },
      problem: "Manual tracking of organizational assets across branches led to frequent losses and inaccurate audit records.",
      responsibility: "Full-stack development, database design, and CI/CD setup.",
      evidence: "Achieved 100% asset reconciliation accuracy and reduced audit time from days to hours."
    },
    {
      id: "oxfin",
      title: "OxFin",
      description: "Personal finance tracker with expense categorization, budget planning, and visual spending analytics.",
      problem: "Users struggled with bloated financial apps that made expense categorization and budgeting difficult.",
      responsibility: "Frontend UI/UX design, state management, and backend API implementation.",
      evidence: "Maintained 95+ Lighthouse performance scores and zero layout shift on complex charting views.",
      technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
      category: "fullstack",
      featured: true,
      images: ["/projects/oxfin.png"],
      icon: "Wallet",
      date: "2024-06-01",
      links: { github: "https://github.com/gokulsenthilkumar3/OxFin" }
    },
    {
      id: "stackforge",
      title: "StackForge",
      description: "CLI tool that scaffolds production-ready monorepos in one command — Next.js, NestJS, and Docker Compose.",
      problem: "Setting up a full-stack monorepo with CI/CD and Docker consistently took days of boilerplate configuration.",
      responsibility: "Tool architecture, CLI implementation, and CI/CD workflow templating.",
      evidence: "Reduced project initialization time from 3 days to under 5 minutes.",
      technologies: ["TypeScript", "Node.js", "Docker", "GitHub Actions"],
      category: "tools",
      featured: true,
      images: ["/projects/stackforge.png"],
      icon: "Terminal",
      date: "2026-05-15",
      links: { github: "https://github.com/gokulsenthilkumar3/StackForge" }
    },
    {
      id: "forex-ensemble-prediction",
      title: "Forex Ensemble Prediction",
      description: "Ensemble machine learning project applying Random Forest, Gradient Boosting, and stacking to forecast Forex movements.",
      problem: "Single models often overfit to historical forex data, leading to poor generalization in live prediction.",
      responsibility: "Data preprocessing, model stacking architecture, and backtesting framework.",
      evidence: "Improved directional accuracy by 12% over baseline models through ensemble stacking.",
      technologies: ["Python", "Jupyter Notebook", "Scikit-learn", "Pandas"],
      category: "ai",
      featured: true,
      images: ["/projects/forex-ensemble.png"],
      icon: "Brain",
      date: "2026-05-02",
      links: { github: "https://github.com/gokulsenthilkumar3/Forex-Ensemble-Prediction" }
    },
    {
      id: "portfolio-quality-dashboard",
      title: "Portfolio Quality Dashboard",
      description: "Automated quality, performance, and accessibility testing suite for this Next.js portfolio.",
      problem: "Modern web portfolios often suffer from degraded performance, broken links, or accessibility violations over time without continuous testing.",
      responsibility: "Test automation architecture, CI/CD integration, and accessibility remediation.",
      evidence: "Ensures 100% Lighthouse scores, zero WCAG AA violations, and sub-second LCP through automated Playwright and axe pipelines.",
      technologies: ["Playwright", "K6", "axe-core", "GitHub Actions"],
      category: "tools",
      featured: true,
      images: ["/projects/quality-dashboard.png"],
      icon: "ShieldCheck",
      date: "2024-03-10",
      links: { github: "https://github.com/gokulsenthilkumar3/Portfolio-Tests" }
    },
    {
      id: "forex-prediction",
      title: "Forex Prediction (IEEE)",
      description: "Published at IEEE CIFEr — benchmarked GRU, Informer & TFT models for forex forecasting. TFT achieved the highest trading profit.",
      technologies: ["Python", "TensorFlow", "Deep Learning", "GRU"],
      category: "ai",
      featured: true,
      images: ["/projects/forex-prediction.png"],
      icon: "Brain",
      date: "2024-02-15",
      links: { github: "https://github.com/gokulsenthilkumar3/Forex-Prediction" }
    },
    {
      id: "weaver-book",
      title: "Weaver Book",
      description: "Inventory management web app for the weaving sector.",
      problem: "Weaving vendors relied on disconnected ledgers causing massive discrepancies in inventory tracking.",
      responsibility: "Backend API development, vendor synchronization logic, and database optimization.",
      evidence: "Automated vendor sync reduced manual errors by 60% as measured by end-of-month client reporting.",
      technologies: ["PHP", "MySQL", "HTML", "CSS"],
      category: "web",
      featured: true,
      images: ["/projects/weaver-book.webp"],
      icon: "BookOpen",
      date: "2023-01-15",
      links: { github: "https://github.com/gokulsenthilkumar3/Weaver-Book" }
    },
    {
      id: "car-renovation-spa",
      title: "Car Renovation Spa",
      description: "Full-stack car service booking platform with real-time renovation progress tracking and appointment management.",
      technologies: ["React.js", "Node.js", "MongoDB", "Express"],
      category: "fullstack",
      featured: true,
      images: ["/projects/car-spa.webp"],
      icon: "Car",
      date: "2023-08-20",
      links: { github: "https://github.com/gokulsenthilkumar3/Car-Renovation-Spa" }
    },
    {
      id: "yarn-management",
      title: "Yarn Management System",
      description: "Enterprise yarn inventory and production tracking system for textile manufacturers.",
      technologies: ["React", "Node.js", "PostgreSQL", "Express"],
      category: "fullstack",
      featured: true,
      images: ["/projects/yarn-management.webp"],
      icon: "Factory",
      date: "2024-01-10",
      links: { github: "https://github.com/gokulsenthilkumar3/Yarn-Management" }
    },
    {
      id: "selenium-framework",
      title: "Selenium Test Framework",
      description: "Production-grade Selenium + TypeScript test framework with parallel execution, reporting, and CI/CD integration.",
      problem: "Manual testing delayed releases by days, causing a massive backlog of features waiting for QA sign-off.",
      responsibility: "Framework architecture, page-object modeling, and Azure DevOps integration.",
      evidence: "Reduced functional regression testing from 3 days to 4 hours with comprehensive HTML reporting.",
      technologies: ["Selenium", "TypeScript", "Jest", "Azure DevOps"],
      category: "testing",
      featured: true,
      images: ["/projects/selenium-framework.webp"],
      icon: "TestTube",
      date: "2024-09-01",
      links: { github: "https://github.com/gokulsenthilkumar3/Selenium-Test-Framework" }
    },
    {
      id: "portfolio-quality-dashboard",
      title: "Portfolio Quality Dashboard",
      description: "Automated quality, performance, and accessibility testing suite for this Next.js portfolio.",
      problem: "Modern web portfolios often suffer from degraded performance, broken links, or accessibility violations over time without continuous testing.",
      responsibility: "Test automation architecture, CI/CD integration, and accessibility remediation.",
      evidence: "Ensures 100% Lighthouse scores, zero WCAG AA violations, and sub-second LCP through automated Playwright and axe pipelines.",
      technologies: ["Playwright", "K6", "axe-core", "GitHub Actions"],
      category: "tools",
      featured: true,
      images: ["/projects/quality-dashboard.png"],
      icon: "ShieldCheck",
      date: "2024-03-10",
      links: { github: "https://github.com/gokulsenthilkumar3/Portfolio-Tests" }
    },
    {
      id: "portfolio-v4",
      title: "Portfolio v4",
      description: "This portfolio — built with Next.js 15, Three.js 3D components, admin panel, and live data syncing from GitHub.",
      technologies: ["Next.js", "TypeScript", "Three.js", "Tailwind CSS"],
      category: "web",
      featured: false,
      images: ["/projects/portfolio.webp"],
      icon: "AppWindow",
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
