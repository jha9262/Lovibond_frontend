import PropTypes from 'prop-types';
import { ChevronDown, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { deviceService } from '../services/deviceService';

const SampleSelector = ({ selectedSample, onSelectSample }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const data = await deviceService.getSampleConfiguration();
        if (mounted) setConfig(data.SAMPLE_CONFIGURATION);
      } catch (err) {
        console.error('Failed to load sample configuration', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchConfig();
    return () => { mounted = false; };
  }, []);

  const allSamples = config?.SAMPLES ? Object.values(config.SAMPLES) : [];
  const samples = allSamples.filter((s) => {
    const q = searchTerm.toLowerCase();
    const sId = String(s.SAMPLE_ID || s.sampleId || '');
    const sName = String(s.SAMPLE_NAME || s.sampleName || '');
    const uName = String(s.USER_NAME || s.userName || '');
    return sId.toLowerCase().includes(q) || sName.toLowerCase().includes(q) || uName.toLowerCase().includes(q);
  });

  return (
    <section className="rounded-lg border border-industrial-200 bg-white shadow-sm flex flex-col">
      <div className="border-b border-industrial-100 px-4 py-2.5 flex justify-between items-center">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-industrial-500">Sample Select</h2>
        {config && <span className="text-[10px] font-bold uppercase tracking-wider text-industrial-400">Available: {config.SAMPLE_AVAILABLE_COUNT}</span>}
      </div>
      <div className="p-4 flex flex-col sm:flex-row gap-4 sm:items-start">
        <div className="relative w-full sm:w-1/4">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-industrial-400" />
          <input 
            type="text" 
            placeholder="Search samples..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            disabled={loading}
            className="w-full rounded-md border border-industrial-200 bg-industrial-50 py-2 pl-9 pr-3 text-sm font-semibold text-industrial-900 outline-none transition focus:border-industrial-900 focus:ring-1 focus:ring-industrial-900 disabled:opacity-50" 
          />
        </div>
        <div className="relative w-full sm:w-[40%]">
          <select
            value={selectedSample?.SAMPLE_ID || selectedSample?.sampleId || ''}
            onChange={(e) => {
              const val = String(e.target.value);
              const sample = allSamples.find((s) => String(s.SAMPLE_ID || s.sampleId) === val);
              const sId = sample?.SAMPLE_ID || sample?.sampleId || val;
              onSelectSample(sample ? { ...sample, sampleId: sId, SAMPLE_ID: sId } : null);
              setSearchTerm('');
            }}
            disabled={loading}
            size={searchTerm ? 5 : 1}
            className={`w-full appearance-none rounded-md border border-industrial-200 bg-white pl-3 text-sm font-semibold text-industrial-900 outline-none transition focus:border-industrial-900 focus:ring-1 focus:ring-industrial-900 disabled:opacity-50 ${searchTerm ? 'py-2 pr-3' : 'py-2 pr-10'}`}
          >
            {!searchTerm && <option value="">Select a sample...</option>}
            {samples.length > 0
              ? samples.map((s) => {
                  const idVal = s.SAMPLE_ID || s.sampleId;
                  return <option key={idVal} value={idVal}>{idVal}</option>;
                })
              : <option value="" disabled>No samples found</option>}
          </select>
          {!searchTerm && <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-industrial-400" />}
        </div>
        {selectedSample && (
          <div className="relative w-full sm:flex-1">
            <div className="w-full rounded-md border border-industrial-200 bg-industrial-50 px-3 py-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-[11px] font-bold uppercase tracking-wider text-industrial-500 whitespace-nowrap">USER ID:</span>
                <span className="text-sm font-bold text-industrial-900 truncate">
                  {selectedSample.USER_ID || selectedSample.USER_NAME || '—'}
                </span>
              </div>
              <div className="h-4 w-px bg-industrial-200 hidden sm:block shrink-0"></div>
              <div className="flex items-center gap-2 overflow-hidden text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-industrial-500 whitespace-nowrap">DATE:</span>
                <span className="text-sm font-bold text-industrial-900 truncate">
                  {selectedSample.SAMPLE_DATE_TIME || selectedSample.SAMPLE_DATE || selectedSample.CREATE_DATE_TIME || selectedSample.CREATE_DATE || '—'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

SampleSelector.propTypes = {
  selectedSample: PropTypes.shape({ SAMPLE_ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) }),
  onSelectSample: PropTypes.func.isRequired,
};

export default SampleSelector;
