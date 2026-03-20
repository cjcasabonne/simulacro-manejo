'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'

// Leaflet se importa dinámicamente para evitar errores SSR
let L: typeof import('leaflet') | null = null

interface NominatimResult {
  display_name: string
  lat: string
  lon: string
}

interface MapPickerClientProps {
  onAddressSelect: (data: { address: string; lat: number; lng: number }) => void
  initialAddress?: string
}

export default function MapPickerClient({ onAddressSelect, initialAddress = '' }: MapPickerClientProps) {
  const [query, setQuery] = useState(initialAddress)
  const [results, setResults] = useState<NominatimResult[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState('')
  const [mapReady, setMapReady] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<import('leaflet').Map | null>(null)
  const marker = useRef<import('leaflet').Marker | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Inicializar Leaflet
  useEffect(() => {
    import('leaflet').then((leaflet) => {
      L = leaflet.default
      // Fix de íconos de Leaflet con webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })
    })
  }, [])

  // Inicializar mapa cuando selectedAddress cambia
  useEffect(() => {
    if (!mapReady || !mapRef.current || !L) return
    if (leafletMap.current) return // ya inicializado

    leafletMap.current = L.map(mapRef.current, { zoomControl: true })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(leafletMap.current)
  }, [mapReady])

  const setMarker = useCallback((lat: number, lng: number, address: string) => {
    if (!L || !leafletMap.current) return
    if (marker.current) {
      marker.current.setLatLng([lat, lng])
    } else {
      marker.current = L.marker([lat, lng], { draggable: true }).addTo(leafletMap.current)
      marker.current.on('dragend', () => {
        const pos = marker.current!.getLatLng()
        onAddressSelect({ address, lat: pos.lat, lng: pos.lng })
      })
    }
    leafletMap.current.setView([lat, lng], 15)
    onAddressSelect({ address, lat, lng })
  }, [onAddressSelect])

  // Buscar en Nominatim con debounce
  const search = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.length < 4) { setResults([]); setShowDropdown(false); return }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&countrycodes=pe&format=json&limit=5&addressdetails=1`,
          { headers: { 'User-Agent': 'simulacro-manejo-app' } }
        )
        const data: NominatimResult[] = await res.json()
        setResults(data)
        setShowDropdown(data.length > 0)
      } catch {
        setResults([])
      }
    }, 400)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    search(value)
  }

  const handleSelect = (result: NominatimResult) => {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)
    setQuery(result.display_name)
    setSelectedAddress(result.display_name)
    setShowDropdown(false)
    setResults([])
    setMapReady(true)
    // Dar tiempo al DOM para montar el div del mapa
    setTimeout(() => setMarker(lat, lng, result.display_name), 100)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Input con dropdown */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          placeholder="Busca tu dirección en Lima..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {showDropdown && results.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto">
            {results.map((r, i) => (
              <li key={i}>
                <button
                  type="button"
                  onMouseDown={() => handleSelect(r)}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                >
                  {r.display_name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mapa Leaflet */}
      {mapReady && (
        <div
          ref={mapRef}
          style={{ height: 200, borderRadius: 12, overflow: 'hidden', zIndex: 0 }}
        />
      )}

      {selectedAddress && (
        <p className="text-xs text-gray-500 leading-relaxed">
          📍 {selectedAddress}
        </p>
      )}
    </div>
  )
}
