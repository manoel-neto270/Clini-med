CREATE TABLE "appointments" (
	"id" serial PRIMARY KEY,
	"patient_name" text NOT NULL,
	"specialty" text NOT NULL,
	"doctor_name" text NOT NULL,
	"appointment_date" text NOT NULL,
	"appointment_time" text NOT NULL,
	"status" text DEFAULT 'confirmado' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
