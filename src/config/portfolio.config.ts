// 🎨 PORTFOLIO CONFIGURATION - EDIT YOUR VALUES HERE
// This is the only file you need to edit to customize your entire portfolio

export const portfolioConfig = {
  // 👤 PERSONAL INFORMATION
  personal: {
    name: "Gokul Senthilkumar",
    title: "Full-Stack Developer",
    tagline: "Building the future of the web, one line of code at a time",
    bio: "I'm a full-stack developer with 5+ years of experience building web applications. I love working with React, Next.js, and modern JavaScript frameworks to create fast, accessible, and beautiful user interfaces.",
    email: "gokul@gokulsenthilkumar.dev",
    location: "San Francisco, CA",
    availability: "available" as "available" | "busy" | "open-to-offers",
    avatar: "https://picsum.photos/seed/gokulsenthilkumar/400/400.jpg",
    resume: "/resume.pdf", // Path to your resume file
    github: "https://github.com/gokulsenthilkumar3",
    linkedin: "https://linkedin.com/in/gokulsenthilkumar",
    twitter: "https://twitter.com/gokulsenthilkumar",
    website: "https://gokulsenthilkumar.dev"
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
    { label: "Years Experience", value: 5, suffix: "+", duration: 2000 },
    { label: "Projects Completed", value: 50, suffix: "+", duration: 2200 },
    { label: "Happy Clients", value: 30, suffix: "+", duration: 2400 },
    { label: "Awards Won", value: 5, suffix: "+", duration: 2600 }
  ],

  // 🚀 PROJECTS
  projects: [
    {
      id: "1",
      title: "E-Commerce Platform",
      description: "A modern e-commerce platform built with Next.js, featuring real-time inventory management, secure payments, and responsive design.",
      tech: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Tailwind CSS"],
      images: [
        "https://picsum.photos/seed/ecommerce1/800/600.jpg",
        "https://picsum.photos/seed/ecommerce2/800/600.jpg"
      ],
      links: {
        live: "https://example.com",
        github: "https://github.com/example"
      },
      featured: true,
      category: "web" as "web" | "mobile" | "3d" | "ai" | "other",
      tags: ["e-commerce", "next.js", "typescript", "stripe"],
      date: "2024-01-15",
      status: "completed" as "completed" | "in-progress" | "planned"
    },
    {
      id: "2",
      title: "AI Task Manager",
      description: "An intelligent task management app that uses AI to prioritize tasks and suggest optimal scheduling.",
      tech: ["React", "Node.js", "OpenAI API", "MongoDB", "Express"],
      images: [
        "https://picsum.photos/seed/taskmanager1/800/600.jpg"
      ],
      links: {
        live: "https://example.com",
        github: "https://github.com/example"
      },
      featured: true,
      category: "ai",
      tags: ["ai", "productivity", "react", "node.js"],
      date: "2024-02-20",
      status: "completed"
    },
    {
      id: "3",
      title: "3D Portfolio Viewer",
      description: "Interactive 3D portfolio viewer built with React Three Fiber, showcasing projects in an immersive 3D environment.",
      tech: ["React Three Fiber", "Three.js", "Framer Motion", "TypeScript"],
      images: [
        "https://picsum.photos/seed/3dportfolio1/800/600.jpg"
      ],
      links: {
        live: "https://example.com",
        github: "https://github.com/example"
      },
      featured: true,
      category: "3d",
      tags: ["3d", "webgl", "react-three-fiber", "animation"],
      date: "2024-03-10",
      status: "completed"
    },
    {
      id: "4",
      title: "Mobile Weather App",
      description: "Cross-platform mobile weather app with real-time updates, location services, and beautiful weather animations.",
      tech: ["React Native", "TypeScript", "Weather API", "Redux"],
      images: [
        "https://picsum.photos/seed/weatherapp1/800/600.jpg"
      ],
      links: {
        github: "https://github.com/example"
      },
      featured: false,
      category: "mobile",
      tags: ["mobile", "react-native", "weather", "typescript"],
      date: "2024-01-05",
      status: "completed"
    },
    {
      id: "5",
      title: "Real-time Chat Platform",
      description: "Scalable real-time chat application with video calling, file sharing, and end-to-end encryption.",
      tech: ["Socket.io", "WebRTC", "Node.js", "React", "Redis"],
      images: [
        "https://picsum.photos/seed/chatplatform1/800/600.jpg"
      ],
      links: {
        live: "https://example.com",
        github: "https://github.com/example"
      },
      featured: false,
      category: "web",
      tags: ["real-time", "chat", "webrtc", "socket.io"],
      date: "2023-12-15",
      status: "completed"
    },
    {
      id: "6",
      title: "Data Analytics Dashboard",
      description: "Comprehensive analytics dashboard with interactive charts, real-time data visualization, and custom reporting.",
      tech: ["Next.js", "D3.js", "Chart.js", "Python", "FastAPI"],
      images: [
        "https://picsum.photos/seed/analytics1/800/600.jpg"
      ],
      links: {
        live: "https://example.com",
        github: "https://github.com/example"
      },
      featured: false,
      category: "web",
      tags: ["analytics", "data-visualization", "dashboard", "python"],
      date: "2023-11-20",
      status: "completed"
    }
  ],

  // 💼 SKILLS
  skills: [
    // Frontend
    { id: "1", name: "React", category: "frontend" as const, proficiency: 5, color: "#61DAFB", yearsOfExperience: 4 },
    { id: "2", name: "Next.js", category: "frontend" as const, proficiency: 5, color: "#000000", yearsOfExperience: 3 },
    { id: "3", name: "TypeScript", category: "frontend" as const, proficiency: 4, color: "#3178C6", yearsOfExperience: 3 },
    { id: "4", name: "Tailwind CSS", category: "frontend" as const, proficiency: 5, color: "#06B6D4", yearsOfExperience: 3 },
    { id: "5", name: "Vue.js", category: "frontend" as const, proficiency: 3, color: "#4FC08D", yearsOfExperience: 2 },
    { id: "6", name: "HTML/CSS", category: "frontend" as const, proficiency: 5, color: "#E34C26", yearsOfExperience: 5 },
    
    // Backend
    { id: "7", name: "Node.js", category: "backend" as const, proficiency: 4, color: "#339933", yearsOfExperience: 4 },
    { id: "8", name: "Python", category: "backend" as const, proficiency: 4, color: "#3776AB", yearsOfExperience: 3 },
    { id: "9", name: "PostgreSQL", category: "backend" as const, proficiency: 4, color: "#336791", yearsOfExperience: 3 },
    { id: "10", name: "MongoDB", category: "backend" as const, proficiency: 3, color: "#47A248", yearsOfExperience: 2 },
    { id: "11", name: "Express.js", category: "backend" as const, proficiency: 4, color: "#000000", yearsOfExperience: 3 },
    { id: "12", name: "FastAPI", category: "backend" as const, proficiency: 3, color: "#009688", yearsOfExperience: 2 },
    
    // Tools
    { id: "13", name: "Git", category: "tools" as const, proficiency: 5, color: "#F05032", yearsOfExperience: 5 },
    { id: "14", name: "Docker", category: "tools" as const, proficiency: 3, color: "#2496ED", yearsOfExperience: 2 },
    { id: "15", name: "AWS", category: "tools" as const, proficiency: 3, color: "#FF9900", yearsOfExperience: 2 },
    { id: "16", name: "Vercel", category: "tools" as const, proficiency: 4, color: "#000000", yearsOfExperience: 3 },
    { id: "17", name: "Figma", category: "tools" as const, proficiency: 3, color: "#F24E1E", yearsOfExperience: 2 },
    
    // Soft Skills
    { id: "18", name: "Problem Solving", category: "soft-skills" as const, proficiency: 5 },
    { id: "19", name: "Communication", category: "soft-skills" as const, proficiency: 4 },
    { id: "20", name: "Team Leadership", category: "soft-skills" as const, proficiency: 3 },
    { id: "21", name: "Time Management", category: "soft-skills" as const, proficiency: 4 },
    { id: "22", name: "Critical Thinking", category: "soft-skills" as const, proficiency: 4 },
    
    // Design
    { id: "23", name: "UI/UX Design", category: "design" as const, proficiency: 3, color: "#FF6B6B" },
    { id: "24", name: "Responsive Design", category: "design" as const, proficiency: 5, color: "#4ECDC4" },
    { id: "25", name: "Accessibility", category: "design" as const, proficiency: 4, color: "#45B7D1" }
  ],

  // 💼 EXPERIENCE
  experiences: [
    {
      id: "1",
      role: "Senior Full-Stack Developer",
      company: "Tech Innovations Inc.",
      period: {
        start: "2022-01-01",
        present: true
      },
      description: [
        "Lead development of enterprise web applications using Next.js and Node.js",
        "Mentor junior developers and conduct code reviews",
        "Implement CI/CD pipelines and improve deployment processes",
        "Collaborate with product managers to define technical requirements"
      ],
      technologies: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
      location: "San Francisco, CA",
      type: "full-time" as const
    },
    {
      id: "2",
      role: "Full-Stack Developer",
      company: "Digital Solutions Ltd.",
      period: {
        start: "2020-06-01",
        end: "2021-12-31"
      },
      description: [
        "Developed and maintained multiple client projects using React and Node.js",
        "Implemented responsive designs and improved website performance",
        "Integrated third-party APIs and payment gateways",
        "Participated in agile development processes"
      ],
      technologies: ["React", "Vue.js", "Node.js", "MongoDB", "Express.js"],
      location: "New York, NY",
      type: "full-time" as const
    },
    {
      id: "3",
      role: "Frontend Developer",
      company: "Creative Agency",
      period: {
        start: "2019-03-01",
        end: "2020-05-31"
      },
      description: [
        "Built responsive websites for various clients",
        "Created interactive UI components and animations",
        "Worked closely with designers to implement pixel-perfect designs",
        "Optimized website performance and SEO"
      ],
      technologies: ["HTML", "CSS", "JavaScript", "React", "Sass"],
      location: "Los Angeles, CA",
      type: "full-time" as const
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
      url: "https://linkedin.com/in/gokulsenthilkumar",
      icon: "linkedin",
      color: "#0077B5",
      username: "gokulsenthilkumar"
    },
    {
      id: "3",
      platform: "twitter" as const,
      url: "https://twitter.com/gokulsenthilkumar",
      icon: "twitter",
      color: "#1DA1F2",
      username: "gokulsenthilkumar"
    },
    {
      id: "4",
      platform: "email" as const,
      url: "mailto:gokul@gokulsenthilkumar.dev",
      icon: "mail",
      color: "#EA4335"
    },
    {
      id: "5",
      platform: "website" as const,
      url: "https://gokulsenthilkumar.dev",
      icon: "globe",
      color: "#4285F4"
    }
  ],

  // 📝 SEO & METADATA
  seo: {
    title: "Portfolio | Gokul Senthilkumar",
    description: "Full-stack developer portfolio showcasing projects, skills, and experience",
    keywords: ["full-stack developer", "react", "next.js", "typescript", "portfolio"],
    siteUrl: "https://gokulsenthilkumar.github.io/Portfolio",
    author: "Gokul Senthilkumar"
  }
}

// Export individual sections for easier imports
export const { personal, theme, stats, projects, skills, experiences, socialLinks, seo } = portfolioConfig
