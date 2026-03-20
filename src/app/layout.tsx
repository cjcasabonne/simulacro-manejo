import type { Metadata } from 'next'
import { Sora, Plus_Jakarta_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const sora = Sora({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
})

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Simulacro de examen de manejo — Lima, Perú',
  description:
    'Practica el examen de manejo en un circuito real. Te recogemos de tu casa. Agenda tu clase ahora.',
  openGraph: {
    title: 'Simulacro de examen de manejo — Lima, Perú',
    description:
      'Practica el examen de manejo en un circuito real. Te recogemos de tu casa. Agenda tu clase ahora.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${sora.variable} ${jakarta.variable} h-full`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1d4ed8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Simulacro" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
