import { Project, Skill, Experience } from '../types/portfolio'

// Project helpers
export const filterProjects = (projects: Project[], category?: string) => {
  if (!category) return projects
  return projects.filter(project => project.category === category)
}

export const getFeaturedProjects = (projects: Project[]) => {
  return projects.filter(project => project.featured)
}

export const getProjectsByStatus = (projects: Project[], status: Project['status']) => {
  return projects.filter(project => project.status === status)
}

export const getProjectsByTech = (projects: Project[], tech: string) => {
  return projects.filter(project => 
    project.tech.some(t => t.toLowerCase().includes(tech.toLowerCase()))
  )
}

export const searchProjects = (projects: Project[], query: string) => {
  const lowercaseQuery = query.toLowerCase()
  return projects.filter(project =>
    project.title.toLowerCase().includes(lowercaseQuery) ||
    project.description.toLowerCase().includes(lowercaseQuery) ||
    project.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    project.tech.some(t => t.toLowerCase().includes(lowercaseQuery))
  )
}

// Skill helpers
export const getSkillsByCategory = (skills: Skill[], category: Skill['category']) => {
  return skills.filter(skill => skill.category === category)
}

export const getTopSkills = (skills: Skill[], limit = 10) => {
  return skills
    .filter(skill => skill.proficiency >= 4)
    .sort((a, b) => b.proficiency - a.proficiency)
    .slice(0, limit)
}

export const getSkillsByProficiency = (skills: Skill[], minProficiency: number) => {
  return skills.filter(skill => skill.proficiency >= minProficiency)
}

// Experience helpers
export const sortExperiencesByDate = (experiences: Experience[]) => {
  return experiences.sort((a, b) => {
    const dateA = a.period.present ? new Date() : new Date(a.period.end || a.period.start)
    const dateB = b.period.present ? new Date() : new Date(b.period.end || b.period.start)
    return dateB.getTime() - dateA.getTime()
  })
}

export const getCurrentExperience = (experiences: Experience[]) => {
  return experiences.find(exp => exp.period.present)
}

export const getExperienceDuration = (experience: Experience) => {
  const start = new Date(experience.period.start)
  const end = experience.period.present ? new Date() : new Date(experience.period.end!)
  
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  
  if (years === 0) return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
  if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`
  return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
}

// Date helpers
export const formatDate = (date: string, options: Intl.DateTimeFormatOptions = {}) => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    ...options
  }
  
  return new Date(date).toLocaleDateString('en-US', defaultOptions)
}

export const formatDateShort = (date: string) => {
  return formatDate(date, { month: 'short', year: 'numeric' })
}

export const getRelativeTime = (date: string) => {
  const now = new Date()
  const past = new Date(date)
  const diffInMs = now.getTime() - past.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
  return `${Math.floor(diffInDays / 365)} years ago`
}

// Array helpers
export const sortByDate = <T extends { date: string }>(items: T[], order: 'asc' | 'desc' = 'desc') => {
  return items.sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return order === 'desc' ? dateB - dateA : dateA - dateB
  })
}

export const groupByCategory = <T extends { category: string }>(items: T[]) => {
  return items.reduce((groups, item) => {
    const category = item.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

// Utility helpers
export const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export const throttle = <T extends (...args: any[]) => any>(func: T, limit: number) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const truncate = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export const generateReadingTime = (content: string) => {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}
