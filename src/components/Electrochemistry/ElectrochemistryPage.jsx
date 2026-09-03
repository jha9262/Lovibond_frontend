import PropTypes from 'prop-types'
import { useState, useCallback, useEffect } from 'react'
import { RefreshCw, Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import SampleSelector from './components/SampleSelector'
import ParameterCard from './components/ParameterCard'
import LiveDataPanel from './components/LiveDataPanel'
import { useElectrochemistryWebSocket } from './hooks/useElectrochemistryWebSocket'
import { deviceService } from './services/deviceService'
import { deviceWebSocket } from './services/deviceWebSocket'

const getErrorMessage = (err, fallback) => {
  const data = err?.response?.data;
  let backendError = '';

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      backendError = parsed.MESSAGE || parsed.message;
    } catch {
      backendError = data;
    }
  } else if (data && typeof data === 'object') {
    backendError = data.MESSAGE || data.message;
  }

  return typeof backendError === 'string' && backendError.trim() ? backendError : fallback;
};

const ElectrochemistryPage = ({ samples }) => {
  const [selectedSample, setSelectedSample] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeviceMeasuring, setIsDeviceMeasuring] = useState(false)
  const [isTogglingDevice, setIsTogglingDevice] = useState(false)

  const { connectionStatus, liveData, isConnecting, setInitialData } =
    useElectrochemistryWebSocket(selectedSample?.sampleId)

  useEffect(() => {
    const moduleData = liveData?.['1'] || liveData?.['2'] || liveData?.PROCESS_MODULE || liveData;
    const liveDataObj = moduleData?.LIVE_DATA || {};
    if (liveDataObj?.DEVICE_STATUS) {
      setIsDeviceMeasuring(liveDataObj.DEVICE_STATUS === 'CONNECTED')
    }
  }, [liveData])

  const handleUpdateClick = async () => {
    if (isSaving) return
    if (!selectedSample) {
      toast.error('No sample selected')
      return
    }

    const moduleData = liveData?.['1'] || liveData?.['2'] || liveData?.PROCESS_MODULE || liveData;
    const liveDataObj = moduleData?.LIVE_DATA || {};
    const activeTest = liveDataObj?.ACTIVE_TEST;
    if (!activeTest) {
      toast.error('No active test detected from device')
      return
    }

    // Format the test name for the ESP32 (e.g. "PH TEST" -> "PH", "CONDUCTIVITY TE" -> "CONDUCTIVITY")
    let formattedTest = activeTest.replace(/\s+TEST$/i, '').trim();
    if (formattedTest.toUpperCase() === 'CONDUCTIVITY TE') formattedTest = 'CONDUCTIVITY';

    console.log('debuging');
    console.log("entire sample obejct ", selectedSample)
    console.log("sample id ", selectedSample.sampleId)


    setIsSaving(true)
    try {

      const res = await deviceService.saveSnapshot(selectedSample.sampleId, formattedTest)
      if ((res?.STATUS_CODE && res.STATUS_CODE >= 400) || res?.success === false) {
        throw { response: { data: res } }
      }
      const successMsg = res?.MESSAGE || res?.message || 'Snapshot saved successfully!'
      toast.success(successMsg)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to save snapshot'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleSelectSample = useCallback(async (sample) => {
    // Always disconnect the device first so user always starts fresh
    await deviceWebSocket.disconnect()
    setSelectedSample(sample)
    setIsDeviceMeasuring(false)
    if (sample) {
      const targetId = sample.sampleId || sample.SAMPLE_ID || sample.sample_id || sample.ID || sample.id || (typeof sample === 'string' ? sample : '');
      if (targetId) {
        try {
          await deviceService.selectSample(targetId, sample.SAMPLE_NAME || sample.sampleName || targetId)
        } catch (err) {
          console.error('Failed to sync selected sample with hardware:', err)
          toast.error(getErrorMessage(err, 'Failed to sync sample with device'))
        }

        try {
          const initialData = await deviceService.getLiveData(targetId)
          setInitialData(initialData)
        } catch (err) {
          console.error('Failed to fetch initial data from backend:', err)
        }
      }
    }
  }, [setInitialData])

  const handleToggleDevice = async (newState) => {
    setIsTogglingDevice(true)
    try {
      const res = await deviceService.setDeviceState(newState)
      if ((res?.STATUS_CODE && res.STATUS_CODE >= 400) || res?.success === false) {
        throw { response: { data: res } }
      }
      if (newState) {
        // Open WebSocket to receive live data
        await deviceWebSocket.connect(selectedSample?.sampleId)
      } else {
        // Close WebSocket
        await deviceWebSocket.disconnect()
      }
      setIsDeviceMeasuring(newState)
      const successMsg = res?.MESSAGE || res?.message || (newState ? 'Device connected and streaming' : 'Device disconnected')
      toast.success(successMsg)
    } catch (err) {
      console.error('Toggle device error:', err)
      toast.error(getErrorMessage(err, 'Failed to change device state'))
    } finally {
      setIsTogglingDevice(false)
    }
  }

  const moduleData = liveData?.['1'] || liveData?.['2'] || liveData?.PROCESS_MODULE || liveData;
  const liveDataObj = moduleData?.LIVE_DATA || {};
  const listsObj = moduleData?.LISTS || {};
  const listArray = Object.values(listsObj);

  return (
    <div className="w-full space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-industrial-500">Home / Electrochemistry</p>
          <h1 className="mt-1.5 text-2xl font-black tracking-tight text-industrial-900 sm:text-3xl uppercase">Electrochemistry</h1>
        </div>
        {liveData && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:mt-2">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-industrial-400">UPTIME</span>
              <span className="text-sm font-black text-industrial-900">{liveData.DCN_UPTIME || '--'}</span>
            </div>
            <div className="hidden sm:block h-8 w-px bg-industrial-200"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-industrial-400">ZONE</span>
              <span className="text-sm font-black text-industrial-900">{liveData.ZONE_NAME || '--'}</span>
            </div>
            <div className="hidden sm:block h-8 w-px bg-industrial-200"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-industrial-400">WIFI STRENGTH</span>
              <span className="text-sm font-black text-industrial-900">{liveData.WIFI_STRENGTH || '--'}</span>
            </div>
          </div>
        )}
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
                activeTest={liveDataObj?.ACTIVE_TEST}
                upperDis={liveDataObj?.UPPER_DIS}
                lowerDis={liveDataObj?.LOWER_DIS}
                deviceStatus={liveDataObj?.DEVICE_STATUS}
                deviceLastSync={liveDataObj?.DEVICE_LAST_SYNC}
                deviceName={liveData?.SELECTED_DEVICE || liveData?.DEVICE}
                onToggleDevice={handleToggleDevice}
                isDeviceMeasuring={isDeviceMeasuring}
                isTogglingDevice={isTogglingDevice}
              />
            </div>

            <button
              type="button"
              onClick={handleUpdateClick}
              disabled={isSaving || !isDeviceMeasuring}
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
