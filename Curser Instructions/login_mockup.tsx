'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronRight, Phone } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempted with phone number:', phoneNumber)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Network Background Pattern */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(209 213 219) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Logo */}
      <div className="w-full p-6 z-10">
        <div className="flex items-center text-3xl md:text-4xl font-bold">
          <span>ClancySafe</span>
          <span className="flex items-center">
            <span className="text-black">A</span>
            <span className="text-red-600">I</span>
            <div className="ml-2 bg-red-600 text-white w-8 h-8 flex items-center justify-center">
              C
            </div>
          </span>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Log in to your account</h2>
              <p className="text-sm text-gray-600">Enter your phone number to continue</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="phone-number" className="text-sm font-medium text-gray-900">
                  Phone Number
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="phone-number"
                    name="phone"
                    type="tel"
                    required
                    className="pl-10 block w-full bg-white border-gray-200 text-gray-900 focus:ring-red-500 focus:border-red-500"
                    placeholder="+1 (555) 000-0000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Sign In
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to ClancySafeAI?</span>
                </div>
              </div>
              <div className="text-center space-y-2">
                <Link href="/signup" className="text-sm font-medium text-red-600 hover:text-red-500">
                  Get a free account. Sign up now
                </Link>
                <div>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-500">
                    Need help?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}