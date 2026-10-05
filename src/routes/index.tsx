import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Stethoscope } from 'lucide-react'
import { setStoredPatientName } from '../lib/session'

export const Route = createFileRoute('/')({
  component: Login,
})

function Login() {
  const navigate = useNavigate()
  const [emailOrUser, setEmailOrUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!emailOrUser.trim() || !password.trim()) {
      setError('Informe e-mail/usuário e senha para continuar.')
      return
    }
    setStoredPatientName(emailOrUser.trim())
    navigate({ to: '/agendamento' })
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-teal-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">CliniMed</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-base font-semibold text-slate-800">
              E-mail ou Usuário
            </label>
            <input
              value={emailOrUser}
              onChange={(e) => setEmailOrUser(e.target.value)}
              type="text"
              placeholder="voce@exemplo.com"
              className="h-11 rounded-md bg-slate-200/70 px-3 text-sm text-slate-800 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-base font-semibold text-slate-800">
              Senha
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="h-11 rounded-md bg-slate-200/70 px-3 text-sm text-slate-800 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="mt-2 h-12 rounded-md border border-slate-300 bg-white font-bold text-slate-800 hover:bg-slate-50 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
