import { useDeviceWebSocket } from '../../hooks/useDeviceWebSocket'
import ParameterCard from './ParameterCard'

const LiveDataPanel = () => {
  const { data, connected } = useDeviceWebSocket()
  return (
    <section className="overflow-hidden rounded-xl border border-industrial-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-industrial-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h2 className="text-2xl font-black text-industrial-900">Current Readings</h2>
          <p className="mt-1 text-xs text-industrial-500">Live data from the Lovibond device</p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-industrial-500">
            {connected ? 'Connected' : 'Waiting...'}
          </span>
        </div>
      </div>
      
      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
        <ParameterCard label="Color" value={data?.color} unit="EBC" />
        <ParameterCard label="Turbidity" value={data?.turbidity} unit="NTU" />
      </div>
    </section>
  )
}

export default LiveDataPanel
