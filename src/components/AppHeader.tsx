import { Link } from '@tanstack/react-router'
import { Stethoscope, CalendarPlus, ClipboardList, LogOut } from 'lucide-react'
import { clearStoredPatientName } from '../lib/session'
import { useNavigate } from '@tanstack/react-router'

export function AppHeader({ patientName }: { patientName: string | null }) {
  const navigate = useNavigate()

  function handleLogout() {
    clearStoredPatientName()
    navigate({ to: '/' })
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-teal-600" />
          </div>
          <span className="font-bold text-slate-800">CliniMed</span>
        </div>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/agendamento"
            className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 [&.active]:bg-teal-50 [&.active]:text-teal-700"
          >
            <CalendarPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Agendar</span>
          </Link>
          <Link
            to="/meus-agendamentos"
            className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 [&.active]:bg-teal-50 [&.active]:text-teal-700"
          >
            <ClipboardList className="w-4 h-4" />
            <span className="hidden sm:inline">Meus agendamentos</span>
          </Link>
          {patientName && (
            <button
              onClick={handleLogout}
              title="Sair"
              className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
