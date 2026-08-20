import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Target, BarChart3, Trophy, Gift, User, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../auth/AuthContext.jsx'

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/habits', label: 'Habits', icon: Target },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/rewards', label: 'Rewards', icon: Gift },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-bg px-4 py-6 flex flex-col justify-between">
      <div>
        <div className="px-2 mb-8">
          <span className="text-xl font-extrabold tracking-tight">
            LEVEL<span className="text-teal">UP</span>
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-surface text-teal'
                    : 'text-gray-400 hover:text-white hover:bg-surface'
                }`
              }
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-1 border-t border-border pt-4">
        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-surface transition-colors">
          <Settings size={18} />
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-surface transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}
