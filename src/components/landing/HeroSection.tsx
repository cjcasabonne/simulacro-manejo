import Link from 'next/link'
import { getWhatsAppLink } from '@/lib/utils'

export default function HeroSection() {
  return (
    <section className="relative hero-mesh hero-pattern overflow-hidden">
      {/* Orb decorativo derecha */}
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-32 w-[500px] h-[500px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)' }}
      />
      {/* Orb decorativo izquierda inferior */}
      <div
        aria-hidden="true"
        className="absolute -left-24 bottom-0 w-80 h-80 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">

        {/* Texto izquierda */}
        <div className="flex-1 text-white text-center md:text-left">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-white/10 border border-white/20 text-blue-100 animate-fade-in">
            Lima, Perú
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-up delay-100">
            Prepárate para tu examen de manejo{' '}
            <span className="text-blue-200">como nunca antes</span>
          </h1>

          <p className="text-blue-100 text-lg leading-relaxed mb-10 max-w-xl mx-auto md:mx-0 animate-fade-up delay-200">
            Te recogemos de tu casa, te llevamos a practicar en un circuito que simula
            el examen real de manejo de Lima, Perú, y te ayudamos a prepararte mejor.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-up delay-300">
            <Link href="/agendar" className="btn-primary text-center text-base">
              Agendar mi clase
            </Link>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-center text-base"
            >
              Consultar por WhatsApp
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start animate-fade-up delay-400">
            {['Recojo incluido', 'Sin experiencia previa', 'Circuito idéntico al oficial Lima'].map((badge) => (
              <span key={badge} className="flex items-center gap-1.5 text-sm text-blue-100">
                <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Elemento visual derecha */}
        <div className="flex-shrink-0 w-full md:w-80 lg:w-96 animate-fade-in delay-300">
          <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80">
            {/* Círculo exterior */}
            <div className="absolute inset-0 rounded-full border-2 border-white/15 animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-white/10 animate-[spin_15s_linear_infinite_reverse]" />

            {/* Centro */}
            <div className="absolute inset-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <div className="text-center text-white px-4">
                {/* Ícono de auto / volante SVG */}
                <svg className="w-20 h-20 mx-auto mb-2 opacity-90" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                  <path strokeLinecap="round" d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                  <path strokeLinecap="round" d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
                </svg>
                <p className="text-sm font-semibold tracking-wide">Circuito idéntico al oficial</p>
              </div>
            </div>

            {/* Pills flotantes */}
            <div className="absolute -top-3 right-0 bg-white rounded-xl px-3 py-1.5 shadow-lg text-xs font-semibold text-blue-700 whitespace-nowrap">
              ✓ Recojo en tu puerta
            </div>
            <div className="absolute -bottom-3 left-0 bg-white rounded-xl px-3 py-1.5 shadow-lg text-xs font-semibold text-blue-700 whitespace-nowrap">
              ✓ Simulacro real
            </div>
          </div>
        </div>
      </div>

      {/* Wave inferior */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 fill-white">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  )
}
