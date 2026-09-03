import { CircleDot, ClipboardList, FlaskConical, LayoutDashboard, X, Users, Settings, HelpCircle } from 'lucide-react'
import PropTypes from 'prop-types'

const mainItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'samples', label: 'Samples', icon: ClipboardList },
  { id: 'electrochemistry', label: 'Electrochemistry', icon: FlaskConical },
  { id: 'photometry', label: 'Photometer', icon: CircleDot },
]

const bottomItems = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'support', label: 'Support', icon: HelpCircle },
]

const HomeSidebar = ({ activeSection, onSelect, mobile = false, onClose }) => (
  <aside className={`flex h-full w-60 flex-col border-r border-industrial-200 bg-white ${mobile ? 'shadow-2xl' : ''}`}>
    {/* Header */}
    <div className="flex items-center justify-between border-b border-industrial-100 px-5 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
          <FlaskConical size={18} />
        </div>
        <div>
          <h2 className="text-sm font-black text-industrial-900">Lovibond</h2>
          <p className="text-[10px] font-medium text-industrial-400">Water Analysis</p>
        </div>
      </div>
      {mobile && (
        <button onClick={onClose} className="rounded-lg p-2 text-industrial-500 hover:bg-industrial-100"><X size={20} /></button>
      )}
    </div>

    {/* Main Navigation */}
    <nav className="flex-1 space-y-1 p-3">
      {mainItems.map(({ id, label, icon: Icon }) => {
        const isActive = activeSection === id
        return (
          <button key={id} onClick={() => onSelect(id)}
            className={`group flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold transition-all ${
              isActive
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                : 'text-industrial-600 hover:bg-brand-50 hover:text-brand-700'
            }`}
          >
            <Icon size={18} className={isActive ? 'text-white' : 'text-industrial-400 group-hover:text-brand-600'} />
            <span className="uppercase tracking-wide">{label}</span>
          </button>
        )
      })}
    </nav>

    {/* Bottom Navigation */}
    <div className="border-t border-industrial-100 p-3 space-y-1">
      {bottomItems.map(({ id, label, icon: Icon }) => (
        <button key={id} disabled
          className="group flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm font-medium text-industrial-400 cursor-not-allowed"
        >
          <Icon size={18} className="text-industrial-300" />
          <span className="uppercase tracking-wide">{label}</span>
        </button>
      ))}
    </div>
  </aside>
)

HomeSidebar.propTypes = {
  activeSection: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  mobile: PropTypes.bool,
  onClose: PropTypes.func,
}

export default HomeSidebar
