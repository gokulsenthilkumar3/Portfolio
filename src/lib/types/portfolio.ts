export interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  images: string[]
  links: {
    live?: string
    github?: string
    demo?: string
  }
  featured: boolean
  category: 'web' | 'mobile' | '3d' | 'ai' | 'other'
  tags: string[]
  date: string
  status: 'completed' | 'in-progress' | 'planned'
}

export interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'tools' | 'soft-skills' | 'design'
  proficiency: number // 1-5
  icon?: string
  color?: string
  description?: string
  yearsOfExperience?: number
}

export interface Experience {
  id: string
  role: string
  company: string
  period: {
    start: string
    end?: string
    present?: boolean
  }
  description: string[]
  technologies: string[]
  location?: string
  type: 'full-time' | 'part-time' | 'freelance' | 'internship'
}

export interface SocialLink {
  id: string
  platform: 'github' | 'linkedin' | 'twitter' | 'email' | 'website' | 'instagram'
  url: string
  icon: string
  color: string
  username?: string
}

export interface SiteConfig {
  name: string
  title: string
  description: string
  email: string
  location: string
  availability: 'available' | 'busy' | 'open-to-offers'
  bio: string
  tagline: string
  resume?: string
  avatar?: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar?: string
  rating: number // 1-5
  date: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  slug: string
  date: string
  readingTime: number
  tags: string[]
  featured: boolean
  coverImage?: string
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
  company?: string
}

export interface ThemeCustomization {
  primaryColor: string
  accentColor: string
  fontFamily: string
  fontSize: 'normal' | 'large' | 'larger'
  spacing: 'compact' | 'normal' | 'spacious'
  animations: 'none' | 'slow' | 'normal' | 'fast'
  cardStyle: 'flat' | 'elevated' | 'bordered' | 'glass'
  backgroundEffects: boolean
  reduceAnimations: boolean
  highContrast: boolean
  disable3D: boolean
}
