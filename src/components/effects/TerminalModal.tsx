'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Terminal as TerminalIcon } from 'lucide-react'

interface TerminalModalProps {
  isOpen: boolean
  onClose: () => void
}

type CommandResult = {
  command: string
  output: string | React.ReactNode
}

export function TerminalModal({ isOpen, onClose }: TerminalModalProps) {
  const [history, setHistory] = useState<CommandResult[]>([])
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    if (!trimmed) return

    let output: string | React.ReactNode = ''

    switch (trimmed) {
      case 'help':
        output = 'Available commands:\n  whoami   - Display bio\n  skills   - List core skills\n  projects - Show top projects\n  insights - View portfolio insights\n  contact  - Get contact info\n  github   - View GitHub stats\n  date     - Show current date/time\n  echo     - Print text\n  sudo     - Root access\n  clear    - Clear terminal\n  exit     - Close terminal'
        break
      case 'whoami':
        output = 'Gokul Senthilkumar\nSDET & Full-Stack Developer\nPassionate about Test Automation, CI/CD, and scalable web apps.'
        break
      case 'skills':
        output = 'Core competencies:\n- Testing: Selenium, Playwright, K6, Cypress, Appium\n- Frontend: React, Next.js, Tailwind, 3D WebGL\n- Backend: Node.js, PostgreSQL, MongoDB\n- DevOps: Docker, Git, Azure DevOps, CI/CD'
        break
      case 'projects':
        output = '1. QA Auto Framework - A comprehensive E2E automation solution.\n2. Cloud API Tester - A scalable microservices testing tool.\n3. Portfolio - This interactive 3D portfolio.'
        break
      case 'insights':
        output = (
          <div className="text-purple-400 font-mono">
            {`
┌────────────────────────────────────────┐
│           PORTFOLIO INSIGHTS           │
├────────────────────────────────────────┤
│  • Total Projects : 10+ Delivered      │
│  • Top Language   : TypeScript         │
│  • UI Framework   : Next.js + React    │
│  • Total Skills   : 25+ Evaluated      │
│  • Status         : Open for Work      │
│  • Easter Eggs    : Found 1 of 3       │
└────────────────────────────────────────┘
            `}
          </div>
        )
        break
      case 'github':
        output = (
          <div className="text-green-400 font-mono">
            Fetching GitHub data via API...\n
            <span className="text-white">User:</span> gokulsenthilkumar3\n
            <span className="text-white">Status:</span> 1,100+ contributions in the last year\n
            <span className="text-white">Top Langs:</span> TypeScript, JavaScript, Python
          </div>
        )
        break
      case 'contact':
        output = 'Email: gokulsenthilkumar3@gmail.com\nLinkedIn: linkedin.com/in/gokul-senthilkumar-5a8183201\nGitHub: github.com/gokulsenthilkumar3\nTwitter: @GokulKangeyanS'
        break
      case 'date':
        output = new Date().toString()
        break
      case 'clear':
        setHistory([])
        setInput('')
        return
      case 'exit':
        onClose()
        return
      case 'sudo':
        output = <span className="text-red-500">Access denied. This incident will be reported to the administrator.</span>
        break
      case 'rm -rf /':
      case 'sudo rm -rf /':
        output = <span className="text-red-500 animate-pulse">NICE TRY! System lock initiated... Just kidding.</span>
        break
      default:
        if (trimmed.startsWith('echo ')) {
          output = trimmed.substring(5)
        } else {
          output = `Command not found: ${trimmed}. Type 'help' to see available commands.`
        }
    }

    setHistory((prev) => [...prev, { command: cmd, output }])
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input)
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setHistory([])
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            drag
            dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
            dragElastic={0.1}
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
            className="fixed top-1/2 left-1/2 w-[calc(100%-2rem)] max-w-2xl bg-[#1e1e1e] rounded-xl shadow-2xl border border-white/10 z-50 overflow-hidden flex flex-col h-[60vh] max-h-[600px] cursor-move"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-white/5 select-none">
              <div className="flex items-center gap-2">
                <TerminalIcon size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-300 font-mono">guest@portfolio:~</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Terminal Body */}
            <div 
              className="flex-1 p-4 font-mono text-sm overflow-y-auto text-green-400/90"
              onClick={() => inputRef.current?.focus()}
            >
              <div className="mb-4 text-green-400/60">
                Welcome to Gokul's Portfolio Terminal.<br/>
                Type 'help' for a list of commands.
              </div>

              {history.map((item, i) => (
                <div key={i} className="mb-4">
                  <div className="flex items-center gap-2 text-blue-400">
                    <span>guest@portfolio:~$</span>
                    <span className="text-white">{item.command}</span>
                  </div>
                  <div className="mt-1 whitespace-pre-wrap">{item.output}</div>
                </div>
              ))}

              <div className="flex items-center gap-2 text-blue-400">
                <span>guest@portfolio:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none border-none text-white shadow-none focus:ring-0 p-0 m-0"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
              <div ref={bottomRef} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
