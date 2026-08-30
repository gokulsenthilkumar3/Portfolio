'use client'

import Image from 'next/image'
import { ArrowUpRight, BriefcaseBusiness, GraduationCap, Linkedin, MapPin } from 'lucide-react'
import type { Education, Experience, SiteConfig } from '@/lib/types/portfolio'
import { SectionHeading } from '@/components/portfolio/SectionHeading'

interface LinkedInSectionProps {
  personal: SiteConfig
  experiences: Experience[]
  education: Education[]
}

function formatPeriod(start?: string, end?: string) {
  const fmt = (val?: string) => {
    if (!val) return 'Present'
    const d = new Date(val)
    return d.toLocaleDateString('en', { month: 'short', year: 'numeric', timeZone: 'UTC' })
  }
  return `${fmt(start)} — ${fmt(end)}`
}

/**
 * Full LinkedIn-inspired profile: cover + avatar header, experience timeline,
 * and education card — matching the reference site's rich profile layout.
 */
export function LinkedInSection({ personal, experiences, education }: LinkedInSectionProps) {
  const currentRole = experiences.find((experience) => experience.period.present) ?? experiences[0]
  const latestEducation = education.reduce<typeof education[number] | undefined>((latest, item) => {
    if (!latest) return item
    return item.period.start > latest.period.start ? item : latest
  }, undefined)

  return (
    <section id="profile" className="portfolio-section linkedin-profile" aria-labelledby="profile-title">
      <SectionHeading
        id="profile-title"
        index="04"
        eyebrow="Profile"
        title="The person behind the systems."
        description="A closer, more human view of the work — the kind of context a polished professional profile should make easy to scan."
      />

      <div className="linkedin-profile__surface">
        {/* Cover gradient */}
        <div className="linkedin-profile__cover" aria-hidden="true" />

        {/* Header: avatar + identity */}
        <div className="linkedin-profile__header">
          <div className="linkedin-profile__avatar">
            <Image src={personal.avatar || '/gokul-photo.jpg'} alt={personal.name} width={128} height={128} />
          </div>

          <div className="linkedin-profile__identity">
            <div className="linkedin-profile__name-row">
              <h3>{personal.name}</h3>
              <span className="linkedin-profile__badge"><Linkedin aria-hidden="true" /> Profile view</span>
            </div>
            <p className="linkedin-profile__title">{personal.title}</p>
            <div className="linkedin-profile__meta">
              <span><MapPin aria-hidden="true" /> {personal.location}</span>
              {currentRole && <span><BriefcaseBusiness aria-hidden="true" /> {currentRole.company}</span>}
              {latestEducation && <span><GraduationCap aria-hidden="true" /> {latestEducation.institution}</span>}
            </div>
            {personal.linkedin && (
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noreferrer"
                className="linkedin-profile__connect"
                data-no-transition
                data-cursor="link"
              >
                Connect on LinkedIn <ArrowUpRight aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        {/* Body: experience timeline left, education + snapshot right */}
        <div className="linkedin-profile__body">
          {/* Experience timeline */}
          <div className="linkedin-profile__chapter">
            <p className="linkedin-profile__label">Experience</p>

            <div className="linkedin-profile__exp-list">
              {experiences.map((exp) => {
                const bullets = Array.isArray(exp.description) ? exp.description : []
                const summary = Array.isArray(exp.description) ? exp.description.join(' ') : exp.description

                return (
                  <div key={exp.id} className="linkedin-profile__exp-item">
                    <div className="linkedin-profile__exp-line">
                      <div className="linkedin-profile__exp-dot" />
                      <div className="linkedin-profile__exp-connector" />
                    </div>
                    <div className="linkedin-profile__exp-content">
                      <p className="linkedin-profile__exp-period">
                        {formatPeriod(exp.period?.start, exp.period?.end)}
                      </p>
                      <p className="linkedin-profile__exp-role">{exp.role}</p>
                      <p className="linkedin-profile__exp-company">{exp.company} · {exp.location}</p>
                      {bullets.length > 1 ? (
                        <ul className="linkedin-profile__exp-bullets">
                          {bullets.slice(0, 3).map((b, i) => <li key={i}>{b}</li>)}
                        </ul>
                      ) : (
                        <p className="linkedin-profile__exp-desc">{summary}</p>
                      )}
                      {exp.technologies?.length > 0 && (
                        <div className="linkedin-profile__exp-tags">
                          {exp.technologies.slice(0, 6).map((t) => <span key={t}>{t}</span>)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Snapshot + Education */}
          <aside className="linkedin-profile__snapshot" aria-label="Professional snapshot">
            <p className="linkedin-profile__label">Snapshot</p>
            <div className="linkedin-profile__metrics">
              <div><strong>{experiences.length}</strong><span>roles shipped</span></div>
              <div><strong>{education.length}</strong><span>learning chapters</span></div>
              <div><strong>{currentRole ? new Date(currentRole.period.start).getFullYear() : '—'}</strong><span>career start</span></div>
            </div>

            {education.map((edu) => (
              <p key={edu.id} className="linkedin-profile__education">
                <GraduationCap aria-hidden="true" />
                <span>
                  <strong>{edu.degree}{edu.field ? ` · ${edu.field}` : ''}</strong>
                  <small>{edu.institution}</small>
                </span>
              </p>
            ))}
          </aside>
        </div>
      </div>
    </section>
  )
}
