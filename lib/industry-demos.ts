// Illustrative, per-industry dashboard demo data for the Industries showcase.
// Numeric data is language-neutral; text labels are localized. These are sample
// figures for demonstration, not real client metrics.

export type DemoTone = "done" | "brand" | "work"

export interface DemoMetric {
  label: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
}

export interface DemoFeedItem {
  title: string
  meta: string
  tone: DemoTone
}

export interface IndustryDemo {
  tagline: string
  seriesLabel: string
  series: number[]
  kpis: DemoMetric[]
  feed: DemoFeedItem[]
}

type DemoValue = Omit<DemoMetric, "label">

// Shared numeric shape per industry id (values + series), reused across locales.
const NUMBERS: Record<string, { series: number[]; values: DemoValue[] }> = {
  home: {
    series: [4, 6, 5, 8, 7, 9, 11],
    values: [{ value: 38 }, { value: 27 }, { value: 4.2, suffix: "s", decimals: 1 }],
  },
  professional: {
    series: [5, 7, 6, 9, 8, 10, 12],
    values: [{ value: 52 }, { value: 31 }, { value: 92, suffix: "%" }],
  },
  healthcare: {
    series: [6, 8, 7, 10, 9, 12, 14],
    values: [{ value: 64 }, { value: 41 }, { value: 78, suffix: "%" }],
  },
  legal: {
    series: [2, 3, 4, 3, 5, 6, 7],
    values: [{ value: 23 }, { value: 19 }, { value: 34 }],
  },
  property: {
    series: [4, 6, 7, 6, 8, 9, 10],
    values: [{ value: 47 }, { value: 29 }, { value: 36 }],
  },
  ecommerce: {
    series: [12, 18, 15, 22, 19, 26, 31],
    values: [{ value: 128 }, { value: 71, suffix: "%" }, { value: 44 }],
  },
  government: {
    series: [3, 5, 4, 6, 5, 7, 8],
    values: [{ value: 33 }, { value: 28 }, { value: 96, suffix: "%" }],
  },
  other: {
    series: [5, 7, 6, 8, 7, 9, 10],
    values: [{ value: 58 }, { value: 12 }, { value: 6 }],
  },
}

interface DemoText {
  tagline: string
  seriesLabel: string
  kpiLabels: [string, string, string]
  feed: DemoFeedItem[]
}

