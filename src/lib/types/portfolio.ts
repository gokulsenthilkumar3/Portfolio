export interface SiteConfig {
  name: string
  title: string
  tagline: string
  description: string
  bio: string
  email: string
  emailZoho?: string
  location: string
  availability: 'available' | 'busy' | 'open-to-offers'
  avatar?: string
  resume?: string
  github?: string
  linkedin?: string
  twitter?: string
  website?: string
  careerStart?: string
}

export interface Project {
  id: string
  title: string
  description: string
  tech?: string[]
  technologies?: string[]
  images: string[]
  icon?: string
  links: {
    live?: string
    github?: string
    demo?: string
  }
  featured: boolean
  category: 'web' | 'mobile' | '3d' | 'ai' | 'fullstack' | 'iot' | 'testing' | 'other' | 'tools'
  tags?: string[]
  date?: string
  status?: 'completed' | 'in-progress' | 'planned'
  problem?: string
  responsibility?: string
  evidence?: string
}

export interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'tools' | 'soft-skills' | 'design' | 'testing' | 'devops'
  proficiency: number
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
  description: string | string[]
  achievements?: string[]
  technologies: string[]
  location?: string
  type?: 'full-time' | 'part-time' | 'freelance' | 'internship' | 'contract'
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  period: {
    start: string
    end?: string
    present?: boolean
  }
  grade?: string
  location?: string
  achievements?: string[]
}

export interface SocialLink {
  id?: string
  platform: string
  url: string
  icon: string
  color?: string
  username?: string
}

export interface BlogPost {
  id: string
  title: string
  date: string
  readTime: string
  category: string
  excerpt: string
  content: string
  slug?: string
  coverImage?: string
  featured?: boolean
  tags?: string[]
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar?: string
  rating: number
  date: string
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

export interface AboutConfig {
  title: string
  subtitle: string
  featuredTitle: string
  featuredDesc: string
  featuredLong: string
  secondaryTitle: string
  secondarySkills: string[]
  contactHeading: string
  contactDesc: string
}

export interface Microblog {
  id: string
  text: string
  date: string
}

export interface GiscusConfig {
  repo: string
  repoId: string
  category: string
  categoryId: string
  mapping: string
}
