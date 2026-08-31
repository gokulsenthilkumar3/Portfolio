'use client'

import React, { useRef } from 'react'
import { cn } from '@/lib/utils/cn'

export interface Tab {
  id: string
  label: string | React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
  tabClassName?: string
}

export function Tabs({ tabs, activeTab, onChange, className, tabClassName }: TabsProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const moveFocus = (index: number) => {
    const nextIndex = (index + tabs.length) % tabs.length
    const nextTab = tabs[nextIndex]
    if (!nextTab) return
    onChange(nextTab.id)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div
      className={cn("flex space-x-1 p-1 bg-white/5 border border-white/10 rounded-xl overflow-x-auto custom-scrollbar", className)}
      role="tablist"
      aria-orientation="horizontal"
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={(element) => { tabRefs.current[index] = element }}
          id={`tab-${tab.id}`}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          tabIndex={activeTab === tab.id ? 0 : -1}
          onClick={() => onChange(tab.id)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
              event.preventDefault()
              moveFocus(index + 1)
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
              event.preventDefault()
              moveFocus(index - 1)
            } else if (event.key === 'Home') {
              event.preventDefault()
              moveFocus(0)
            } else if (event.key === 'End') {
              event.preventDefault()
              moveFocus(tabs.length - 1)
            }
          }}
          className={cn(
            "flex min-h-11 flex-1 items-center justify-center px-3 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            activeTab === tab.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
            tabClassName
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
