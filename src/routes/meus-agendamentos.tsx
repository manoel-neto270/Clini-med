import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { CalendarDays, Clock, Stethoscope, User, CalendarX2 } from 'lucide-react'
import { usePatientName } from '../lib/session'
import { AppHeader } from '../components/AppHeader'
import {
  cancelAppointment,
  getAppointmentsForPatient,
} from '../server/appointments.functions'

export const Route = createFileRoute('/meus-agendamentos')({
  component: MeusAgendamentos,
})

type Appointment = Awaited<ReturnType<typeof getAppointmentsForPatient>>[number]

function formatDate(value: string) {
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}

const STATUS_STYLES: Record<string, string> = {
  confirmado: 'bg-emerald-100 text-emerald-700',
  cancelado: 'bg-red-100 text-red-700',
}

function MeusAgendamentos() {
  const { patientName, ready } = usePatientName()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState<Appointment[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ready) return
    if (!patientName) {
      navigate({ to: '/' })
      return
    }
    getAppointmentsForPatient({ data: { patientName } })
      .then(setAppointments)
      .finally(() => setLoading(false))
  }, [ready, patientName])

  async function handleCancel(id: number) {
    const updated = await cancelAppointment({ data: { id } })
    if (updated) {
      setAppointments((prev) =>
        prev ? prev.map((a) => (a.id === id ? updated : a)) : prev,
      )
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader patientName={patientName} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          Meus agendamentos
        </h1>
        <p className="text-slate-500 mb-6">
          Consultas agendadas com {patientName ?? 'você'}.
        </p>

        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
            Carregando agendamentos...
          </div>
        )}

        {!loading && appointments && appointments.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center gap-3">
            <CalendarX2 className="w-8 h-8 text-slate-400" />
            <p className="text-slate-500">
              Você ainda não tem nenhuma consulta agendada.
            </p>
            <Link
              to="/agendamento"
              className="text-teal-600 font-semibold hover:underline"
            >
              Agendar agora
            </Link>
          </div>
        )}

        {!loading && appointments && appointments.length > 0 && (
          <div className="flex flex-col gap-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    {appointment.specialty}
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full text-xs font-semibold px-3 py-1 ${
                      STATUS_STYLES[appointment.status] ??
                      'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    {appointment.doctorName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-slate-400" />
                    {formatDate(appointment.appointmentDate)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {appointment.appointmentTime}
                  </span>
                </div>

                {appointment.notes && (
                  <p className="text-sm text-slate-500 border-t border-slate-100 pt-3">
                    {appointment.notes}
                  </p>
                )}

                {appointment.status === 'confirmado' && (
                  <button
                    onClick={() => handleCancel(appointment.id)}
                    className="self-start text-sm font-semibold text-red-600 hover:underline mt-1"
                  >
                    Cancelar consulta
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
