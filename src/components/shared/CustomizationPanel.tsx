'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useThemeStore } from '@/lib/hooks/use-theme'
import { themes, Theme } from '@/lib/design-system'
import { Settings, X, Palette, Layout, Zap, Eye, RotateCcw } from 'lucide-react'

interface CustomizationPanelProps {
  className?: string
}

export function CustomizationPanel({ className }: CustomizationPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'theme' | 'layout' | 'performance' | 'accessibility'>('theme')
  const { theme, setTheme } = useThemeStore()

  const tabs = [
    { id: 'theme' as const, label: 'Theme', icon: Palette },
    { id: 'layout' as const, label: 'Layout', icon: Layout },
    { id: 'performance' as const, label: 'Performance', icon: Zap },
    { id: 'accessibility' as const, label: 'Accessibility', icon: Eye }
  ]

  const handleReset = () => {
    setTheme('dark')
    // Reset other settings here
  }

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-4 top-20 z-40 ${className}`}
      >
        <Settings className="h-4 w-4" />
      </Button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[350px] bg-background/80 backdrop-blur-xl border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden flex flex-col"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">Customize</h2>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    className="h-9 w-9 rounded-full hover:bg-white/5 transition-colors"
                    title="Reset to defaults"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-9 w-9 rounded-full hover:bg-white/5 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex p-2 gap-1 bg-black/20 mx-4 my-4 rounded-xl border border-white/5">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]'
                          : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {activeTab === 'theme' && <ThemeContent currentTheme={theme} onThemeChange={setTheme} />}
                    {activeTab === 'layout' && <LayoutContent />}
                    {activeTab === 'performance' && <PerformanceContent />}
                    {activeTab === 'accessibility' && <AccessibilityContent />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer info */}
              <div className="p-6 border-t border-white/5 bg-black/10">
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-medium">
                  Personal Portfolio v1.0 • Settings auto-save
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

    </>
  )
}

function ThemeContent({ currentTheme, onThemeChange }: { currentTheme: Theme; onThemeChange: (theme: Theme) => void }) {
  const themeColors = {
    dark: 'bg-slate-950',
    light: 'bg-white border'
  } as Record<string, string>

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Theme Presets</h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-tighter">
          {Object.keys(themes).length} Available
        </span>
      </div>
      <div className="grid gap-3">
        {(Object.keys(themes) as Theme[]).map((themeName) => {
          const isActive = currentTheme === themeName
          return (
            <button
              key={themeName}
              onClick={() => onThemeChange(themeName)}
              className={`group relative w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                isActive
                  ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20'
                  : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10'
              }`}
            >
              {/* Preview Circle */}
              <div className="relative">
                <div className={`w-12 h-12 rounded-full ${themeColors[themeName]} border-2 border-white/10 shadow-inner flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-110`}>
                  {/* Subtle decorative elements inside circle */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
                  {isActive && <Check className="h-5 w-5 text-primary" />}
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className={`font-bold capitalize ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {themeName}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground/60 leading-relaxed mt-0.5">
                  {themeName === 'dark' && 'Sleek & Professional Dark Mode'}
                  {themeName === 'light' && 'Clean & Minimalist Light Mode'}
                </div>
              </div>

              {/* Hover highlight */}
              <div className={`absolute inset-0 rounded-2xl bg-primary/0 transition-colors duration-300 ${!isActive && 'group-hover:bg-primary/[0.02]'}`} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Helper for check icon (needs import)
import { Check } from 'lucide-react'


function LayoutContent() {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Layout Options</h3>
      <div className="space-y-3">
        <label className="flex items-center justify-between">
          <span className="text-sm">Compact Mode</span>
          <input type="checkbox" className="toggle" />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-sm">Show Section Indicators</span>
          <input type="checkbox" className="toggle" defaultChecked />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-sm">Progress Bar</span>
          <input type="checkbox" className="toggle" defaultChecked />
        </label>
      </div>
    </div>
  )
}

function PerformanceContent() {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Performance</h3>
      <div className="space-y-3">
        <label className="flex items-center justify-between">
          <span className="text-sm">Reduce Animations</span>
          <input type="checkbox" className="toggle" />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-sm">Disable 3D Elements</span>
          <input type="checkbox" className="toggle" />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-sm">Simplified Theme</span>
          <input type="checkbox" className="toggle" />
        </label>
      </div>
    </div>
  )
}

function AccessibilityContent() {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Accessibility</h3>
      <div className="space-y-3">
        <label className="flex items-center justify-between">
          <span className="text-sm">High Contrast</span>
          <input type="checkbox" className="toggle" />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-sm">Larger Click Targets</span>
          <input type="checkbox" className="toggle" />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-sm">Focus Indicators</span>
          <input type="checkbox" className="toggle" defaultChecked />
        </label>
      </div>
    </div>
  )
}
