const steps = [
  {
    label: 'Elige tu horario',
    description: 'Elige un horario disponible en nuestro calendario en línea.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Completa tus datos',
    description: 'Rellena el formulario de reserva con tus datos y dirección de recojo.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: 'Coordinamos contigo',
    description: 'Te contactamos por WhatsApp para confirmar los detalles de tu clase.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    label: '¡A practicar!',
    description: 'Te recogemos y realizas tu práctica en un circuito idéntico al oficial.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
]

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block mb-3 text-xs font-semibold tracking-widest uppercase text-blue-600">
            Proceso simple
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            ¿Cómo funciona?
          </h2>
        </div>

        {/* Desktop: horizontal con conectores */}
        <div className="hidden md:flex items-start gap-0">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-start flex-1">
              <div className="flex flex-col items-center text-center flex-1 px-4">
                {/* Número + ícono */}
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-200">
                    {step.icon}
                  </div>
                  <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-white border-2 border-blue-200 text-blue-700 text-xs font-extrabold flex items-center justify-center shadow-sm">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-base">{step.label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>

              {/* Conector (no en el último) */}
              {i < steps.length - 1 && (
                <div className="steps-connector mt-8 mx-0" style={{ minWidth: 20 }}>
                  <svg viewBox="0 0 40 8" className="w-full h-2" preserveAspectRatio="none">
                    <path d="M0,4 Q20,0 40,4" stroke="#bfdbfe" strokeWidth="2" fill="none" strokeDasharray="4 3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: vertical */}
        <ol className="flex flex-col gap-6 md:hidden">
          {steps.map((step, i) => (
            <li key={step.label} className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-100">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border-2 border-blue-200 text-blue-700 text-xs font-extrabold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-gray-900 mb-1">{step.label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
