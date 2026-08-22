import { ClipboardList } from 'lucide-react'
import PropTypes from 'prop-types'

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

const DashboardOverview = ({ samples, totalCount, loading, error, onViewSamples }) => (
  <div className="w-full space-y-7">
    <header>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-industrial-500">Home</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-industrial-900 sm:text-4xl">Dashboard</h1>
      <p className="mt-2 text-sm text-industrial-500">System overview and sample activity.</p>
    </header>

    {loading ? (
      <div className="animate-pulse space-y-5"><div className="h-36 max-w-sm rounded-2xl bg-industrial-200" /><div className="h-64 rounded-2xl bg-industrial-200" /></div>
    ) : error ? (
      <section className="rounded-2xl border border-industrial-200 bg-white px-6 py-12 text-center shadow-industrial-sm">
        <p className="text-base font-black text-industrial-900">Sample information is unavailable</p>
        <button onClick={onViewSamples} className="mt-4 text-sm font-bold text-industrial-900 underline underline-offset-4">View samples</button>
      </section>
    ) : (
      <>
        <section className="grid max-w-sm gap-4">
          <div className="rounded-2xl border border-industrial-200 bg-white p-5 shadow-industrial-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-industrial-500">Total Samples</p>
                <p className="mt-3 text-3xl font-black text-industrial-900">{totalCount}</p>
                <p className="mt-2 text-xs text-industrial-500">Current configured samples</p>
              </div>
              <span className="rounded-xl bg-industrial-100 p-2.5 text-industrial-700"><ClipboardList size={20} /></span>
            </div>
          </div>
        </section>
        <section className="overflow-hidden rounded-2xl border border-industrial-200 bg-white shadow-industrial-sm">
          <div className="flex items-center justify-between border-b border-industrial-100 px-5 py-4 sm:px-6">
            <div><h2 className="font-black text-industrial-900">Recent Samples</h2><p className="mt-1 text-xs text-industrial-500">Latest configured samples</p></div>
            <button onClick={onViewSamples} className="text-sm font-bold text-industrial-700 underline-offset-4 hover:underline">View all</button>
          </div>
          {samples.length ? (
            <div className="divide-y divide-industrial-100">
              {samples.slice(0, 5).map((sample) => (
                <div key={sample.sampleId} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_180px_auto] sm:px-6">
                  <p className="text-sm font-bold text-industrial-900">{sample.sampleId}</p>
                  <p className="hidden text-sm text-industrial-600 sm:block">{sample.userName || '—'}</p>
                  <time className="text-xs text-industrial-500">{formatDate(sample.createdDate)}</time>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center">
              <p className="text-sm font-bold text-industrial-700">No samples available</p>
              <p className="mt-2 text-sm text-industrial-500">There are currently no samples configured.</p>
            </div>
          )}
        </section>
      </>
    )}
  </div>
)

const sampleShape = PropTypes.shape({ sampleId: PropTypes.string.isRequired, userName: PropTypes.string, createdDate: PropTypes.string })
DashboardOverview.propTypes = {
  samples: PropTypes.arrayOf(sampleShape).isRequired,
  totalCount: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  onViewSamples: PropTypes.func.isRequired,
}

export default DashboardOverview
