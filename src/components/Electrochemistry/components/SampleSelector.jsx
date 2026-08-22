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
    return String(s.SAMPLE_ID).toLowerCase().includes(q) || String(s.SAMPLE_NAME).toLowerCase().includes(q) || String(s.USER_NAME).toLowerCase().includes(q);
  });

  return (
    <section className="rounded-lg border border-industrial-200 bg-white shadow-sm flex flex-col">
      <div className="border-b border-industrial-100 px-4 py-2.5 flex justify-between items-center">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-industrial-500">Sample Select</h2>
        {config && <span className="text-[10px] font-bold uppercase tracking-wider text-industrial-400">Available: {config.SAMPLE_AVAILABLE_COUNT}</span>}
      </div>
      <div className="p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
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
        <div className="relative flex-1">
          <select
            value={selectedSample?.SAMPLE_ID || ''}
            onChange={(e) => {
              const sample = allSamples.find((s) => String(s.SAMPLE_ID) === String(e.target.value));
              onSelectSample(sample ? { sampleId: sample.SAMPLE_ID, ...sample } : null);
              setSearchTerm('');
            }}
            disabled={loading}
            size={searchTerm ? 5 : 1}
            className={`w-full appearance-none rounded-md border border-industrial-200 bg-white pl-3 text-sm font-semibold text-industrial-900 outline-none transition focus:border-industrial-900 focus:ring-1 focus:ring-industrial-900 disabled:opacity-50 ${searchTerm ? 'py-2 pr-3' : 'py-2 pr-10'}`}
          >
            {!searchTerm && <option value="">Select a sample...</option>}
            {samples.length > 0
              ? samples.map((s) => <option key={s.SAMPLE_ID} value={s.SAMPLE_ID}>{s.SAMPLE_ID} — {s.SAMPLE_NAME} ({s.USER_NAME})</option>)
              : <option value="" disabled>No samples found</option>}
          </select>
          {!searchTerm && <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-industrial-400" />}
        </div>
      </div>
    </section>
  );
};

SampleSelector.propTypes = {
  selectedSample: PropTypes.shape({ SAMPLE_ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) }),
  onSelectSample: PropTypes.func.isRequired,
};

export default SampleSelector;
