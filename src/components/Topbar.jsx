import { NavLink } from 'react-router-dom'
import { Bell, ChevronDown } from 'lucide-react'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Topbar() {
  const { user } = useAuth()
  const initial = user?.name?.trim()?.[0]?.toUpperCase() || '?'

  return (
    <header className="flex items-center justify-between border-b border-border px-8 py-4">
      <nav className="flex items-center gap-6">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `text-sm font-medium pb-1 border-b-2 transition-colors ${
              isActive ? 'text-white border-teal' : 'text-gray-400 border-transparent hover:text-white'
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/features"
          className={({ isActive }) =>
            `text-sm font-medium pb-1 border-b-2 transition-colors ${
              isActive ? 'text-white border-teal' : 'text-gray-400 border-transparent hover:text-white'
            }`
          }
        >
          Features
        </NavLink>
      </nav>

      <div className="flex items-center gap-5">
        <button aria-label="Notifications" className="text-gray-400 hover:text-white transition-colors">
          <Bell size={19} />
        </button>
        <button className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal/20 text-teal flex items-center justify-center text-sm font-semibold">
            {initial}
          </div>
          <span className="text-sm font-medium">{user?.name || 'Guest'}</span>
          <ChevronDown size={15} className="text-gray-400" />
        </button>
      </div>
    </header>
  )
}
