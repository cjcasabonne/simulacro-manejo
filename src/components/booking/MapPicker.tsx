import dynamic from 'next/dynamic'

interface MapPickerProps {
  onAddressSelect: (data: { address: string; lat: number; lng: number }) => void
  initialAddress?: string
}

const MapPickerClient = dynamic(() => import('./MapPickerClient'), {
  ssr: false,
  loading: () => (
    <div className="h-12 rounded-xl bg-gray-100 animate-pulse flex items-center px-4">
      <span className="text-sm text-gray-400">Cargando mapa...</span>
    </div>
  ),
})

export default function MapPicker(props: MapPickerProps) {
  return <MapPickerClient {...props} />
}
