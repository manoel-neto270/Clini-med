import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const appointments = pgTable("appointments", {
  id: serial().primaryKey(),
  patientName: text("patient_name").notNull(),
  specialty: text("specialty").notNull(),
  doctorName: text("doctor_name").notNull(),
  appointmentDate: text("appointment_date").notNull(),
  appointmentTime: text("appointment_time").notNull(),
  status: text("status").notNull().default("confirmado"),
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow(),
});
