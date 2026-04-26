// 🎨 PORTFOLIO CONFIGURATION - EDIT YOUR VALUES HERE
// This is the only file you need to edit to customize your entire portfolio

export const portfolioConfig = {
  // 👤 PERSONAL INFORMATION
  personal: {
    name: "Gokul S",
    title: "SDET & Full-Stack Developer",
    tagline: "I test what others build and build what others test — bridging quality and code.",
    bio: "I'm an SDET at CloudAssert, Coimbatore, where I design automated test frameworks, run performance tests, and make sure software ships without surprises. Outside of testing, I build full-stack web apps with React, Next.js, and the PERN stack — turning ideas into real, working products.",
    email: "gokulsenthilkumar3@gmail.com",
    location: "Sivanmalai, Tamil Nadu, India",
    availability: "busy" as "available" | "busy" | "open-to-offers",
    avatar: "https://avatars.githubusercontent.com/u/gokulsenthilkumar3",
    resume: "/resume.pdf", // Upload your resume as public/resume.pdf
    github: "https://github.com/gokulsenthilkumar3",
    linkedin: "https://linkedin.com/in/gokulsenthilkumar3",
    twitter: "https://x.com/GokulKangeyanS",
    website: "https://gokulsenthilkumar3.github.io/Portfolio"
  },

  // 🎨 THEME & APPEARANCE
  theme: {
    defaultTheme: "dark" as "dark" | "light" | "neon" | "pastel" | "cyberpunk",
    enableCustomizationPanel: true,
    enableThemeSelector: true,
    enableProgressBar: true,
    enableSectionIndicators: true,
    enableScrollToTop: true
  },

  // 📊 STATS FOR ABOUT PAGE
  stats: [
    { label: "Years Experience", value: 1, suffix: "+", duration: 2000 },
    { label: "Projects Built", value: 10, suffix: "+", duration: 2200 },
    { label: "GitHub Repos", value: 13, suffix: "+", duration: 2400 },
    { label: "Tests Written", value: 100, suffix: "+", duration: 2600 }
  ],

  // 🚀 PROJECTS (synced from GitHub)
  projects: [
    {
      id: "1",
      title: "Evergreen",
      description: "A full-stack monorepo application built with TypeScript and Docker Compose. Features a multi-app architecture with shared packages, containerised services, and a comprehensive test plan covering unit, integration and E2E scenarios.",
      tech: ["TypeScript", "Docker", "Monorepo", "Node.js"],
      images: [
        "https://opengraph.githubassets.com/1/gokulsenthilkumar3/Evergreen"
      ],
      links: {
        github: "https://github.com/gokulsenthilkumar3/Evergreen"
      },
      featured: true,
      category: "web" as "web" | "mobile" | "3d" | "ai" | "other",
      tags: ["typescript", "docker", "monorepo", "testing"],
      date: "2026-02-08",
      status: "in-progress" as "completed" | "in-progress" | "planned"
    },
    {
      id: "2",
      title: "Finance OxFin",
      description: "A personal finance management platform built with TypeScript. Helps users track income, expenses, and savings goals with a clean dashboard-driven UI.",
      tech: ["TypeScript", "Next.js", "React", "Tailwind CSS"],
      images: [
        "https://opengraph.githubassets.com/1/gokulsenthilkumar3/Finance-OxFin"
      ],
      links: {
        github: "https://github.com/gokulsenthilkumar3/Finance-OxFin"
      },
      featured: true,
      category: "web",
      tags: ["finance", "typescript", "next.js", "dashboard"],
      date: "2026-01-31",
      status: "in-progress"
    },
    {
      id: "3",
      title: "Weave",
      description: "A PHP-based web application actively maintained with recent commits. Built for managing structured data with a clean backend architecture.",
      tech: ["PHP", "MySQL", "HTML", "CSS"],
      images: [
        "https://opengraph.githubassets.com/1/gokulsenthilkumar3/weave"
      ],
      links: {
        github: "https://github.com/gokulsenthilkumar3/weave"
      },
      featured: true,
      category: "web",
      tags: ["php", "mysql", "backend"],
      date: "2024-08-15",
      status: "in-progress"
    },
    {
      id: "4",
      title: "PrivateComparer",
      description: "A TypeScript utility tool for comparing private data structures and outputs. Useful for validating test results and diff-checking complex objects in QA workflows.",
      tech: ["TypeScript", "Node.js"],
      images: [
        "https://opengraph.githubassets.com/1/gokulsenthilkumar3/PrivateComparer"
      ],
      links: {
        github: "https://github.com/gokulsenthilkumar3/PrivateComparer"
      },
      featured: false,
      category: "other",
      tags: ["typescript", "testing", "utilities"],
      date: "2026-04-01",
      status: "in-progress"
    },
    {
      id: "5",
      title: "Yarn Management System",
      description: "A TypeScript-based inventory management system for a yarn/textile business. Tracks stock levels, orders, and production batches with a structured data model.",
      tech: ["TypeScript", "React", "Node.js", "PostgreSQL"],
      images: [
        "https://opengraph.githubassets.com/1/gokulsenthilkumar3/Yarn-Management"
      ],
      links: {
        github: "https://github.com/gokulsenthilkumar3/Yarn-Management"
      },
      featured: false,
      category: "web",
      tags: ["inventory", "typescript", "react", "postgresql"],
      date: "2026-01-25",
      status: "completed"
    },
    {
      id: "6",
      title: "Invoice Generator",
      description: "A TypeScript web app for generating professional invoices. Supports custom line items, client details, tax calculations, and PDF export.",
      tech: ["TypeScript", "React", "PDF"],
      images: [
        "https://opengraph.githubassets.com/1/gokulsenthilkumar3/Invoice-Generator"
      ],
      links: {
        github: "https://github.com/gokulsenthilkumar3/Invoice-Generator"
      },
      featured: false,
      category: "web",
      tags: ["invoice", "typescript", "pdf", "react"],
      date: "2026-03-31",
      status: "completed"
    },
    {
      id: "7",
      title: "FindThemNow",
      description: "A JavaScript people/contact finder application. Enables quick lookup and directory browsing with a simple search interface.",
      tech: ["JavaScript", "React", "Node.js"],
      images: [
        "https://opengraph.githubassets.com/1/gokulsenthilkumar3/FindThemNow"
      ],
      links: {
        github: "https://github.com/gokulsenthilkumar3/FindThemNow"
      },
      featured: false,
      category: "web",
      tags: ["javascript", "search", "react"],
      date: "2026-03-31",
      status: "completed"
    },
    {
      id: "8",
      title: "Expense Tracker",
      description: "A JavaScript-based personal expense tracking app. Log daily expenses by category, view summaries, and monitor spending patterns over time.",
      tech: ["JavaScript", "React", "CSS"],
      images: [
        "https://opengraph.githubassets.com/1/gokulsenthilkumar3/Expense-Tracker"
      ],
      links: {
        github: "https://github.com/gokulsenthilkumar3/Expense-Tracker"
      },
      featured: false,
      category: "web",
      tags: ["expense", "javascript", "finance"],
      date: "2024-08-15",
      status: "completed"
    },
    {
      id: "9",
      title: "Amazon Clone",
      description: "A front-end clone of Amazon's UI built with JavaScript. Replicates product listing, cart, and checkout flows as a learning project.",
      tech: ["JavaScript", "HTML", "CSS", "Firebase"],
      images: [
        "https://opengraph.githubassets.com/1/gokulsenthilkumar3/amazon-clone"
      ],
      links: {
        github: "https://github.com/gokulsenthilkumar3/amazon-clone"
      },
      featured: false,
      category: "web",
      tags: ["clone", "javascript", "html", "css"],
      date: "2024-06-28",
      status: "completed"
    }
  ],

  // 💼 SKILLS
  skills: [
    // Frontend
    { id: "1", name: "React", category: "frontend" as const, proficiency: 4, color: "#61DAFB", yearsOfExperience: 2 },
    { id: "2", name: "Next.js", category: "frontend" as const, proficiency: 4, color: "#FFFFFF", yearsOfExperience: 1 },
    { id: "3", name: "TypeScript", category: "frontend" as const, proficiency: 4, color: "#3178C6", yearsOfExperience: 2 },
    { id: "4", name: "Tailwind CSS", category: "frontend" as const, proficiency: 4, color: "#06B6D4", yearsOfExperience: 2 },
    { id: "5", name: "JavaScript", category: "frontend" as const, proficiency: 4, color: "#F7DF1E", yearsOfExperience: 3 },
    { id: "6", name: "HTML/CSS", category: "frontend" as const, proficiency: 5, color: "#E34C26", yearsOfExperience: 3 },

    // Backend
    { id: "7", name: "Node.js", category: "backend" as const, proficiency: 3, color: "#339933", yearsOfExperience: 2 },
    { id: "8", name: "PostgreSQL", category: "backend" as const, proficiency: 3, color: "#336791", yearsOfExperience: 1 },
    { id: "9", name: "Express.js", category: "backend" as const, proficiency: 3, color: "#FFFFFF", yearsOfExperience: 2 },
    { id: "10", name: "PHP", category: "backend" as const, proficiency: 2, color: "#777BB4", yearsOfExperience: 1 },
    { id: "11", name: "MySQL", category: "backend" as const, proficiency: 3, color: "#4479A1", yearsOfExperience: 2 },

    // QA / Testing
    { id: "12", name: "K6 Load Testing", category: "tools" as const, proficiency: 4, color: "#7D64FF", yearsOfExperience: 1 },
    { id: "13", name: "Azure DevOps", category: "tools" as const, proficiency: 4, color: "#0078D4", yearsOfExperience: 1 },
    { id: "14", name: "Selenium", category: "tools" as const, proficiency: 3, color: "#43B02A", yearsOfExperience: 1 },
    { id: "15", name: "Test Automation", category: "tools" as const, proficiency: 4, color: "#FF6B35", yearsOfExperience: 1 },
    { id: "16", name: "Git", category: "tools" as const, proficiency: 4, color: "#F05032", yearsOfExperience: 3 },
    { id: "17", name: "Docker", category: "tools" as const, proficiency: 3, color: "#2496ED", yearsOfExperience: 1 },

    // Soft Skills
    { id: "18", name: "Problem Solving", category: "soft-skills" as const, proficiency: 5 },
    { id: "19", name: "Communication", category: "soft-skills" as const, proficiency: 4 },
    { id: "20", name: "Attention to Detail", category: "soft-skills" as const, proficiency: 5 },
    { id: "21", name: "Continuous Learning", category: "soft-skills" as const, proficiency: 5 }
  ],

  // 💼 EXPERIENCE (synced from LinkedIn)
  experiences: [
    {
      id: "1",
      role: "Software Development Engineer in Test (SDET)",
      company: "CloudAssert",
      period: {
        start: "2024-08-01",
        present: true
      },
      description: [
        "Design and implement automated test frameworks for cloud-based applications",
        "Perform performance and load testing using K6, analysing bottlenecks and reporting metrics via Azure DevOps",
        "Collaborate with development teams to integrate CI/CD pipelines and ensure quality gates are met before deployments",
        "Write and maintain test plans, test cases, and test reports covering functional, regression, and API testing"
      ],
      technologies: ["K6", "Azure DevOps", "Selenium", "TypeScript", "JavaScript", "REST APIs"],
      location: "Coimbatore, Tamil Nadu, India",
      type: "full-time" as const
    }
  ],

  // 🎓 EDUCATION
  education: [
    {
      id: "1",
      degree: "Master of Science (MS)",
      field: "Software Systems",
      institution: "Kongu Engineering College",
      period: { start: "2020", end: "2025" },
      location: "Erode, Tamil Nadu, India"
    }
  ],

  // 🌐 SOCIAL LINKS
  socialLinks: [
    {
      id: "1",
      platform: "github" as const,
      url: "https://github.com/gokulsenthilkumar3",
      icon: "github",
      color: "#333333",
      username: "gokulsenthilkumar3"
    },
    {
      id: "2",
      platform: "linkedin" as const,
      url: "https://linkedin.com/in/gokulsenthilkumar3",
      icon: "linkedin",
      color: "#0077B5",
      username: "gokulsenthilkumar3"
    },
    {
      id: "3",
      platform: "twitter" as const,
      url: "https://x.com/GokulKangeyanS",
      icon: "twitter",
      color: "#1DA1F2",
      username: "GokulKangeyanS"
    },
    {
      id: "4",
      platform: "email" as const,
      url: "mailto:gokulsenthilkumar3@gmail.com",
      icon: "mail",
      color: "#EA4335"
    }
  ],

  // 📝 SEO & METADATA
  seo: {
    title: "Gokul S | SDET & Full-Stack Developer",
    description: "SDET at CloudAssert building automated test frameworks and full-stack web apps. Passionate about quality engineering, React, Next.js, and PERN stack development.",
    keywords: ["SDET", "software development engineer in test", "full-stack developer", "react", "next.js", "typescript", "k6", "azure devops", "test automation", "portfolio"],
    siteUrl: "https://gokulsenthilkumar3.github.io/Portfolio",
    author: "Gokul S"
  }
}

// Export individual sections for easier imports
export const { personal, theme, stats, projects, skills, experiences, socialLinks, seo } = portfolioConfig
