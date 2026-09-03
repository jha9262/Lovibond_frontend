import { useEffect, useState, useMemo } from 'react'
import { ClipboardList, Clock, FlaskConical, Gauge, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react'
import PropTypes from 'prop-types'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const parseCustomDate = (val) => {
  if (!val) return null
  if (val instanceof Date) return val
  const str = String(val).trim()
  const formatted = str.replace(/\//g, '-').replace(/^(\d{4}-\d{2}-\d{2})-(.*)$/, '$1T$2')
  const d = new Date(formatted)
  if (!isNaN(d.getTime())) return d
  const fallback = new Date(str)
  return !isNaN(fallback.getTime()) ? fallback : null
}

const formatDate = (value) => {
  if (!value) return '—'
  const date = parseCustomDate(value)
  if (date) {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
  }
  return String(value)
}

const DashboardOverview = ({ samples, totalCount, loading, error, onViewSamples, onRetry }) => {
  const [stats, setStats] = useState({ electrochemistry: 0, photometer: 0 })
  const [statsLoading, setStatsLoading] = useState(false)
  const [statsError, setStatsError] = useState(false)

  // ACTIVE SAMPLES: Count of samples created within the last 24 hours
  const activeSamplesCount = useMemo(() => {
    if (!Array.isArray(samples) || samples.length === 0) return 0
    const now = Date.now()
    const twentyFourHoursMs = 24 * 60 * 60 * 1000
    return samples.filter((s) => {
      const rawDate = s.createdDate || s.SAMPLE_DATE_TIME || s.CREATE_DATE_TIME
      if (!rawDate) return false
      const d = parseCustomDate(rawDate)
      return d && now - d.getTime() <= twentyFourHoursMs
    }).length
  }, [samples])

  const fetchModuleStats = async () => {
    setStatsLoading(true)
    setStatsError(false)
    try {
      const [elRes, phRes] = await Promise.allSettled([
        axios.get(`${API_URL}/LIVE_DATA`, { params: { MODULE: 1, _t: Date.now() }, timeout: 5000 }),
        axios.get(`${API_URL}/LIVE_DATA`, { params: { MODULE: 2, _t: Date.now() }, timeout: 5000 })
      ])

      let elCompleted = 0
      let phCompleted = 0

      if (elRes.status === 'fulfilled' && elRes.value?.data) {
        const d = elRes.value.data
        const lists = d['1']?.LISTS || d.PROCESS_MODULE?.LISTS || d.LISTS || {}
        Object.values(lists).forEach((item) => {
          if (item?.STATUS === 'SAVED' || item?.STATUS === 'OK') elCompleted++
        })
      }

      if (phRes.status === 'fulfilled' && phRes.value?.data) {
        const d = phRes.value.data
        const lists = d['2']?.LISTS || d.PROCESS_MODULE?.LISTS || d.LISTS || {}
        Object.values(lists).forEach((item) => {
          if (item?.STATUS === 'SAVED' || item?.STATUS === 'OK') phCompleted++
        })
      }

      setStats({ electrochemistry: elCompleted, photometer: phCompleted })
    } catch (err) {
      console.error('Failed to load dashboard module stats:', err)
      setStatsError(true)
    } finally {
      setStatsLoading(false)
    }
  }

  useEffect(() => {
    fetchModuleStats()
  }, [samples])

  const handleRetryAll = () => {
    if (onRetry) onRetry()
    fetchModuleStats()
  }

  const isOverallLoading = loading || statsLoading
  const isOverallError = error || statsError

  return (
    <div className="w-full space-y-6">
      <header>
        <h1 className="text-2xl font-black tracking-tight text-industrial-900 sm:text-3xl uppercase">Dashboard</h1>
        <p className="mt-1 text-sm font-medium text-industrial-500">System overview and sample activity.</p>
      </header>

      {isOverallLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex h-36 flex-col justify-between rounded-2xl border border-industrial-200 bg-white p-5 shadow-xs animate-pulse">
                <div className="flex items-start justify-between">
                  <div className="h-4 w-28 rounded bg-industrial-200" />
                  <div className="h-10 w-10 rounded-xl bg-industrial-200" />
                </div>
                <div className="h-9 w-16 rounded bg-industrial-200" />
              </div>
            ))}
          </div>
          <div className="h-64 rounded-2xl bg-industrial-200 animate-pulse" />
        </div>
      ) : isOverallError ? (
        <section className="rounded-2xl border border-industrial-200 bg-white px-6 py-12 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 mb-4 ring-8 ring-red-50/50">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-base font-black text-industrial-900">Unable to load dashboard data</h2>
          <p className="mt-1 text-sm text-industrial-500">The dashboard data could not be retrieved from the server.</p>
          <button
            onClick={handleRetryAll}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-brand-700 active:scale-95"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </section>
      ) : (
        <>
          {/* 1. TOP KPI SECTION - 4 cards in 1 row on desktop */}
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* CARD 1: TOTAL SAMPLES */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-industrial-200/90 bg-white p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:border-brand-300 hover:-translate-y-0.5">
              <div className="absolute top-0 inset-x-0 h-1 bg-brand-500" />
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-industrial-500">TOTAL SAMPLES</span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-200/60 transition-transform duration-300 group-hover:scale-105">
                  <ClipboardList size={20} />
                </span>
              </div>
              <div className="mt-5">
                <span className="text-3xl font-black tracking-tight text-industrial-900 sm:text-4xl">{totalCount}</span>
              </div>
            </div>

            {/* CARD 2: ACTIVE SAMPLES */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-industrial-200/90 bg-white p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:border-emerald-300 hover:-translate-y-0.5">
              <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-industrial-500">ACTIVE SAMPLES</span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/60 transition-transform duration-300 group-hover:scale-105">
                  <Clock size={20} />
                </span>
              </div>
              <div className="mt-5">
                <span className="text-3xl font-black tracking-tight text-industrial-900 sm:text-4xl">{activeSamplesCount}</span>
              </div>
            </div>

            {/* CARD 3: ELECTROCHEMISTRY */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-industrial-200/90 bg-white p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:border-indigo-300 hover:-translate-y-0.5">
              <div className="absolute top-0 inset-x-0 h-1 bg-indigo-500" />
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-industrial-500">ELECTROCHEMISTRY</span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200/60 transition-transform duration-300 group-hover:scale-105">
                  <FlaskConical size={20} />
                </span>
              </div>
              <div className="mt-5">
                <span className="text-3xl font-black tracking-tight text-industrial-900 sm:text-4xl">{stats.electrochemistry}</span>
              </div>
            </div>

            {/* CARD 4: PHOTOMETER */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-industrial-200/90 bg-white p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:border-amber-300 hover:-translate-y-0.5">
              <div className="absolute top-0 inset-x-0 h-1 bg-amber-500" />
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-industrial-500">PHOTOMETER</span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-200/60 transition-transform duration-300 group-hover:scale-105">
                  <Gauge size={20} />
                </span>
              </div>
              <div className="mt-5">
                <span className="text-3xl font-black tracking-tight text-industrial-900 sm:text-4xl">{stats.photometer}</span>
              </div>
            </div>
          </section>

          {/* 9. RECENT SAMPLES SECTION */}
          <section className="overflow-hidden rounded-2xl border border-industrial-200 bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-industrial-100 bg-white px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-industrial-900">Recent Samples</h2>
                <span className="inline-flex items-center rounded-full bg-industrial-100 px-2.5 py-0.5 text-xs font-bold text-industrial-600 border border-industrial-200/60">
                  {samples.length}
                </span>
              </div>
              <button
                onClick={onViewSamples}
                className="group inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition-colors hover:text-brand-700"
              >
                <span>View all</span>
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>

            {samples.length ? (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-industrial-200/70 bg-industrial-50/70 text-[11px] font-bold uppercase tracking-wider text-industrial-500">
                      <th scope="col" className="px-5 py-3.5 sm:px-6">SAMPLE ID</th>
                      <th scope="col" className="px-5 py-3.5 sm:px-6">USER ID</th>
                      <th scope="col" className="px-5 py-3.5 sm:px-6">CREATED</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-industrial-100/80 text-industrial-900">
                    {samples.slice(0, 5).map((sample) => (
                      <tr key={sample.sampleId} className="hover:bg-brand-50/30 transition-colors duration-150">
                        <td className="px-5 py-3.5 sm:px-6">
                          <span className="inline-flex items-center rounded-md border border-industrial-200/80 bg-industrial-50 px-2.5 py-1 text-xs font-mono font-bold text-industrial-900 shadow-2xs">
                            {sample.sampleId}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 sm:px-6 font-semibold text-industrial-700">
                          {sample.userId || sample.userName || '—'}
                        </td>
                        <td className="px-5 py-3.5 sm:px-6 font-medium text-industrial-500 text-xs">
                          {formatDate(sample.createdDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-sm font-bold text-industrial-700">No samples available</p>
                <p className="mt-1 text-sm text-industrial-500">There are currently no samples configured in the system.</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

const sampleShape = PropTypes.shape({
  sampleId: PropTypes.string.isRequired,
  userId: PropTypes.string,
  userName: PropTypes.string,
  createdDate: PropTypes.string,
})

DashboardOverview.propTypes = {
  samples: PropTypes.arrayOf(sampleShape).isRequired,
  totalCount: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  onViewSamples: PropTypes.func.isRequired,
  onRetry: PropTypes.func,
}

export default DashboardOverview
