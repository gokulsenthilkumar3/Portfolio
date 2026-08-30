'use client'

import { useState } from 'react'
import { AdminPanel } from '@/components/admin/AdminPanel'
import { EditableSection } from '@/components/admin/EditableSection'
import { useAdmin } from '@/components/admin/AdminProvider'
import { CinematicHero } from '@/components/portfolio/CinematicHero'
import { AboutStory } from '@/components/portfolio/AboutStory'
import { SkillsMarquee } from '@/components/portfolio/SkillsMarquee'
import { ProjectsGallery } from '@/components/portfolio/ProjectsGallery'
import { ContactInvitation } from '@/components/portfolio/ContactInvitation'
import { LinkedInSection } from '@/components/shared/LinkedInSection'

export default function Home() {
  const { isAdmin, portfolioData } = useAdmin()
  const [adminPanelOpen, setAdminPanelOpen] = useState(false)
  const [adminPanelTab, setAdminPanelTab] = useState('personal')

  const openPanel = (tab: string) => {
    setAdminPanelTab(tab)
    setAdminPanelOpen(true)
  }

  const { personal, projects, skills, experiences, education, stats } = portfolioData
  const uniqueProjectCount = new Set(projects.map((project) => project.id)).size

  return (
    <>
      {isAdmin && (
        <AdminPanel
          isOpen={adminPanelOpen}
          onClose={() => setAdminPanelOpen(false)}
          initialTab={adminPanelTab}
        />
      )}

      <EditableSection label="Hero" onEdit={() => openPanel('personal')}>
        <CinematicHero
          name={personal.name}
          role={personal.title}
          available={personal.availability !== 'busy'}
        />
      </EditableSection>

      <EditableSection label="About" onEdit={() => openPanel('personal')}>
        <AboutStory
          bio={personal.bio}
          portrait={personal.avatar || '/gokul-photo.jpg'}
          name={personal.name}
          location={personal.location}
          stats={stats}
          projectCount={uniqueProjectCount}
        />
      </EditableSection>

      <EditableSection label="Skills" onEdit={() => openPanel('skills')}>
        <SkillsMarquee skills={skills} />
      </EditableSection>

      <EditableSection label="Projects" onEdit={() => openPanel('projects')}>
        <ProjectsGallery projects={projects} />
      </EditableSection>

      <EditableSection label="Profile" onEdit={() => openPanel('experience')}>
        <LinkedInSection personal={personal} experiences={experiences} education={education} />
      </EditableSection>

      <EditableSection label="Contact" onEdit={() => openPanel('personal')}>
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
