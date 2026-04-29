'use client'

import { useState, useMemo } from 'react'
import { Section } from '@/components/shared/Section'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MagneticButton } from '@/components/effects/MagneticButton'
import { projects } from '@/lib/data/content'
import { filterProjects, searchProjects, formatDate } from '@/lib/utils/content-helpers'
import { Search, ExternalLink, Github, Filter, Calendar, Terminal, Globe, Database, Cpu, Brain, Flame, Zap, Code2 } from 'lucide-react'
import type { Project } from '@/lib/types/portfolio'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAll, setShowAll] = useState(true)

  const categories = ['all', 'web', 'fullstack', 'iot', 'ai', 'other']

  const getTechIcon = (tech: string, className = "h-4 w-4") => {
    const t = tech.toLowerCase()
    if (t.includes('react') || t.includes('next')) return <Code2 className={cn(className, "text-blue-400")} />
    if (t.includes('node') || t.includes('express')) return <Zap className={cn(className, "text-green-400")} />
    if (t.includes('python')) return <Terminal className={cn(className, "text-yellow-400")} />
    if (t.includes('php')) return <Globe className={cn(className, "text-indigo-400")} />
    if (t.includes('sql')) return <Database className={cn(className, "text-orange-400")} />
    if (t.includes('mongodb')) return <Database className={cn(className, "text-green-500")} />
    if (t.includes('raspberry') || t.includes('iot')) return <Cpu className={cn(className, "text-red-400")} />
    if (t.includes('dl') || t.includes('ai') || t.includes('learning')) return <Brain className={cn(className, "text-purple-400")} />
    if (t.includes('firebase')) return <Flame className={cn(className, "text-orange-500")} />
    return <Code2 className={cn(className, "text-muted-foreground")} />
  }

  const filteredProjects = useMemo(() => {
    let filtered = projects as Project[]
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filterProjects(filtered, selectedCategory as any)
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = searchProjects(filtered, searchQuery)
    }
    
    return filtered
  }, [selectedCategory, searchQuery])

  const displayProjects = filteredProjects

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
              delay={0.05 * index}
            >
              <Card className="group h-full flex flex-col bg-background/40 backdrop-blur-md border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)] overflow-hidden">
                {/* Project Tech Visualization (Replaces 'sucking' logos) */}
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                  <div className="relative z-10 p-4 rounded-full bg-background/50 backdrop-blur-xl border border-white/10 shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                    {getTechIcon(project.tech[0] || 'code', "h-12 w-12")}
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                  </div>
                  
                  {project.featured && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-md">
                        Featured
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge 
                      variant="secondary" 
                      className="text-[10px] bg-background/60 backdrop-blur-md border-white/5"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusColor(project.status)}`} />
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
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <div 
                        key={tech} 
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/5 border border-primary/10 text-[10px] font-medium text-primary"
                        title={tech}
                      >
                        {getTechIcon(tech)}
                        <span>{tech}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(project.date)}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {project.links.live && (
                      <MagneticButton strength={0.2} className="flex-1">
                        <Link 
                          href={project.links.live} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={cn(buttonVariants({ size: 'sm' }), "w-full")}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Live
                        </Link>
                      </MagneticButton>
                    )}
                    {project.links.github && (
                      <MagneticButton strength={0.2} className="flex-1">
                        <Link 
                          href={project.links.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), "w-full")}
                        >
                          <Github className="h-3 w-3 mr-1" />
                          Code
                        </Link>
                      </MagneticButton>
                    )}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>



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
