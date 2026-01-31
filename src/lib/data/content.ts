// 📊 CENTRALIZED PORTFOLIO DATA
// All data is now managed in src/config/portfolio.config.ts
// Import from there to ensure consistency across the portfolio

import { portfolioConfig } from '@/config/portfolio.config'

// Export all data from the centralized config
export const siteConfig = {
  name: portfolioConfig.personal.name,
  title: portfolioConfig.personal.title,
  description: portfolioConfig.personal.bio,
  email: portfolioConfig.personal.email,
  location: portfolioConfig.personal.location,
  availability: portfolioConfig.personal.availability,
  bio: portfolioConfig.personal.bio,
  tagline: portfolioConfig.personal.tagline,
  resume: portfolioConfig.personal.resume,
  avatar: portfolioConfig.personal.avatar
}

export const projects = portfolioConfig.projects
export const skills = portfolioConfig.skills
export const experiences = portfolioConfig.experiences
export const socialLinks = portfolioConfig.socialLinks
export const stats = portfolioConfig.stats
export const theme = portfolioConfig.theme
export const seo = portfolioConfig.seo
