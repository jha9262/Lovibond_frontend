import { Menu } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import DashboardOverview from '../components/Home/DashboardOverview'
import HomeSidebar from '../components/Home/HomeSidebar'
import SampleManagement from '../components/Home/SampleManagement'
import UserManagement from '../components/Home/UserManagement'
import ElectrochemistryPage from '../components/Electrochemistry/ElectrochemistryPage'
import PhotometryPage from '../components/Photometry/PhotometryPage'
import { sampleService } from '../services/sampleService'
import { userService } from '../services/userService'


const Live = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const [samples, setSamples] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const requestRef = useRef({ page: 1, limit: 10, search: '' })

  const [users, setUsers] = useState([])
  const [userPagination, setUserPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [userError, setUserError] = useState(false)
  const userRequestRef = useRef({ page: 1, limit: 10, search: '' })


  const loadSamples = useCallback(async (params = {}) => {
    const request = { ...requestRef.current, ...params }
    requestRef.current = request
    try {
      setLoading(true)
      setError(false)
      const result = await sampleService.getSamples(request)
      setSamples(result.samples)
      setPagination(result.pagination)
    } catch (err) {
      console.error('Unable to load samples:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadUsers = useCallback(async (params = {}) => {
    const request = { ...userRequestRef.current, ...params }
    userRequestRef.current = request
    try {
      setLoadingUsers(true)
      setUserError(false)
      const result = await userService.getUsers(request)
      setUsers(result.users)
      setUserPagination(result.pagination)
    } catch (err) {
      console.error('Unable to load users:', err)
      setUserError(true)
    } finally {
      setLoadingUsers(false)
    }
  }, [])


  useEffect(() => {
    loadSamples()
    loadUsers()
  }, [loadSamples, loadUsers])

  const selectSection = (section) => { setActiveSection(section); setIsMobileMenuOpen(false) }

  const createSample = async (payloads) => {
    const requests = Array.isArray(payloads) ? payloads : [payloads]
    const response = await sampleService.createSamples(requests)
    await loadSamples({ page: 1 })
    return { createdCount: response.created.length, failedCount: response.failed.length, failedPayloads: response.failed }
  }

  const createUser = async (payloads) => {
    const requests = Array.isArray(payloads) ? payloads : [payloads]
    const response = await userService.createUsers(requests)
    await loadUsers({ page: 1 })
    return { createdCount: response.created.length, failedCount: response.failed.length, failedPayloads: response.failed }
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement users={users} pagination={userPagination} loading={loadingUsers} error={userError} onRequestUsers={loadUsers} onCreateUser={createUser} />
      case 'samples':
        return <SampleManagement samples={samples} pagination={pagination} loading={loading} error={error} onRequestSamples={loadSamples} onCreateSample={createSample} />
      case 'electrochemistry':
        return <ElectrochemistryPage samples={samples} />
      case 'photometry':
        return <PhotometryPage samples={samples} />
      default:
        return <DashboardOverview samples={samples} totalCount={pagination.total} loading={loading} error={error} onViewSamples={() => selectSection('samples')} />
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] bg-industrial-50 text-industrial-900">
      <div className="hidden shrink-0 md:block"><HomeSidebar activeSection={activeSection} onSelect={selectSection} /></div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button aria-label="Close menu" onClick={() => setIsMobileMenuOpen(false)} className="absolute inset-0 bg-industrial-900/40" />
          <div className="relative h-full w-72"><HomeSidebar mobile activeSection={activeSection} onSelect={selectSection} onClose={() => setIsMobileMenuOpen(false)} /></div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 border-b border-industrial-200 bg-white px-4 py-3 md:hidden">
          <button onClick={() => setIsMobileMenuOpen(true)} className="rounded-lg bg-industrial-100 p-2 text-industrial-700"><Menu size={20} /></button>
          <span className="text-sm font-black text-industrial-900">HOME</span>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{renderSection()}</div>
      </div>
    </main>
  )
}

export default Live
