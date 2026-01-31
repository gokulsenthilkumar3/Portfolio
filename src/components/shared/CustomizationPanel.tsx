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
        className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-40 ${className}`}
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
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-2xl z-50 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Customize</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    title="Reset to defaults"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'theme' && <ThemeContent currentTheme={theme} onThemeChange={setTheme} />}
                    {activeTab === 'layout' && <LayoutContent />}
                    {activeTab === 'performance' && <PerformanceContent />}
                    {activeTab === 'accessibility' && <AccessibilityContent />}
                  </motion.div>
                </AnimatePresence>
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
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function ThemeContent({ currentTheme, onThemeChange }: { currentTheme: Theme; onThemeChange: (theme: Theme) => void }) {
  const themeColors = {
    dark: 'bg-gray-900',
    light: 'bg-white border',
    neon: 'bg-purple-900',
    pastel: 'bg-pink-100',
    cyberpunk: 'bg-green-900'
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Theme Presets</h3>
      <div className="space-y-2">
        {(Object.keys(themes) as Theme[]).map((themeName) => (
          <button
            key={themeName}
            onClick={() => onThemeChange(themeName)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
              currentTheme === themeName
                ? 'border-primary bg-primary/10'
                : 'border-border hover:bg-muted'
            }`}
          >
            <div className={`w-8 h-8 rounded-full ${themeColors[themeName]} border-2 border-muted-foreground/20`} />
            <div className="flex-1 text-left">
              <div className="font-medium capitalize">{themeName}</div>
              <div className="text-xs text-muted-foreground">
                {themeName === 'dark' && 'Professional dark theme'}
                {themeName === 'light' && 'Clean light theme'}
                {themeName === 'neon' && 'Vibrant neon colors'}
                {themeName === 'pastel' && 'Soft pastel palette'}
                {themeName === 'cyberpunk' && 'Futuristic cyber theme'}
              </div>
            </div>
            {currentTheme === themeName && (
              <div className="w-2 h-2 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

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
