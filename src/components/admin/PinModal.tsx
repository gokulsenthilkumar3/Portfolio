'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, X, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { useAdmin } from './AdminProvider'

interface PinModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function PinModal({ onClose, onSuccess }: PinModalProps) {
  const { activate, verifyPin } = useAdmin()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleVerify = useCallback(async (pinToVerify: string) => {
    if (pinToVerify.length < 4) return
    setLoading(true)
    setError('')

    try {
      const isValid = await verifyPin(pinToVerify)

      if (isValid) {
        setSuccess(true)
        activate()
        setTimeout(() => {
          onSuccess()
        }, 800)
      } else {
        setPin('')
        setError('Incorrect PIN. Try again.')
        setShake(true)
        setTimeout(() => setShake(false), 600)
      }
    } catch (err) {
      console.error('PIN Verification Error:', err)
      setError('Verification failed. Try again.')
    } finally {
      setLoading(false)
    }
  }, [activate, verifyPin, onSuccess])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleVerify(pin)
    if (e.key === 'Escape') onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-3xl bg-black/75"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={shake 
            ? { x: [-10, 10, -8, 8, -4, 4, 0], scale: 1, opacity: 1, y: 0 } 
            : { scale: 1, opacity: 1, y: 0 }
          }
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ 
            type: 'spring', 
            damping: 25, 
            stiffness: 300,
            x: { type: 'tween', duration: 0.5 }
          }}
          className="relative w-80 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0a0f1e]/98 to-[#141e32]/98 border border-indigo-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_80px_rgba(99,102,241,0.1)]"
        >
          {/* Gradient header bar */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          {/* Close button */}
          <button
            onClick={onClose}
            title="Close"
            aria-label="Close"
            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-colors z-10"
          >
            <X size={14} />
          </button>

          <div className="p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={success ? { scale: [1, 1.2, 1], rotate: [0, 0, 360] } : {}}
                transition={{ duration: 0.6 }}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                  success 
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/40' 
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/40'
                }`}
              >
                {success ? (
                  <CheckCircle2 size={26} className="text-white" />
                ) : (
                  <Lock size={24} className="text-white" />
                )}
              </motion.div>
            </div>

            {/* Subtitle */}
            <p className="text-center text-sm text-gray-400 mb-6">
              {success ? '✨ Access granted. Welcome back.' : 'Enter your access code to continue'}
            </p>

            {/* PIN progress dots */}
            <div className="flex justify-center gap-2.5 mb-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={pin[i] ? { scale: [0.7, 1.3, 1] } : {scale: 1}}
                  transition={{ duration: 0.15 }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                    pin[i]
                      ? success ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>

            {/* Input */}
            <div className="relative mb-4">
              <label htmlFor="pin-input" className="sr-only">Enter PIN</label>
              <input
                id="pin-input"
                ref={inputRef}
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                  setPin(val)
                  setError('')
                  // Automatically verify when 6 digits are reached
                  if (val.length === 6 && !loading && !success) {
                    handleVerify(val)
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Enter PIN"
                className={`w-full text-center text-2xl tracking-[0.5em] py-3.5 px-4 rounded-xl text-white placeholder-gray-700 bg-white/5 border focus:outline-none transition-all ${
                  error ? 'border-red-500/50' : 'border-white/10'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                title={showPin ? "Hide PIN" : "Show PIN"}
                aria-label={showPin ? "Hide PIN" : "Show PIN"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                tabIndex={-1}
              >
                {showPin ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-1.5 text-red-400 text-xs mb-4"
                >
                  <AlertCircle size={12} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleVerify(pin)}
              disabled={pin.length < 4 || loading || success}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed text-white bg-gradient-to-br from-blue-500 to-indigo-600 ${
                pin.length >= 4 ? 'shadow-lg shadow-blue-500/30' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Verifying...
                </span>
              ) : success ? 'Redirecting...' : 'Continue →'}
            </motion.button>

            <p className="text-center text-[10px] text-gray-700 mt-4">
              Press Escape to cancel
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
