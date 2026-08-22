import { CircleDot, ClipboardList, FlaskConical, LayoutDashboard, X, Users } from 'lucide-react'
import PropTypes from 'prop-types'

const items = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'samples', label: 'Samples', icon: ClipboardList },
  { id: 'electrochemistry', label: 'Electrochemistry', icon: FlaskConical },
  { id: 'photometry', label: 'Photometry', icon: CircleDot },
]

const HomeSidebar = ({ activeSection, onSelect, mobile = false, onClose }) => (
  <aside className={`flex h-full w-60 flex-col border-r border-industrial-200 bg-white ${mobile ? 'shadow-2xl' : ''}`}>
    <div className="flex items-center justify-between border-b border-industrial-100 px-6 py-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-industrial-400">Home</p>
        <h2 className="mt-1 text-base font-black text-industrial-900">LOVIBOND</h2>
      </div>
      {mobile && (
        <button onClick={onClose} className="rounded-lg p-2 text-industrial-500 hover:bg-industrial-100"><X size={20} /></button>
      )}
    </div>
    <nav className="space-y-1 p-3">
      {items.map(({ id, label, icon: Icon }) => {
        const isActive = activeSection === id
        return (
          <button key={id} onClick={() => onSelect(id)}
            className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-bold transition-colors ${isActive ? 'bg-industrial-900 text-white' : 'text-industrial-600 hover:bg-industrial-50 hover:text-industrial-900'}`}
          >
            <Icon size={18} className={isActive ? 'text-white' : 'text-industrial-400 group-hover:text-industrial-700'} />
            {label}
          </button>
        )
      })}
    </nav>
    <p className="mt-auto border-t border-industrial-100 px-6 py-5 text-xs text-industrial-400">Laboratory workspace</p>
  </aside>
)

HomeSidebar.propTypes = {
  activeSection: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  mobile: PropTypes.bool,
  onClose: PropTypes.func,
}

export default HomeSidebar
