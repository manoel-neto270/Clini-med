import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { CalendarDays, Clock, Stethoscope } from 'lucide-react'
import { usePatientName } from '../lib/session'
import { AppHeader } from '../components/AppHeader'
import { createAppointment, DOCTORS, TIME_SLOTS } from '../server/appointments.functions'

export const Route = createFileRoute('/agendamento')({
  component: Agendamento,
})

const SPECIALTIES = Array.from(new Set(DOCTORS.map((d) => d.specialty)))

function Agendamento() {
  const { patientName, ready } = usePatientName()
  const navigate = useNavigate()

  const [specialty, setSpecialty] = useState('')
  const [doctorName, setDoctorName] = useState('')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const doctorsForSpecialty = useMemo(
    () => DOCTORS.filter((d) => d.specialty === specialty),
    [specialty],
  )

  const today = new Date().toISOString().slice(0, 10)

  if (ready && !patientName) {
    navigate({ to: '/' })
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!specialty || !doctorName || !appointmentDate || !appointmentTime) {
      setError('Preencha especialidade, médico, data e horário.')
      return
    }
    if (!patientName) return

    setSubmitting(true)
    setError('')
    try {
      const appointment = await createAppointment({
        data: {
          patientName,
          specialty,
          doctorName,
          appointmentDate,
          appointmentTime,
          notes,
        },
      })
      navigate({
        to: '/agendamento-confirmado/$id',
        params: { id: String(appointment.id) },
      })
    } catch {
      setError('Não foi possível concluir o agendamento. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader patientName={patientName} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          Agendamento
        </h1>
        <p className="text-slate-500 mb-6">
          Escolha a especialidade, o médico e o melhor horário para sua consulta.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              Especialidade
            </label>
            <select
              value={specialty}
              onChange={(e) => {
                setSpecialty(e.target.value)
                setDoctorName('')
              }}
              className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Selecione uma especialidade</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Médico(a)
            </label>
            <select
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              disabled={!specialty}
              className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">
                {specialty ? 'Selecione um médico' : 'Escolha a especialidade primeiro'}
              </option>
              {doctorsForSpecialty.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-teal-600" />
                Data
              </label>
              <input
                type="date"
                min={today}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-600" />
                Horário
              </label>
              <select
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Selecione</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Observações (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Ex: sintomas, exames anteriores, preferências..."
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 h-12 rounded-md bg-teal-600 font-bold text-white hover:bg-teal-700 transition-colors disabled:opacity-60"
          >
            {submitting ? 'Confirmando...' : 'Confirmar agendamento'}
          </button>
        </form>
      </div>
    </div>
  )
}
