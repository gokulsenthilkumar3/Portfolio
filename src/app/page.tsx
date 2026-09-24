'use client'

import { useEffect, useState } from 'react'

import { EditableSection } from '@/components/admin/EditableSection'
import { useAdmin } from '@/components/admin/AdminProvider'
import { CinematicHero } from '@/components/portfolio/CinematicHero'
import { AboutStory } from '@/components/portfolio/AboutStory'
import { SkillsMarquee } from '@/components/portfolio/SkillsMarquee'
import { ProjectsGallery } from '@/components/portfolio/ProjectsGallery'
import { ContactInvitation } from '@/components/portfolio/ContactInvitation'
import { LinkedInSection } from '@/components/shared/LinkedInSection'

export default function Home() {
  const { portfolioData, openAdminPanel } = useAdmin()

  const { personal, projects, skills, experiences, education, stats } = portfolioData
  const uniqueProjectCount = new Set(projects.filter((project) => project.id !== 'forex-prediction').map((project) => project.id)).size
  const [publicRepoCount, setPublicRepoCount] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    fetch('/api/stats', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        const repoStat = data?.stats?.find((stat: { label: string }) => stat.label === 'GitHub Repos')
        if (active && repoStat?.source === 'github_api' && Number.isFinite(repoStat.value)) {
          setPublicRepoCount(repoStat.value)
        }
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const displayStats = stats.map((stat) => stat.label === 'GitHub Repos' && publicRepoCount !== null
    ? { ...stat, value: publicRepoCount }
    : stat)

  return (
    <>
      <EditableSection label="Hero" onEdit={() => openAdminPanel('personal')}>
        <CinematicHero
          name={personal.name}
          role={personal.title}
          available={personal.availability !== 'busy'}
          heroHeading={personal.heroHeading}
        />
      </EditableSection>

      <EditableSection label="All projects" onEdit={() => openAdminPanel('projects')}>
        <ProjectsGallery projects={projects} />
      </EditableSection>

      <EditableSection label="Profile" onEdit={() => openAdminPanel('resume')}>
        <LinkedInSection personal={personal} experiences={experiences} education={education} certifications={portfolioData.certifications} />
      </EditableSection>

      <EditableSection label="About" onEdit={() => openAdminPanel('personal')}>
        <AboutStory
          bio={personal.bio}
          portrait={personal.avatar || '/gokul-photo.jpg'}
          name={personal.name}
          location={personal.location}
          stats={displayStats}
          projectCount={uniqueProjectCount}
          manifesto={personal.aboutManifesto}
          repoCountSource={publicRepoCount === null ? 'fallback' : 'live'}
        />
      </EditableSection>

      <EditableSection label="Skills" onEdit={() => openAdminPanel('skills')}>
        <SkillsMarquee skills={skills} />
      </EditableSection>

      <EditableSection label="Contact" onEdit={() => openAdminPanel('personal')}>
        <ContactInvitation
          name={personal.name}
          email={personal.email}
          github={personal.github}
          linkedin={personal.linkedin}
          twitter={personal.twitter}
        />
      </EditableSection>
    </>
  )
}
