import PropTypes from 'prop-types'
import { useState, useCallback, useEffect } from 'react'
import { RefreshCw, Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import ConnectionStatus from './components/ConnectionStatus'
import SampleSelector from './components/SampleSelector'
import ParameterCard from './components/ParameterCard'
import LiveDataPanel from './components/LiveDataPanel'
import { useElectrochemistryWebSocket } from './hooks/useElectrochemistryWebSocket'
import { deviceService } from './services/deviceService'

const ElectrochemistryPage = ({ samples }) => {
  const [selectedSample, setSelectedSample] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeviceMeasuring, setIsDeviceMeasuring] = useState(false)
  const [isTogglingDevice, setIsTogglingDevice] = useState(false)

  const { connectionStatus, liveData, isConnecting, setInitialData } =
    useElectrochemistryWebSocket(selectedSample?.sampleId)

  // Sync the local physical button state with the actual device telemetry
  useEffect(() => {
    if (liveData?.LIVE_DATA?.DEVICE_STATUS) {
      setIsDeviceMeasuring(liveData.LIVE_DATA.DEVICE_STATUS === 'CONNECTED')
    }
  }, [liveData?.LIVE_DATA?.DEVICE_STATUS])

  const handleUpdateClick = async () => {
    if (isSaving) return
    setIsSaving(true)
    try {
      await deviceService.saveSnapshot()
      toast.success('Snapshot saved successfully!')
    } catch {
      toast.error('Failed to save snapshot')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSelectSample = useCallback(async (sample) => {
    setSelectedSample(sample)
    if (sample) {
      try {
        await deviceService.selectSample(sample.sampleId, sample.SAMPLE_NAME || '')
        // Fetch initial snapshot data immediately so UI isn't empty while waiting for WebSocket frame
        const initialData = await deviceService.getLiveData(sample.sampleId)
        setInitialData(initialData)
      } catch (err) {
        console.error('Failed to sync selected sample with hardware:', err)
        toast.error('Failed to sync sample with device')
      }
    }
  }, [setInitialData])

  const handleToggleDevice = async (newState) => {
    setIsTogglingDevice(true)
    try {
      await deviceService.setDeviceState(newState)
      setIsDeviceMeasuring(newState)
      toast.success(newState ? 'Device connected and streaming' : 'Device disconnected')
    } catch (err) {
      console.error('Toggle device error:', err)
      toast.error('Failed to change device state')
    } finally {
      setIsTogglingDevice(false)
    }
  }

  const listArray = Object.values(liveData?.LISTS || {})

  return (
    <div className="w-full space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-industrial-500">Home / Electrochemistry</p>
          <h1 className="mt-1.5 text-2xl font-black tracking-tight text-industrial-900 sm:text-3xl">Electrochemistry</h1>
        </div>
        <div className="sm:mt-2"><ConnectionStatus status={connectionStatus} /></div>
      </header>

      <SampleSelector samples={samples} selectedSample={selectedSample} onSelectSample={handleSelectSample} loading={false} />

      {/* No sample selected */}
      {!selectedSample && (
        <div className="rounded-lg border border-industrial-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-bold text-industrial-900">Select a sample to begin.</p>
        </div>
      )}

      {/* Sample selected but data is loading */}
      {selectedSample && !liveData && (
        <div className="rounded-lg border border-industrial-200 bg-white p-8 text-center shadow-sm">
          <Loader2 size={26} className="animate-spin mx-auto text-industrial-400" />
          <p className="mt-3 text-xs font-bold text-industrial-500">
            {isConnecting ? 'Establishing connection...' : 'Fetching initial data...'}
          </p>
        </div>
      )}

      {/* Connected with data */}
      {selectedSample && liveData && (
        <div className="flex flex-col gap-5 xl:flex-row xl:items-stretch">
          <div className="flex-1">
            {listArray.length === 0 ? (
              <div className="rounded-lg border border-industrial-200 bg-white p-12 text-center shadow-sm h-full flex items-center justify-center">
                <p className="text-sm font-bold text-industrial-900">No live parameters available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {listArray.map((item, index) => (
                  <ParameterCard key={index} parmName={item.PARM_NAME} parmValue={item.PARM_VALUE} tempValue={item.TEMP_VALUE} createDateTime={item.CREATE_DATE_TIME} status={item.STATUS} />
                ))}
              </div>
            )}
          </div>

          <div className="flex w-full flex-col gap-3 xl:w-80 shrink-0">
            <div className="flex-1">
              <LiveDataPanel 
                upperDis={liveData.LIVE_DATA?.UPPER_DIS} 
                lowerDis={liveData.LIVE_DATA?.LOWER_DIS} 
                deviceStatus={liveData.LIVE_DATA?.DEVICE_STATUS} 
                deviceLastSync={liveData.LIVE_DATA?.DEVICE_LAST_SYNC} 
                deviceName={liveData?.DEVICE}
                onToggleDevice={handleToggleDevice}
                isDeviceMeasuring={isDeviceMeasuring}
                isTogglingDevice={isTogglingDevice}
              />
            </div>

            <button
              type="button"
              onClick={handleUpdateClick}
              disabled={isSaving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-industrial-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-industrial-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? 'SAVING...' : 'SAVE & UPDATE'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

ElectrochemistryPage.propTypes = { samples: PropTypes.array.isRequired }
export default ElectrochemistryPage
