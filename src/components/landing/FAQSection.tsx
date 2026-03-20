'use client'

import { useState } from 'react'

const faqs = [
  {
    q: '¿Dónde se realiza la práctica?',
    a: 'En un circuito privado en Lima que simula el recorrido del examen oficial de manejo.',
  },
  {
    q: '¿Me recogen de mi casa?',
    a: 'Sí, el recojo está incluido. Coordinamos la dirección exacta por WhatsApp.',
  },
  {
    q: '¿Necesito experiencia previa para tomar una clase?',
    a: 'No. Atendemos tanto a principiantes como a quienes ya han tenido clases antes.',
  },
  {
    q: '¿Cómo separo mi horario?',
    a: 'Directamente desde esta página. Elige un horario disponible, completa tus datos y listo.',
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block mb-3 text-xs font-semibold tracking-widest uppercase text-blue-600">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-gray-50 transition-colors"
                aria-expanded={open === i}
              >
                <span className="font-semibold text-gray-800 text-base leading-snug">
                  {faq.q}
                </span>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${open === i ? 'bg-blue-700 text-white rotate-180' : 'bg-blue-50 text-blue-700'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {/* Accordion con CSS grid trick */}
              <div className={`faq-body ${open === i ? 'open' : ''}`}>
                <div className="faq-body-inner">
                  <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
