import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { appointments } from '../../db/schema.js'
import { eq, desc } from 'drizzle-orm'

export const DOCTORS = [
  { specialty: 'Cardiologia', name: 'Dr. Felipe Rocha' },
  { specialty: 'Cardiologia', name: 'Dr. Emanuel da Silva Junior' },
  { specialty: 'Cardiologia', name: 'Dra. Fernanda Amaral' },
  { specialty: 'Clínico Geral', name: 'Dra. Marina Alves' },
  { specialty: 'Clínico Geral', name: 'Dra. Maria de Nobrega' },
  { specialty: 'Clínico Geral', name: 'Dr. Luiz Flavio Emerenciano' },
  { specialty: 'Pediatria', name: 'Dr. Rafael Lima' },
  { specialty: 'Pediatria', name: 'Dr. Gustavo Bastos Mioto' },
  { specialty: 'Pediatria', name: 'Dra. Rafaela de Souza' },
  { specialty: 'Ortopedia', name: 'Dra. Beatriz Nogueira' },
  { specialty: 'Ortopedia', name: 'Dra. Gabriela Fernandes Carrad' },
  { specialty: 'Ortopedia', name: 'Dra. Larissa Paes' },
]

export const TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:30',
  '19:00',
]

const CreateAppointmentSchema = z.object({
  patientName: z.string().min(1).max(120),
  specialty: z.string().min(1),
  doctorName: z.string().min(1),
  appointmentDate: z.string().min(1),
  appointmentTime: z.string().min(1),
  notes: z.string().max(500).optional().default(''),
})

export const createAppointment = createServerFn({ method: 'POST' })
  .inputValidator(CreateAppointmentSchema)
  .handler(async ({ data }) => {
    const [appointment] = await db
      .insert(appointments)
      .values({
        patientName: data.patientName,
        specialty: data.specialty,
        doctorName: data.doctorName,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        notes: data.notes ?? '',
        status: 'confirmado',
      })
      .returning()
    return appointment
  })

export const getAppointmentById = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    const [appointment] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, data.id))
    return appointment ?? null
  })

export const getAppointmentsForPatient = createServerFn({ method: 'GET' })
  .inputValidator((data: { patientName: string }) => data)
  .handler(async ({ data }) => {
    const rows = await db
      .select()
      .from(appointments)
      .where(eq(appointments.patientName, data.patientName))
      .orderBy(desc(appointments.createdAt))
    return rows
  })

export const cancelAppointment = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    const [appointment] = await db
      .update(appointments)
      .set({ status: 'cancelado' })
      .where(eq(appointments.id, data.id))
      .returning()
    return appointment ?? null
  })
