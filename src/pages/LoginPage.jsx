import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Card, Input, Button } from '../components/ui'
import { HiOutlineUser, HiOutlineLockClosed } from 'react-icons/hi'
function LoginPage() {
  const [formData, setFormData] = useState({ deviceId: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.deviceId || !formData.password) {
      toast.error('Device ID and password are required!')
      return
    }
    setLoading(true)
    setTimeout(() => {
      login()
      toast.success('Sign in successful')
      navigate('/LIVE')
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen w-full bg-industrial-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <Card className="w-full max-w-sm" title="System Access" subtitle="Enter your device credentials to continue">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input label="User Credentials" name="deviceId" value={formData.deviceId} placeholder="e.g. LVB-001" onChange={handleChange} disabled={loading} icon={HiOutlineUser} required />
          <Input label="Security Password" type="password" name="password" value={formData.password} placeholder="••••••••" onChange={handleChange} disabled={loading} icon={HiOutlineLockClosed} required />
          <Button variant="primary" disabled={loading} className="w-full py-3 mt-4" label={loading ? 'Verifying...' : 'Authorize Access'} type="submit" />
        </form>
      </Card>
    </div>
  )
}

export default LoginPage
