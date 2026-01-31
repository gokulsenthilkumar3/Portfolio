'use client'

import { useState, useMemo } from 'react'
import { Section } from '@/components/shared/Section'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MagneticButton } from '@/components/effects/MagneticButton'
import { projects } from '@/lib/data/content'
import { filterProjects, searchProjects } from '@/lib/utils/content-helpers'
import { Search, ExternalLink, Github, Filter, Calendar } from 'lucide-react'

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  const categories = ['all', 'web', 'mobile', '3d', 'ai', 'other']
  
  const filteredProjects = useMemo(() => {
    let filtered = projects
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filterProjects(filtered, selectedCategory)
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = searchProjects(filtered, searchQuery)
    }
    
    return filtered
  }, [selectedCategory, searchQuery])

  const displayProjects = showAll ? filteredProjects : filteredProjects.slice(0, 6)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-yellow-500'
      case 'planned': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'in-progress': return 'In Progress'
      case 'planned': return 'Planned'
      default: return status
    }
  }

  return (
    <Section id="projects">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection animation="fadeIn">
          <h2 className="text-4xl font-bold text-center mb-4">Projects</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            A collection of my recent work showcasing different technologies and approaches to solving real-world problems.
          </p>
        </AnimatedSection>

        {/* Search and Filter */}
        <AnimatedSection animation="slideUp" delay={0.2}>
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayProjects.map((project, index) => (
            <AnimatedSection 
              key={project.id} 
              animation="scaleIn" 
              delay={0.1 * (index % 6)}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden">
                {/* Project Image */}
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {project.images[0] && (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  {project.featured && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge 
                      variant="secondary" 
                      className="text-xs"
                    >
                      <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(project.status)}`} />
                      {getStatusText(project.status)}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                    <Badge variant="outline" className="capitalize text-xs">
                      {project.category}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1">
                    {project.tech.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.tech.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.tech.length - 4}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(project.date).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {project.links.live && (
                      <MagneticButton strength={0.2}>
                        <Button size="sm" className="flex-1">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Live
                        </Button>
                      </MagneticButton>
                    )}
                    {project.links.github && (
                      <MagneticButton strength={0.2}>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Github className="h-3 w-3 mr-1" />
                          Code
                        </Button>
                      </MagneticButton>
                    )}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        {/* Load More Button */}
        {!showAll && filteredProjects.length > 6 && (
          <AnimatedSection animation="slideUp" delay={0.8}>
            <div className="text-center">
              <Button 
                onClick={() => setShowAll(true)}
                variant="outline"
                size="lg"
              >
                Load More Projects ({filteredProjects.length - 6} remaining)
              </Button>
            </div>
          </AnimatedSection>
        )}

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <AnimatedSection animation="fadeIn">
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No projects found</p>
                <p className="text-sm">
                  Try adjusting your search or filter criteria
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
              >
                Clear Filters
              </Button>
            </div>
          </AnimatedSection>
        )}
      </div>
    </Section>
  )
}
