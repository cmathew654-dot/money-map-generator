import { SAMPLE_WHITFIELD } from './model/samples'
import { MapSvg } from './render/MapSvg'

export default function App() {
  return (
    <main className="app-shell">
      <div className="map-page">
        <MapSvg data={SAMPLE_WHITFIELD} />
      </div>
    </main>
  )
}
