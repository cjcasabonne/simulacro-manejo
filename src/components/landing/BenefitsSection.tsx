const benefits = [
  {
    title: 'Simulación realista',
    description: 'Practicamos en un circuito idéntico al del examen oficial de manejo en Lima.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    title: 'Recojo incluido',
    description: 'Te buscamos desde tu puerta, sin que te muevas. Solo dinos tu dirección.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Horarios flexibles',
    description: 'Elige el día y hora que mejor te acomode desde nuestro calendario en línea.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Atención directa',
    description: 'Coordinamos todo por WhatsApp. Sin formularios complicados ni esperas largas.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
]

export default function BenefitsSection() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block mb-3 text-xs font-semibold tracking-widest uppercase text-blue-600">
            Nuestras ventajas
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            ¿Por qué elegirnos?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className="card-hover relative flex flex-col p-7 rounded-2xl border border-gray-100 bg-white shadow-sm"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Número decorativo */}
              <span className="absolute top-5 right-5 text-4xl font-extrabold text-gray-50 select-none leading-none">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Ícono */}
              <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5 flex-shrink-0">
                {b.icon}
              </div>

              <h3 className="font-bold text-gray-900 text-lg mb-2">{b.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
