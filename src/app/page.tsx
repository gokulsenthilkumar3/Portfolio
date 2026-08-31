'use client'

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
  const uniqueProjectCount = new Set(projects.map((project) => project.id)).size

  return (
    <>
      <EditableSection label="Hero" onEdit={() => openAdminPanel('personal')}>
        <CinematicHero
          name={personal.name}
          role={personal.title}
          available={personal.availability !== 'busy'}
        />
      </EditableSection>

      <EditableSection label="Selected work" onEdit={() => openAdminPanel('projects')}>
        <ProjectsGallery projects={projects} />
      </EditableSection>

      <EditableSection label="Profile" onEdit={() => openAdminPanel('resume')}>
        <LinkedInSection personal={personal} experiences={experiences} education={education} />
      </EditableSection>

      <EditableSection label="About" onEdit={() => openAdminPanel('personal')}>
        <AboutStory
          bio={personal.bio}
          portrait={personal.avatar || '/gokul-photo.jpg'}
          name={personal.name}
          location={personal.location}
          stats={stats}
          projectCount={uniqueProjectCount}
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
