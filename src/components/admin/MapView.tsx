'use client'

import { useEffect, useRef } from 'react'

interface MapViewProps {
  lat: number
  lng: number
}

export default function MapView({ lat, lng }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css')

      const map = L.map(mapRef.current!, { zoomControl: true, scrollWheelZoom: false }).setView([lat, lng], 16)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })

      L.marker([lat, lng], { icon }).addTo(map)
      mapInstanceRef.current = map
    })

    return () => {
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mapInstanceRef.current as any).remove()
        mapInstanceRef.current = null
      }
    }
  }, [lat, lng])

  return <div ref={mapRef} className="h-40 w-full rounded-xl z-0" />
}
