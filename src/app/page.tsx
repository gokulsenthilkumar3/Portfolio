'use client'

import { useEffect, useState } from 'react'

import { EditableSection } from '@/components/admin/EditableSection'
import { useAdmin } from '@/components/admin/AdminProvider'
import { CinematicHero } from '@/components/portfolio/CinematicHero'
import { AboutStory } from '@/components/portfolio/AboutStory'
import { SkillsMarquee } from '@/components/portfolio/SkillsMarquee'
import { ProjectBrowser } from '@/components/portfolio/ProjectBrowser'
import { Credibility } from '@/components/portfolio/Credibility'
import { ContactInvitation } from '@/components/portfolio/ContactInvitation'
import { LinkedInSection } from '@/components/shared/LinkedInSection'

export default function Home() {
  const { portfolioData, openAdminPanel } = useAdmin()

  const { personal, projects, skills, experiences, education, stats } = portfolioData
  const uniqueProjectCount = new Set(projects.filter((project) => project.kind !== 'research').map((project) => project.id)).size
  const [liveStats, setLiveStats] = useState<typeof stats | null>(null)
  const [githubLive, setGithubLive] = useState(false)

  useEffect(() => {
    let active = true
    fetch('/api/stats', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (active && Array.isArray(data?.stats)) {
          setLiveStats(data.stats)
          setGithubLive(data.stats.some((stat: { label: string; source?: string }) => stat.label === 'GitHub Repos' && stat.source === 'github_api'))
        }
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const displayStats = liveStats || stats

  return (
    <>
      <EditableSection label="Hero" onEdit={() => openAdminPanel('personal')}>
        <CinematicHero
          name={personal.name}
          role={personal.title}
          available={personal.availability !== 'busy'}
          heroHeading={personal.heroHeading}
          tagline={personal.tagline}
        />
      </EditableSection>

      <EditableSection label="About" onEdit={() => openAdminPanel('personal')}>
        <AboutStory
          bio={personal.bio}
          portrait={personal.avatar || '/profile-portrait.png'}
          name={personal.name}
          location={personal.location}
          stats={displayStats}
          projectCount={uniqueProjectCount}
          manifesto={personal.aboutManifesto}
          repoCountSource={githubLive ? 'live' : 'fallback'}
          title={portfolioData.about.title}
          subtitle={portfolioData.about.subtitle}
        >
          <LinkedInSection experiences={experiences} education={education} certifications={portfolioData.certifications} />
        </AboutStory>
      </EditableSection>

      <EditableSection label="All projects" onEdit={() => openAdminPanel('projects')}>
        <ProjectBrowser projects={projects} heading={portfolioData.about.projectsHeading} intro={portfolioData.about.projectsIntro} />
      </EditableSection>

      <EditableSection label="Skills" onEdit={() => openAdminPanel('skills')}>
        <SkillsMarquee skills={skills} heading={portfolioData.about.skillsHeading} intro={portfolioData.about.skillsIntro} />
      </EditableSection>

      <Credibility />
      <EditableSection label="Contact" onEdit={() => openAdminPanel('personal')}>
        <ContactInvitation
          name={personal.name}
          email={personal.email}
          github={personal.github}
          linkedin={personal.linkedin}
          twitter={personal.twitter}
          heading={portfolioData.about.contactHeading}
          description={portfolioData.about.contactDesc}
        />
      </EditableSection>
    </>
  )
}
