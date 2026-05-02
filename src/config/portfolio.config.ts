// 🎨 PORTFOLIO CONFIGURATION - EDIT YOUR VALUES HERE
// This is the only file you need to edit to customize your entire portfolio

export const portfolioConfig = {
  // 👤 PERSONAL INFORMATION
  personal: {
    name: "Gokul S",
    title: "SDET & Full-Stack Developer",
    tagline: "I test what others build and build what others test — bridging quality and code.",
    bio: "I'm an SDET at CloudAssert, Coimbatore, where I design automated test frameworks, run performance tests with K6, and integrate quality gates into Azure DevOps pipelines. Outside testing, I build full-stack web apps with React, Next.js, and the PERN stack.",
    email: "gokulsenthilkumar3@gmail.com",
    location: "Sivanmalai, Tamil Nadu, India",
    availability: "busy" as "available" | "busy" | "open-to-offers",
    avatar: "/gokul-photo.jpg",
    resume: "/Gokul_S_Resume.pdf",
    github: "https://github.com/gokulsenthilkumar3",
    linkedin: "https://www.linkedin.com/in/gokulsenthilkumar3/",
    twitter: "https://x.com/GokulKangeyanS",
    website: "https://portfolio-ten-plum-98.vercel.app"
  },
  // 📝 WEBSITE CONTENT (ABOUT & CONTACT)
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
  // 🎨 THEME & APPEARANCE
  theme: {
    defaultTheme: "dark" as "dark" | "light" | "neon" | "pastel" | "cyberpunk",
    enableCustomizationPanel: true,
    enableThemeSelector: true,
    enableProgressBar: true,
    enableSectionIndicators: true,
    enableScrollToTop: true
  },
  // 📊 STATS
  stats: [
    { label: "Years Experience", value: 1, suffix: "+", duration: 2000 },
    { label: "Projects Built", value: 10, suffix: "+", duration: 2200 },
    { label: "GitHub Repos", value: 13, suffix: "+", duration: 2400 },
    { label: "Tests Written", value: 100, suffix: "+", duration: 2600 }
  ],
  // 🚀 PROJECTS
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
      date: "2023-05-20",
      links: { github: "https://github.com/gokulsenthilkumar3" }
    },
    {
      id: "expense-tracker",
      title: "Expense Tracker",
      description: "Daily expense monitor with MongoDB aggregation-powered chart analytics and category-based insights.",
      tech: ["React.js", "Node.js", "MongoDB", "Express"],
      category: "fullstack",
      featured: true,
      images: ["/projects/expense-tracker.png"],
      date: "2023-08-10",
      links: { github: "https://github.com/gokulsenthilkumar3" }
    },
    {
      id: "maruti-opticals",
      title: "Maruti Opticals",
      description: "E-commerce platform for optical businesses with advanced product filters and optimized MySQL queries.",
      tech: ["HTML", "CSS", "JavaScript", "MySQL"],
      category: "web",
      featured: true,
      images: ["/projects/maruti-opticals.png"],
      date: "2022-12-05",
      links: { github: "https://github.com/gokulsenthilkumar3" }
    },
    {
      id: "digital-notice-board",
      title: "Digital Notice Board",
      description: "Smart Raspberry Pi notice board with a web-based remote scheduling interface for institutions.",
      tech: ["Raspberry Pi", "Python", "HTML", "CSS"],
      category: "iot",
      featured: false,
      images: ["/projects/notice-board.png"],
      date: "2023-03-25",
      links: { github: "https://github.com/gokulsenthilkumar3" }
    },
    {
      id: "forex-prediction",
      title: "Forex Prediction (IEEE)",
      description: "Published at IEEE CIFEr — benchmarked GRU, Informer & TFT models for forex forecasting. TFT achieved the highest trading profit.",
      tech: ["Python", "TensorFlow", "Deep Learning", "GRU"],
      category: "ai",
      featured: true,
      images: ["/projects/forex-prediction.png"],
      date: "2024-02-15",
      links: { github: "https://github.com/gokulsenthilkumar3" }
    },
    {
      id: "oxfin",
      title: "OxFin",
      description: "A professional fintech platform for financial management and analytics, featuring real-time data visualization.",
      tech: ["React", "Node.js", "Express", "PostgreSQL"],
      category: "fullstack",
      featured: false,
      images: ["/projects/oxfin.png"],
      date: "2024-03-15",
      links: { github: "https://github.com/gokulsenthilkumar3/OxFin" }
    },
    {
      id: "yarn-management",
      title: "Yarn-Management",
      description: "Industrial-grade inventory system for textile yarn management, optimizing stock tracking and order fulfillment.",
      tech: ["React", "PHP", "MySQL", "Tailwind"],
      category: "web",
      featured: false,
      images: ["/projects/yarn-management.png"],
      date: "2023-11-20",
      links: { github: "https://github.com/gokulsenthilkumar3/Yarn-Management" }
    },
    {
      id: "findthemnow",
      title: "FindThemNow",
      description: "A real-time search and tracking application for identifying and locating critical assets or personnel.",
      tech: ["JavaScript", "Firebase", "Geolocation API"],
      category: "other",
      featured: false,
      images: ["/projects/findthemnow.png"],
      date: "2024-01-10",
      links: { github: "https://github.com/gokulsenthilkumar3/FindThemNow" }
    }
  ],
  // 💼 SKILLS
  skills: [
    { id: "ts", name: "TypeScript", category: "frontend", proficiency: 5, color: "#3178c6" },
    { id: "js", name: "JavaScript", category: "frontend", proficiency: 5, color: "#f7df1e" },
    { id: "react", name: "React.js", category: "frontend", proficiency: 5, color: "#61dafb" },
    { id: "nextjs", name: "Next.js", category: "frontend", proficiency: 4, color: "#ffffff" },
    { id: "node", name: "Node.js", category: "backend", proficiency: 4, color: "#339933" },
    { id: "k6", name: "K6 Load Testing", category: "tools", proficiency: 5, color: "#7d64ff" },
    { id: "selenium", name: "Selenium", category: "tools", proficiency: 4, color: "#43b02a" },
    { id: "testcafe", name: "TestCafe", category: "tools", proficiency: 4, color: "#09a8d0" },
    { id: "azure", name: "Azure DevOps", category: "tools", proficiency: 4, color: "#0078d4" },
    { id: "mysql", name: "MySQL", category: "backend", proficiency: 4, color: "#4479a1" },
    { id: "python", name: "Python", category: "backend", proficiency: 4, color: "#3776ab" },
    { id: "postman", name: "Postman", category: "tools", proficiency: 5, color: "#ff6c37" },
    { id: "php", name: "PHP", category: "backend", proficiency: 3, color: "#777bb4" },
    { id: "git", name: "Git", category: "tools", proficiency: 4, color: "#f05032" }
  ],
  // 💼 EXPERIENCE
  experiences: [
    {
      id: "cloudassert",
      company: "CloudAssert Technologies",
      role: "Software Development Engineer in Test — Intern",
      period: { start: "2024-08-01", present: true },
      location: "Coimbatore, Tamil Nadu, India",
      description: "Designed automated test frameworks, ran K6 performance tests, and integrated quality gates into Azure DevOps CI/CD pipelines to ensure zero-defect deployments.",
      achievements: [
        "Built K6 load testing scripts covering 50+ API endpoints",
        "Integrated quality gates into Azure DevOps reducing regression time by 40%",
        "Maintained Selenium & TestCafe automation suites across multiple releases"
      ],
      technologies: ["K6", "Azure DevOps", "Selenium", "TestCafe", "TypeScript", "JavaScript", "REST APIs"]
    },
    {
      id: "emglitz",
      company: "Emglitz Technologies",
      role: "Junior Frontend Developer",
      period: { start: "2023-06-01", end: "2023-10-01" },
      location: "Coimbatore, Tamil Nadu, India",
      description: "Built responsive React UIs and contributed to frontend feature development for client-facing web applications.",
      achievements: [
        "Developed 10+ reusable React components adopted across 3 projects",
        "Improved page load performance by optimizing component re-renders"
      ],
      technologies: ["React.js", "JavaScript", "HTML", "CSS", "Tailwind CSS"]
    }
  ],
  // 🎓 EDUCATION
  education: [
    {
      id: "kongu",
      degree: "Master of Science (MS)",
      field: "Software Systems",
      institution: "Kongu Engineering College",
      period: { start: "2020", end: "2025" },
      location: "Erode, Tamil Nadu, India",
      grade: "8.5 CGPA"
    }
  ],
  // 🌐 SOCIAL LINKS
  socialLinks: [
    { platform: "github", url: "https://github.com/gokulsenthilkumar3", label: "GitHub" },
    { platform: "linkedin", url: "https://www.linkedin.com/in/gokulsenthilkumar3/", label: "LinkedIn" },
    { platform: "twitter", url: "https://x.com/GokulKangeyanS", label: "X / Twitter" },
    { platform: "email", url: "mailto:gokulsenthilkumar3@gmail.com", label: "Email" }
  ],
  // 📝 SEO & METADATA
  seo: {
    title: "Gokul S | SDET & Full-Stack Developer",
    description: "SDET at CloudAssert building automated test frameworks with K6, Selenium, and Azure DevOps. Full-stack developer with React, Next.js & Node.js. Based in Tamil Nadu, India.",
    keywords: ["SDET", "full-stack developer", "react", "next.js", "typescript", "k6", "azure devops", "selenium", "testcafe", "tamil nadu"],
    author: "Gokul S",
    siteUrl: "https://portfolio-ten-plum-98.vercel.app",
    ogImage: "/og-image.png"
  }
}

export const { personal, about, theme, stats, projects, skills, experiences, education, socialLinks, seo } = portfolioConfig
