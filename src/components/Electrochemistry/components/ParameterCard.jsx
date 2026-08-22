import PropTypes from 'prop-types';
import { Clock } from 'lucide-react';

const STATUS_STYLES = {
  NORMAL: { dot: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-industrial-200' },
  LOW: { dot: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-200' },
  HIGH: { dot: 'bg-red-500', text: 'text-red-700', border: 'border-red-200' },
};

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

const ParameterCard = ({ parmName, parmValue, tempValue, createDateTime, status }) => {
  const isExplicitlyEmpty = status === '';
  const displayStatus = isExplicitlyEmpty ? '' : (status || 'NORMAL');
  const cfg = STATUS_STYLES[displayStatus] || STATUS_STYLES.NORMAL;

  return (
    <div className={`relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all ${cfg.border} h-full`}>
      <div className="border-b border-industrial-100 px-4 py-2.5">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-industrial-500">{parmName}</h3>
      </div>
      <div className="flex flex-1 flex-col p-4 justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tabular-nums tracking-tight text-industrial-900 leading-none">
              {parmValue !== undefined && parmValue !== null && parmValue !== '' ? parmValue : '--'}
            </span>
            {tempValue !== undefined && tempValue !== null && tempValue !== '' && (
              <span className="text-sm font-bold text-industrial-400">
                {typeof tempValue === 'string' ? tempValue.replace(' C', ' °C') : tempValue}
              </span>
            )}
          </div>
          <div className="mt-3 flex min-h-[16px] items-center gap-1.5">
            {!isExplicitlyEmpty && (
              <>
                <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                <span className={`text-[10px] uppercase font-bold tracking-wider ${cfg.text}`}>{displayStatus}</span>
              </>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1.5 border-t border-industrial-50 pt-3">
          <Clock size={11} className="text-industrial-400" />
          <p className="text-[10px] font-medium text-industrial-400">{formatTime(createDateTime)}</p>
        </div>
      </div>
    </div>
  );
};

ParameterCard.propTypes = { parmName: PropTypes.string.isRequired, parmValue: PropTypes.string, createDateTime: PropTypes.string, status: PropTypes.string };
export default ParameterCard;
