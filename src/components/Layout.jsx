import { Link, useLocation } from 'react-router-dom'
import { Home, Settings, BarChart2, GitCompare } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Evlerim' },
  { to: '/kriterler', icon: Settings, label: 'Kriterler' },
  { to: '/karsilastirma', icon: GitCompare, label: 'Karşılaştır' },
]

export default function Layout({ children }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">Ev Puanlama</h1>
              <p className="text-xs text-gray-500 leading-tight">Bilimsel Konut Değerlendirme</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === to
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {children}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs font-medium transition-colors ${
                location.pathname === to
                  ? 'text-blue-700'
                  : 'text-gray-500'
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="md:hidden h-16" />
    </div>
  )
}
