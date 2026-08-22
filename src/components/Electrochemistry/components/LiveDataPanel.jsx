import PropTypes from 'prop-types';
import { Loader2, Power } from 'lucide-react';

const formatTime = (ts) => {
  if (!ts) return '--';
  let d;
  if (!isNaN(Number(ts)) && String(ts).trim() !== '') {
    const n = Number(ts);
    d = new Date(n < 100000000000 ? n * 1000 : n);
  } else {
    d = new Date(ts);
  }
  return Number.isNaN(d.getTime()) ? ts : new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(d);
};

const LiveDataPanel = ({ upperDis, lowerDis, deviceStatus, deviceLastSync, deviceName, onToggleDevice, isDeviceMeasuring, isTogglingDevice }) => {
  const statusColor = deviceStatus === 'CONNECTED' ? 'bg-emerald-500' : deviceStatus === 'ERROR' ? 'bg-red-500' : 'bg-amber-500';
  
  return (
    <div className="flex h-full flex-col rounded-lg border border-industrial-200 bg-industrial-900 text-white shadow-sm overflow-hidden">
      <div className="border-b border-industrial-800 px-5 py-3 flex justify-between items-center">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-industrial-400">{deviceName || 'LIVE DATA'}</h2>
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${statusColor}`} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-industrial-300">{deviceStatus || 'UNKNOWN'}</span>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-5 justify-between">
        <div className="space-y-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-industrial-400 mb-1">UPPER DIS</p>
            <p className="text-3xl font-black tabular-nums tracking-tight text-white leading-none">{upperDis || '--'}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-industrial-400 mb-1">LOWER DIS</p>
            <p className="text-3xl font-black tabular-nums tracking-tight text-white leading-none">{lowerDis || '--'}</p>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col gap-4 border-t border-industrial-800 pt-4">
          <div className="flex justify-between items-center text-[10px] text-industrial-400">
            <span className="font-semibold uppercase tracking-wider">Last Sync</span>
            <span className="font-medium text-industrial-200">{formatTime(deviceLastSync)}</span>
          </div>

          <button
            type="button"
            onClick={() => onToggleDevice(!isDeviceMeasuring)}
            disabled={isTogglingDevice}
            className={`flex w-full items-center justify-center gap-2 rounded text-[11px] font-bold uppercase tracking-wider transition px-3 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDeviceMeasuring 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
            }`}
          >
            {isTogglingDevice ? <Loader2 size={13} className="animate-spin" /> : <Power size={13} />}
            {isTogglingDevice ? (isDeviceMeasuring ? 'Disconnecting...' : 'Connecting...') : (isDeviceMeasuring ? 'Disconnect Device' : 'Connect Device')}
          </button>
        </div>
      </div>
    </div>
  );
};

LiveDataPanel.propTypes = { upperDis: PropTypes.string, lowerDis: PropTypes.string, deviceStatus: PropTypes.string, deviceLastSync: PropTypes.string, deviceName: PropTypes.string, onToggleDevice: PropTypes.func.isRequired, isDeviceMeasuring: PropTypes.bool.isRequired, isTogglingDevice: PropTypes.bool.isRequired };
export default LiveDataPanel;
