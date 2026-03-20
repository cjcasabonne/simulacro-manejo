import { getWhatsAppLink } from '@/lib/utils'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-gray-900 text-gray-400 pt-14 pb-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

        {/* Marca */}
        <div className="text-center md:text-left">
          <p
            className="text-white font-extrabold text-xl mb-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Simulacro de Manejo
          </p>
          <p className="text-sm text-gray-400">Lima, Perú</p>
        </div>

        {/* WhatsApp */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-gray-400">¿Tienes alguna duda?</p>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-green-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.857L.057 23.571a.5.5 0 0 0 .614.614l5.757-1.481A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.504-5.234-1.384l-.376-.216-3.892 1.001 1.018-3.788-.232-.389A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Escribir por WhatsApp
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-600">
          © {year} Simulacro de Manejo. Todos los derechos reservados.
          {' · '}
          <a href="/admin/login" className="text-gray-700 hover:text-gray-500 transition-colors">Admin</a>
        </p>
      </div>
    </footer>
  )
}
