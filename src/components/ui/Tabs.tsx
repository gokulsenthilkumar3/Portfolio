'use client'

import React from 'react'
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
  return (
    <div className={cn("flex space-x-1 p-1 bg-white/5 border border-white/10 rounded-xl overflow-x-auto custom-scrollbar", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap",
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
