import { z } from 'zod'
import { portfolioConfig } from '@/config/portfolio.config'
import type { Certification, Experience, Microblog, Project, SiteConfig, Skill, SocialLink } from '@/lib/types/portfolio'

export interface PortfolioData {
  personal: SiteConfig
  about: typeof portfolioConfig.about
  stats: typeof portfolioConfig.stats
  projects: Project[]
  skills: Skill[]
  experiences: Experience[]
  education: typeof portfolioConfig.education
  certifications: Certification[]
  socialLinks: SocialLink[]
  seo: typeof portfolioConfig.seo
  blog: typeof portfolioConfig.blog
  microblogs: Microblog[]
}

export const baselineData: PortfolioData = {
  personal: portfolioConfig.personal,
  about: portfolioConfig.about,
  stats: portfolioConfig.stats,
  projects: portfolioConfig.projects as Project[],
  skills: portfolioConfig.skills as Skill[],
  experiences: portfolioConfig.experiences as Experience[],
  education: portfolioConfig.education,
  certifications: portfolioConfig.certifications,
  socialLinks: portfolioConfig.socialLinks as SocialLink[],
  seo: portfolioConfig.seo,
  blog: portfolioConfig.blog,
  microblogs: portfolioConfig.microblogs as Microblog[],
}

const webUrl = z.string().url().refine((value) => value.startsWith('https://'), 'Use an HTTPS URL')
const optionalWebUrl = z.union([webUrl, z.literal('')]).optional()
const mediaPath = z.string().refine((value) => /^\/(?!\/)[a-zA-Z0-9/_-]+\.(webp|png|jpe?g|svg)$/i.test(value), 'Use a local image path')
const text = z.string().trim().max(5000)
const shortText = z.string().trim().max(500)
const period = z.object({ start: shortText, end: shortText.optional(), present: z.boolean().optional() })

const projectSchema = z.object({
  kind: z.enum(['project', 'research']).optional(),
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: shortText.min(1),
  description: text.min(1),
  tech: z.array(shortText).optional(),
  technologies: z.array(shortText).optional(),
  images: z.array(mediaPath).max(8),
  icon: shortText.optional(),
  links: z.object({ github: optionalWebUrl, live: optionalWebUrl, demo: optionalWebUrl }),
  featured: z.boolean(),
  category: z.enum(['web', 'mobile', '3d', 'ai', 'fullstack', 'iot', 'testing', 'other', 'tools']),
  tags: z.array(shortText).optional(),
  date: shortText.optional(),
  status: z.enum(['completed', 'in-progress', 'planned']).optional(),
  problem: text.optional(),
  responsibility: text.optional(),
  evidence: text.optional(),
  nextSteps: text.optional(),
  mediaCaption: shortText.optional(),
  mediaType: z.enum(['concept', 'prototype', 'screenshot']).optional(),
  sourceReviewedAt: shortText.optional(),
})

const schema = z.object({
  personal: z.object({
    name: shortText.min(1), title: shortText.min(1), tagline: text, description: text.optional(),
    bio: text, email: z.email(), emailZoho: z.email().optional(), location: shortText,
    availability: z.enum(['available', 'busy', 'open-to-offers']),
    avatar: mediaPath.optional(), resume: z.string().regex(/^\/(?!\/)[\w/.-]+\.pdf$/i).optional(),
    github: optionalWebUrl, linkedin: optionalWebUrl, twitter: optionalWebUrl, website: optionalWebUrl,
    careerStart: shortText.optional(), heroHeading: shortText.optional(), aboutManifesto: text.optional(),
  }),
  about: z.object({
    title: shortText, subtitle: shortText, featuredTitle: shortText, featuredDesc: text,
    projectsHeading: shortText, projectsIntro: text, skillsHeading: shortText, skillsIntro: text,
    featuredLong: text, secondaryTitle: shortText, secondarySkills: z.array(shortText),
    contactHeading: shortText, contactDesc: text,
  }),
  stats: z.array(z.object({ label: shortText, value: z.number(), suffix: shortText, duration: z.number() })).max(20),
  projects: z.array(projectSchema).max(60).superRefine((projects, context) => {
    const ids = projects.map((project) => project.id)
    if (new Set(ids).size !== ids.length) context.addIssue({ code: 'custom', message: 'Project IDs must be unique' })
  }),
  skills: z.array(z.object({ id: shortText, name: shortText, category: z.enum(['frontend','backend','tools','soft-skills','design','testing','devops']), proficiency: z.number().min(0).max(5), icon: shortText.optional(), color: shortText.optional(), description: text.optional(), yearsOfExperience: z.number().optional() })).max(100),
  experiences: z.array(z.object({ id: shortText, role: shortText, company: shortText, period, description: z.union([text, z.array(text)]), achievements: z.array(text).optional(), technologies: z.array(shortText), location: shortText.optional(), type: z.enum(['full-time','part-time','freelance','internship','contract']).optional() })).max(50),
  education: z.array(z.object({ id: shortText, institution: shortText, degree: shortText, field: shortText, period, grade: shortText.optional(), location: shortText.optional(), achievements: z.array(text).optional() })).max(50),
  certifications: z.array(z.object({ id: shortText, name: shortText, issuer: shortText, issued: shortText.optional(), expires: shortText.optional(), credentialId: shortText.optional(), url: optionalWebUrl })).max(50),
  socialLinks: z.array(z.object({ id: shortText.optional(), platform: shortText, url: z.string().refine((value) => value.startsWith('mailto:') || value.startsWith('https://'), 'Use HTTPS or mailto'), icon: shortText, color: shortText.optional(), username: shortText.optional() })).max(30),
  seo: z.object({ title: shortText, description: text, keywords: z.array(shortText), ogImage: mediaPath, siteUrl: webUrl, author: shortText }),
  blog: z.array(z.object({ id: shortText, title: shortText, date: shortText, readTime: shortText, category: shortText, excerpt: text, content: text, slug: shortText.optional(), coverImage: mediaPath.optional(), featured: z.boolean().optional(), tags: z.array(shortText).optional() })).max(50),
  microblogs: z.array(z.object({ id: shortText, text, date: shortText })).max(100),
})

/** Whitelist fields before publishing; never return private draft-only keys. */
export function parsePortfolioData(input: unknown): PortfolioData {
  const stored = input && typeof input === 'object' ? input as Partial<PortfolioData> : {}
  const merged = {
    ...baselineData,
    ...stored,
    personal: { ...baselineData.personal, ...stored.personal },
    about: { ...baselineData.about, ...stored.about },
    seo: { ...baselineData.seo, ...stored.seo },
  }
  return schema.parse(merged) as PortfolioData
}
