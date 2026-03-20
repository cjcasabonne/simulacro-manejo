'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'navbar-blur border-b border-gray-100 shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className={`font-extrabold text-lg tracking-tight transition-colors duration-300 ${
            scrolled ? 'text-blue-700' : 'text-white'
          }`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Simulacro de Manejo
        </Link>

        <Link
          href="/agendar"
          className={`text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 ${
            scrolled
              ? 'bg-blue-700 text-white hover:bg-blue-800 shadow-sm shadow-blue-200'
              : 'bg-white/15 text-white border border-white/30 hover:bg-white/25'
          }`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Agendar
        </Link>
      </div>
    </header>
  )
}