const TEXT: Record<string, Record<string, DemoText>> = {
  en: {
    home: {
      tagline: "Missed calls turned into booked jobs — automatically.",
      seriesLabel: "Jobs booked / day",
      kpiLabels: ["Missed calls recovered", "Jobs booked", "Avg response"],
      feed: [
        { title: "Booked: Drain cleaning", meta: "Tue 9:00 AM · via missed-call text", tone: "done" },
        { title: "Estimate sent: Roof repair", meta: "2 min ago · auto follow-up", tone: "brand" },
        { title: "Review requested", meta: "After job #1487 completed", tone: "work" },
      ],
    },
    professional: {
      tagline: "Inquiries qualified and consults booked while you work.",
      seriesLabel: "Consults booked / day",
      kpiLabels: ["Inquiries qualified", "Consults scheduled", "Show rate"],
      feed: [
        { title: "Consult scheduled", meta: "Thu 2:30 PM · qualified lead", tone: "done" },
        { title: "Intake completed", meta: "New client · docs collected", tone: "brand" },
        { title: "Follow-up sent", meta: "Proposal pending signature", tone: "work" },
      ],
    },
    healthcare: {
      tagline: "Patients answered and coordinated, even after hours.",
      seriesLabel: "Appointments / day",
      kpiLabels: ["Inquiries answered", "Appointments set", "After-hours handled"],
      feed: [
        { title: "Appointment coordinated", meta: "Mon 11:15 AM · new patient", tone: "done" },
        { title: "After-hours inquiry handled", meta: "Approved FAQ · routed to nurse", tone: "brand" },
        { title: "Referral workflow started", meta: "Specialist · records requested", tone: "work" },
      ],
    },
    legal: {
      tagline: "New matters intake, qualified, and routed without delay.",
      seriesLabel: "New matters / day",
      kpiLabels: ["New matters", "Qualified & routed", "Docs chased"],
      feed: [
        { title: "New matter intake", meta: "Personal injury · qualified", tone: "done" },
        { title: "Routed to attorney", meta: "Conflict check cleared", tone: "brand" },
        { title: "Document reminder sent", meta: "Retainer awaiting signature", tone: "work" },
      ],
    },
    property: {
      tagline: "Inquiries routed and showings booked around the clock.",
      seriesLabel: "Showings booked / day",
      kpiLabels: ["Inquiries routed", "Showings booked", "Maintenance triaged"],
      feed: [
        { title: "Showing booked", meta: "Sat 1:00 PM · 2BR unit", tone: "done" },
        { title: "Inquiry routed", meta: "Leasing office · high intent", tone: "brand" },
        { title: "Maintenance triaged", meta: "Unit 304 · HVAC · scheduled", tone: "work" },
      ],
    },
    ecommerce: {
      tagline: "Order questions resolved and customers reactivated.",
      seriesLabel: "Questions resolved / day",
      kpiLabels: ["Questions resolved", "Tickets deflected", "Customers reactivated"],
      feed: [
        { title: "Order question resolved", meta: "Where's my order · tracked", tone: "done" },
        { title: "Ticket deflected", meta: "Return policy · self-serve", tone: "brand" },
        { title: "Reactivation sent", meta: "Lapsed 60 days · 15% offer", tone: "work" },
      ],
    },
    government: {
      tagline: "Requests intake, routed, and residents kept informed.",
      seriesLabel: "Requests handled / day",
      kpiLabels: ["Requests intake", "Routed to dept", "Status updates sent"],
      feed: [
        { title: "Permit request intake", meta: "Building · routed to dept", tone: "done" },
        { title: "Status update sent", meta: "Application #2231 · in review", tone: "brand" },
        { title: "Request routed", meta: "Public works · assigned", tone: "work" },
      ],
    },
    other: {
      tagline: "Inquiries captured and repetitive processes automated.",
      seriesLabel: "Tasks automated / day",
      kpiLabels: ["Inquiries captured", "Processes automated", "Systems integrated"],
      feed: [
        { title: "Inquiry captured", meta: "Web form · qualified", tone: "done" },
        { title: "Process automated", meta: "Invoice sync · nightly", tone: "brand" },
        { title: "Systems integrated", meta: "CRM to scheduling · live", tone: "work" },
      ],
    },
  },
  es: {
    home: {
      tagline: "Llamadas perdidas convertidas en trabajos agendados, automáticamente.",
      seriesLabel: "Trabajos agendados / día",
      kpiLabels: ["Llamadas recuperadas", "Trabajos agendados", "Respuesta prom."],
      feed: [
        { title: "Agendado: Limpieza de drenaje", meta: "Mar 9:00 · vía SMS de llamada perdida", tone: "done" },
        { title: "Estimado enviado: Reparación de techo", meta: "hace 2 min · seguimiento automático", tone: "brand" },
        { title: "Reseña solicitada", meta: "Tras completar trabajo #1487", tone: "work" },
      ],
    },
    professional: {
      tagline: "Consultas calificadas y citas agendadas mientras trabajas.",
      seriesLabel: "Consultas agendadas / día",
      kpiLabels: ["Consultas calificadas", "Citas agendadas", "Tasa de asistencia"],
      feed: [
        { title: "Consulta agendada", meta: "Jue 14:30 · prospecto calificado", tone: "done" },
        { title: "Admisión completada", meta: "Nuevo cliente · documentos recibidos", tone: "brand" },
        { title: "Seguimiento enviado", meta: "Propuesta pendiente de firma", tone: "work" },
      ],
    },
    healthcare: {
      tagline: "Pacientes atendidos y coordinados, incluso fuera de horario.",
      seriesLabel: "Citas / día",
      kpiLabels: ["Consultas atendidas", "Citas coordinadas", "Fuera de horario"],
      feed: [
        { title: "Cita coordinada", meta: "Lun 11:15 · paciente nuevo", tone: "done" },
        { title: "Consulta fuera de horario", meta: "FAQ aprobada · derivada a enfermería", tone: "brand" },
        { title: "Flujo de derivación iniciado", meta: "Especialista · expediente solicitado", tone: "work" },
      ],
    },
    legal: {
      tagline: "Nuevos casos recibidos, calificados y enrutados sin demora.",
      seriesLabel: "Casos nuevos / día",
      kpiLabels: ["Casos nuevos", "Calificados y enrutados", "Documentos gestionados"],
      feed: [
        { title: "Admisión de nuevo caso", meta: "Lesiones personales · calificado", tone: "done" },
        { title: "Enrutado a abogado", meta: "Verificación de conflicto aprobada", tone: "brand" },
        { title: "Recordatorio de documento", meta: "Contrato pendiente de firma", tone: "work" },
      ],
    },
    property: {
      tagline: "Consultas enrutadas y visitas agendadas a toda hora.",
      seriesLabel: "Visitas agendadas / día",
      kpiLabels: ["Consultas enrutadas", "Visitas agendadas", "Mantenimiento gestionado"],
      feed: [
        { title: "Visita agendada", meta: "Sáb 13:00 · unidad 2 rec.", tone: "done" },
        { title: "Consulta enrutada", meta: "Oficina de arriendo · alta intención", tone: "brand" },
        { title: "Mantenimiento gestionado", meta: "Unidad 304 · HVAC · agendado", tone: "work" },
      ],
    },
    ecommerce: {
      tagline: "Preguntas de pedidos resueltas y clientes reactivados.",
      seriesLabel: "Preguntas resueltas / día",
      kpiLabels: ["Preguntas resueltas", "Tickets desviados", "Clientes reactivados"],
      feed: [
        { title: "Pregunta de pedido resuelta", meta: "¿Dónde está mi pedido? · rastreado", tone: "done" },
        { title: "Ticket desviado", meta: "Política de devolución · autoservicio", tone: "brand" },
        { title: "Reactivación enviada", meta: "Inactivo 60 días · 15% dcto.", tone: "work" },
      ],
    },
    government: {
      tagline: "Solicitudes recibidas, enrutadas y residentes informados.",
      seriesLabel: "Solicitudes atendidas / día",
      kpiLabels: ["Solicitudes recibidas", "Enrutadas al área", "Actualizaciones enviadas"],
      feed: [
        { title: "Solicitud de permiso recibida", meta: "Construcción · enrutada al área", tone: "done" },
        { title: "Actualización enviada", meta: "Solicitud #2231 · en revisión", tone: "brand" },
        { title: "Solicitud enrutada", meta: "Obras públicas · asignada", tone: "work" },
      ],
    },
    other: {
      tagline: "Consultas capturadas y procesos repetitivos automatizados.",
      seriesLabel: "Tareas automatizadas / día",
      kpiLabels: ["Consultas capturadas", "Procesos automatizados", "Sistemas integrados"],
      feed: [
        { title: "Consulta capturada", meta: "Formulario web · calificada", tone: "done" },
        { title: "Proceso automatizado", meta: "Sincronización de facturas · nocturna", tone: "brand" },
        { title: "Sistemas integrados", meta: "CRM a agenda · en vivo", tone: "work" },
      ],
    },
  },
}

/** Returns the localized demo dashboard for an industry id, or null if unknown. */
export function getIndustryDemo(id: string, locale: string): IndustryDemo | null {
  const numbers = NUMBERS[id]
  const text = (TEXT[locale] ?? TEXT.en)[id]
  if (!numbers || !text) return null
  return {
    tagline: text.tagline,
    seriesLabel: text.seriesLabel,
    series: numbers.series,
    kpis: numbers.values.map((v, i) => ({ ...v, label: text.kpiLabels[i] })),
    feed: text.feed,
  }
}
