'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error'
  message: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [formStatus, setFormStatus] = useState<FormStatus>({
    type: 'idle',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setFormStatus({ type: 'error', message: 'Please enter your name' })
      return false
    }
    if (!formData.email.trim()) {
      setFormStatus({ type: 'error', message: 'Please enter your email' })
      return false
    }
    if (!formData.subject.trim()) {
      setFormStatus({ type: 'error', message: 'Please enter a subject' })
      return false
    }
    if (!formData.message.trim()) {
      setFormStatus({ type: 'error', message: 'Please enter your message' })
      return false
    }
    if (!formData.email.includes('@')) {
      setFormStatus({ type: 'error', message: 'Please enter a valid email address' })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setFormStatus({ type: 'loading', message: 'Sending message...' })

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate success (in real app, this would be an actual API call)
      setFormStatus({ 
        type: 'success', 
        message: 'Message sent successfully! I\'ll get back to you soon.' 
      })
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      setFormStatus({ 
        type: 'error', 
        message: 'Failed to send message. Please try again later.' 
      })
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setFormStatus({ type: 'idle', message: '' })
    }, 5000)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Get In Touch
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                placeholder="John Doe"
                disabled={formStatus.type === 'loading'}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                placeholder="john@example.com"
                disabled={formStatus.type === 'loading'}
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              placeholder="Project Inquiry"
              disabled={formStatus.type === 'loading'}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
              placeholder="Tell me about your project..."
              disabled={formStatus.type === 'loading'}
            />
          </div>

          {/* Status Messages */}
          <AnimatePresence>
            {formStatus.type !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-3 rounded-md flex items-center gap-2 ${
                  formStatus.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : formStatus.type === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}
              >
                {formStatus.type === 'success' && <CheckCircle className="h-4 w-4" />}
                {formStatus.type === 'error' && <AlertCircle className="h-4 w-4" />}
                {formStatus.type === 'loading' && <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />}
                <span className="text-sm">{formStatus.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <Button 
            type="submit" 
            className="w-full"
            disabled={formStatus.type === 'loading'}
          >
            {formStatus.type === 'loading' ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
