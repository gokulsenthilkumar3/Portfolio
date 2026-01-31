'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { experiences } from '@/lib/data/content'
import { sortExperiencesByDate, getExperienceDuration } from '@/lib/utils/content-helpers'

interface TimelineProps {
  className?: string
}

export function Timeline({ className }: TimelineProps) {
  const sortedExperiences = sortExperiencesByDate(experiences)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="space-y-8"
      >
        {sortedExperiences.map((experience, index) => (
          <motion.div
            key={experience.id}
            variants={itemVariants}
            className="relative flex items-start gap-6"
          >
            {/* Timeline Dot */}
            <div className="relative z-10">
              <motion.div
                className="w-4 h-4 bg-primary rounded-full border-4 border-background"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
              {index === 0 && (
                <motion.div
                  className="absolute inset-0 bg-primary rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>

            {/* Content */}
            <Card className="flex-1">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{experience.role}</h3>
                    <p className="text-primary font-medium">{experience.company}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{getExperienceDuration(experience)}</span>
                    {experience.location && (
                      <span>• {experience.location}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {experience.description.map((desc, descIndex) => (
                    <li key={descIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
