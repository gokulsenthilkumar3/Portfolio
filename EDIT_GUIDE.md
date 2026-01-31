# 📝 How to Edit Your Portfolio

## 🎯 **ONE FILE TO EDIT: `src/config/portfolio.config.ts`**

All your portfolio content is managed in **ONE SINGLE FILE**. Just edit this file to customize everything!

---

## 📋 **What You Can Edit**

### 👤 **Personal Information**
```typescript
personal: {
  name: "Your Name",                    // Your full name
  title: "Full-Stack Developer",         // Your professional title
  tagline: "Your catchy tagline",       // Your personal tagline
  bio: "Your professional bio...",      // Your detailed bio
  email: "your.email@example.com",      // Your contact email
  location: "Your City, Country",       // Your location
  availability: "available",           // "available" | "busy" | "open-to-offers"
  avatar: "https://your-avatar.jpg",   // Your profile picture URL
  github: "https://github.com/username", // Your GitHub profile
  linkedin: "https://linkedin.com/in/username", // Your LinkedIn
  twitter: "https://twitter.com/username",   // Your Twitter
  website: "https://yourwebsite.com"    // Your personal website
}
```

### 📊 **Stats (About Page)**
```typescript
stats: [
  { label: "Years Experience", value: 5, suffix: "+", duration: 2000 },
  { label: "Projects Completed", value: 50, suffix: "+", duration: 2200 },
  { label: "Happy Clients", value: 30, suffix: "+", duration: 2400 },
  { label: "Awards Won", value: 5, suffix: "+", duration: 2600 }
]
```

### 🚀 **Projects**
```typescript
projects: [
  {
    id: "1",
    title: "Your Project Name",
    description: "Project description...",
    tech: ["React", "TypeScript", "Node.js"],
    images: ["https://your-image.jpg"],
    links: {
      live: "https://your-project.com",
      github: "https://github.com/username/repo"
    },
    featured: true,                    // Show on homepage?
    category: "web",                   // "web" | "mobile" | "3d" | "ai" | "other"
    tags: ["web", "react", "typescript"],
    date: "2024-01-15",
    status: "completed"                // "completed" | "in-progress" | "planned"
  }
]
```

### 💼 **Skills**
```typescript
skills: [
  {
    id: "1",
    name: "React",
    category: "frontend",             // "frontend" | "backend" | "tools" | "soft-skills" | "design"
    proficiency: 5,                    // 1-5 (1=beginner, 5=expert)
    color: "#61DAFB",                 // Skill color
    yearsOfExperience: 4               // Optional: years of experience
  }
]
```

### 💼 **Experience**
```typescript
experiences: [
  {
    id: "1",
    role: "Your Job Title",
    company: "Company Name",
    period: {
      start: "2022-01-01",
      present: true                    // Set to false if ended
    },
    description: [
      "Your responsibility 1",
      "Your responsibility 2"
    ],
    technologies: ["React", "Node.js", "TypeScript"],
    location: "City, Country",
    type: "full-time"                  // "full-time" | "part-time" | "freelance" | "internship"
  }
]
```

### 🌐 **Social Links**
```typescript
socialLinks: [
  {
    id: "1",
    platform: "github",               // "github" | "linkedin" | "twitter" | "email" | "website"
    url: "https://github.com/username",
    icon: "github",
    color: "#333333",
    username: "username"
  }
]
```

### 🎨 **Theme Settings**
```typescript
theme: {
  defaultTheme: "dark",               // "dark" | "light" | "neon" | "pastel" | "cyberpunk"
  enableCustomizationPanel: true,     // Show/hide customization panel
  enableThemeSelector: true,         // Show/hide theme selector
  enableProgressBar: true,            // Show/hide progress bar
  enableSectionIndicators: true,      // Show/hide section dots
  enableScrollToTop: true             // Show/hide scroll to top button
}
```

### 📝 **SEO Settings**
```typescript
seo: {
  title: "Portfolio | Your Name",
  description: "Your portfolio description",
  keywords: ["full-stack developer", "react", "next.js"],
  siteUrl: "https://yourportfolio.com",
  author: "Your Name"
}
```

---

## 🚀 **Quick Start Steps**

1. **Open** `src/config/portfolio.config.ts`
2. **Edit** your personal information
3. **Update** your projects, skills, and experience
4. **Save** the file
5. **Refresh** your browser to see changes!

---

## 📸 **Adding Images**

### **Project Images**
```typescript
images: [
  "https://your-domain.com/project-image.jpg",
  // Or use placeholder:
  "https://picsum.photos/seed/yourproject/800/600.jpg"
]
```

### **Profile Avatar**
```typescript
avatar: "https://your-domain.com/your-photo.jpg",
// Or use placeholder:
avatar: "https://picsum.photos/seed/avatar/400/400.jpg"
```

---

## 🎯 **Pro Tips**

### **✅ DO:**
- Keep project descriptions concise (2-3 sentences)
- Use high-quality images for projects
- Set `featured: true` for your best 3-4 projects
- Keep skills proficiency realistic (1-5 scale)
- Update dates in YYYY-MM-DD format

### **❌ DON'T:**
- Edit any other files (everything comes from config)
- Use very long project descriptions
- Forget to update links when adding new projects
- Leave placeholder text in final version

---

## 🔧 **Advanced Customization**

If you want to customize colors, animations, or layout:
- Edit `src/lib/design-system.ts` (advanced)
- Edit component files in `src/components/` (expert)

**But for 99% of changes, just edit `portfolio.config.ts`!**

---

## 🎉 **That's It!**

Your portfolio is now fully customizable through one simple configuration file. Edit the values, save, and your beautiful portfolio updates instantly! 🚀
