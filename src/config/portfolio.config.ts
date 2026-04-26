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
      images: [],
      links: { github: "https://github.com/gokulsenthilkumar3" }
    },
    {
      id: "car-renovation-spa",
      title: "Car Renovation Spa",
      description: "Full-stack car service booking platform with real-time renovation progress tracking and appointment management.",
      tech: ["React.js", "Node.js", "MongoDB", "Express"],
      category: "fullstack",
      featured: true,
      images: [],
      links: { github: "https://github.com/gokulsenthilkumar3" }
    },
    {
      id: "expense-tracker",
      title: "Expense Tracker",
      description: "Daily expense monitor with MongoDB aggregation-powered chart analytics and category-based insights.",
      tech: ["React.js", "Node.js", "MongoDB", "Express"],
      category: "fullstack",
      featured: true,
      images: [],
      links: { github: "https://github.com/gokulsenthilkumar3" }
    },
    {
      id: "maruti-opticals",
      title: "Maruti Opticals",
      description: "E-commerce platform for optical businesses with advanced product filters and optimized MySQL queries.",
      tech: ["HTML", "CSS", "JavaScript", "MySQL"],
      category: "web",
      featured: true,
      images: [],
      links: { github: "https://github.com/gokulsenthilkumar3" }
    },
    {
      id: "digital-notice-board",
      title: "Digital Notice Board",
      description: "Smart Raspberry Pi notice board with a web-based remote scheduling interface for institutions.",
      tech: ["Raspberry Pi", "Python", "HTML", "CSS"],
      category: "iot",
      featured: false,
      images: [],
      links: { github: "https://github.com/gokulsenthilkumar3" }
    },
    {
      id: "forex-prediction",
      title: "Forex Prediction (IEEE)",
      description: "Published at IEEE CIFEr — benchmarked GRU, Informer & TFT models for forex forecasting. TFT achieved the highest trading profit.",
      tech: ["Python", "TensorFlow", "Deep Learning", "GRU"],
      category: "ai",
      featured: true,
      images: [],
      links: { github: "https://github.com/gokulsenthilkumar3" }
    }
  ],
  // 💼 SKILLS
  skills: [
    { id: "ts", name: "TypeScript", category: "language", level: 85, color: "#3178c6" },
    { id: "js", name: "JavaScript", category: "language", level: 90, color: "#f7df1e" },
    { id: "react", name: "React.js", category: "frontend", level: 85, color: "#61dafb" },
    { id: "nextjs", name: "Next.js", category: "frontend", level: 80, color: "#ffffff" },
    { id: "node", name: "Node.js", category: "backend", level: 80, color: "#339933" },
    { id: "k6", name: "K6 Load Testing", category: "testing", level: 88, color: "#7d64ff" },
    { id: "selenium", name: "Selenium", category: "testing", level: 82, color: "#43b02a" },
    { id: "testcafe", name: "TestCafe", category: "testing", level: 80, color: "#09a8d0" },
    { id: "azure", name: "Azure DevOps", category: "devops", level: 78, color: "#0078d4" },
    { id: "mysql", name: "MySQL", category: "database", level: 82, color: "#4479a1" },
    { id: "python", name: "Python", category: "language", level: 75, color: "#3776ab" },
    { id: "postman", name: "Postman", category: "testing", level: 85, color: "#ff6c37" },
    { id: "php", name: "PHP", category: "backend", level: 70, color: "#777bb4" },
    { id: "git", name: "Git", category: "devops", level: 85, color: "#f05032" }
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

export const { personal, theme, stats, projects, skills, experiences, education, socialLinks, seo } = portfolioConfig
