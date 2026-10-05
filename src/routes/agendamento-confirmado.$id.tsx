import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { CalendarCheck2, CalendarDays, Clock, Stethoscope, User } from 'lucide-react'
import { usePatientName } from '../lib/session'
import { AppHeader } from '../components/AppHeader'
import { getAppointmentById } from '../server/appointments.functions'

export const Route = createFileRoute('/agendamento-confirmado/$id')({
  loader: async ({ params }) => {
    const appointment = await getAppointmentById({ data: { id: Number(params.id) } })
    return { appointment }
  },
  component: AgendamentoConfirmado,
})

function formatDate(value: string) {
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}

function AgendamentoConfirmado() {
  const { patientName } = usePatientName()
  const { appointment } = Route.useLoaderData()
  const navigate = useNavigate()

  if (!appointment) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AppHeader patientName={patientName} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-slate-600 mb-4">Agendamento não encontrado.</p>
          <button
            onClick={() => navigate({ to: '/agendamento' })}
            className="text-teal-600 font-semibold hover:underline"
          >
            Fazer um novo agendamento
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader patientName={patientName} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <CalendarCheck2 className="w-8 h-8 text-emerald-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Agendamento confirmado!
            </h1>
            <p className="text-slate-500 mt-1">
              Sua consulta foi reservada com sucesso. Chegue com 15 minutos de antecedência.
            </p>
          </div>

          <div className="w-full text-left rounded-xl border border-slate-200 bg-slate-50 p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-teal-600" />
              <span className="text-sm text-slate-700">
                <span className="font-semibold">Paciente:</span> {appointment.patientName}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span className="text-sm text-slate-700">
                <span className="font-semibold">{appointment.specialty}</span> &middot;{' '}
                {appointment.doctorName}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="w-4 h-4 text-teal-600" />
              <span className="text-sm text-slate-700">
                {formatDate(appointment.appointmentDate)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-teal-600" />
              <span className="text-sm text-slate-700">{appointment.appointmentTime}</span>
            </div>
            {appointment.notes && (
              <p className="text-sm text-slate-500 border-t border-slate-200 pt-3">
                {appointment.notes}
              </p>
            )}
            <span className="self-start mt-1 inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1">
              Confirmado
            </span>
          </div>

          <Link
            to="/meus-agendamentos"
            className="h-11 px-6 rounded-md bg-teal-600 font-bold text-white hover:bg-teal-700 transition-colors flex items-center justify-center"
          >
            Ver meus agendamentos
          </Link>
        </div>
      </div>
    </div>
  )
}
