import LiveDataPanel from '../components/domain/LiveDataPanel'

const LiveView = () => (
  <div className="w-full space-y-6">
    <header>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-industrial-500">Home / Live</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-industrial-900 sm:text-4xl">Live Telemetry</h1>
      <p className="mt-2 text-sm text-industrial-500">Real-time water quality monitoring</p>
    </header>

    <LiveDataPanel />
  </div>
)

export default LiveView
