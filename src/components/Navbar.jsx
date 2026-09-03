import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from './ui'
import { X, Menu, User, Settings } from 'lucide-react'
import { AiOutlineLogout } from 'react-icons/ai'
import { HiOutlineStatusOnline } from 'react-icons/hi'
import { TbReportSearch } from 'react-icons/tb'
import { Factory } from 'lucide-react'
import ConfirmationModal from './ConfirmationModal'

const Navbar = () => {
  const location = useLocation()
  const { logout } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { label: 'HOME', to: '/LIVE', icon: <HiOutlineStatusOnline /> },
    { label: 'REPORT', to: '/report', icon: <TbReportSearch /> },
    { label: 'SETTINGS', to: '/SETTINGS', icon: <Settings size={18} /> },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-industrial-200 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map(({ label, to, icon }) => {
              const isActive = location.pathname === to
              return (
                <Link
                  key={label}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                      : 'text-industrial-500 hover:text-brand-700 hover:bg-brand-50'
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  {label}
                </Link>
              )
            })}
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-industrial-50 border border-industrial-200 rounded-lg">
              <User size={16} className="text-brand-600" />
              <div className="flex flex-col">
                <span className="text-[10px] text-industrial-400 font-bold uppercase tracking-widest leading-none">User</span>
                <span className="mt-0.5 text-xs text-industrial-900 font-black uppercase">LOVIBOND</span>
              </div>
            </div>
            <Button variant="secondary" onClick={() => setIsModalOpen(true)} icon={AiOutlineLogout} label="Log Out" className="!px-3 !py-1.5 border-red-100 hover:bg-red-50 hover:text-red-600" />
          </div>

          <div className="lg:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg text-industrial-500 hover:bg-industrial-50">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden border-t border-industrial-100 bg-white shadow-xl absolute w-full left-0">
          <div className="px-4 py-6 space-y-2">
            {navItems.map(({ label, to, icon }) => (
              <Link key={label} to={to} onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl ${
                  location.pathname === to ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25' : 'text-industrial-500'
                }`}
              >
                <span className="text-xl">{icon}</span>{label}
              </Link>
            ))}
            <button onClick={() => { setIsModalOpen(true); setIsMenuOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl">
              <AiOutlineLogout size={20} /> Log Out
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to log out?"
          onConfirm={() => { logout(); setIsModalOpen(false) }}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </nav>
  )
}

export default Navbar
