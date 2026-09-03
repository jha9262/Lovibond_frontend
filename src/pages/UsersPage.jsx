import { useCallback, useEffect, useRef, useState } from 'react'
import UserManagement from '../components/Home/UserManagement'
import { userService } from '../services/userService'

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [userPagination, setUserPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [userError, setUserError] = useState(false)
  const userRequestRef = useRef({ page: 1, limit: 10, search: '' })

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
    loadUsers()
  }, [loadUsers])

  const createUser = async (payloads) => {
    const requests = Array.isArray(payloads) ? payloads : [payloads]
    const response = await userService.createUsers(requests)
    await loadUsers({ page: 1 })
    return { createdCount: response.created.length, failedCount: response.failed.length, failedPayloads: response.failed }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-industrial-50 text-industrial-900">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
        <UserManagement 
          users={users} 
          pagination={userPagination} 
          loading={loadingUsers} 
          error={userError} 
          onRequestUsers={loadUsers} 
          onCreateUser={createUser} 
        />
      </div>
    </div>
  )
}

export default UsersPage
