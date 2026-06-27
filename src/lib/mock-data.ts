import type {
  Alert,
  AppNotification,
  Attendance,
  Device,
  GymEvent,
  HardwareLog,
  Membership,
  Profile,
  Visitor,
} from "./types";

const now = new Date();
const iso = (d: Date) => d.toISOString();
const daysFromNow = (n: number) => iso(new Date(now.getTime() + n * 86400000));
const hoursAgo = (n: number) => iso(new Date(now.getTime() - n * 3600000));
const uid = () => Math.random().toString(36).slice(2, 10);

export const profiles: Profile[] = [
  {
    id: "admin-1",
    nombre: "Carlos Admin",
    email: "admin@evolution.com",
    dni: "70123456",
    telefono: "+51 999 111 222",
    role: "admin",
    pin: "4821",
  },
  {
    id: "user-1",
    nombre: "María Pérez",
    email: "user@evolution.com",
    dni: "71234567",
    telefono: "+51 988 333 444",
    role: "user",
    pin: "1290",
  },
  {
    id: "user-2",
    nombre: "Luis Gómez",
    email: "luis@evolution.com",
    dni: "72345678",
    telefono: "+51 977 555 666",
    role: "user",
    pin: "5573",
  },
  {
    id: "user-3",
    nombre: "Ana Torres",
    email: "ana@evolution.com",
    dni: "73456789",
    telefono: "+51 966 777 888",
    role: "user",
    pin: "9012",
  },
];

export const memberships: Membership[] = [
  {
    id: uid(),
    userId: "user-1",
    plan: "Premium Mensual",
    inicio: daysFromNow(-20),
    fin: daysFromNow(10),
    precio: 120,
    status: "activa",
  },
  {
    id: uid(),
    userId: "user-2",
    plan: "Básico Mensual",
    inicio: daysFromNow(-28),
    fin: daysFromNow(2),
    precio: 80,
    status: "por_vencer",
  },
  {
    id: uid(),
    userId: "user-3",
    plan: "Trimestral",
    inicio: daysFromNow(-95),
    fin: daysFromNow(-5),
    precio: 300,
    status: "vencida",
  },
];

export const events: GymEvent[] = [
  {
    id: uid(),
    titulo: "Reto de Verano 2026",
    descripcion: "8 semanas de transformación con seguimiento personalizado y premios.",
    fecha: daysFromNow(7),
  },
  {
    id: uid(),
    titulo: "Masterclass de CrossFit",
    descripcion: "Sesión especial con coach invitado. Cupos limitados.",
    fecha: daysFromNow(14),
  },
  {
    id: uid(),
    titulo: "Mantenimiento de equipos",
    descripcion: "El área de cardio estará cerrada de 6am a 9am.",
    fecha: daysFromNow(3),
  },
];

export const devices: Device[] = [
  { id: "dev-1", nombre: "Lector Principal", ubicacion: "Entrada Recepción", status: "activo", ultimaConexion: hoursAgo(0.1) },
  { id: "dev-2", nombre: "Lector Salida", ubicacion: "Puerta Trasera", status: "activo", ultimaConexion: hoursAgo(0.2) },
  { id: "dev-3", nombre: "Lector VIP", ubicacion: "Zona Premium", status: "mantenimiento", ultimaConexion: hoursAgo(5) },
  { id: "dev-4", nombre: "Torniquete 2", ubicacion: "Entrada Secundaria", status: "caido", ultimaConexion: hoursAgo(12) },
];

export const hardwareLogs: HardwareLog[] = [
  { id: uid(), deviceId: "dev-4", deviceNombre: "Torniquete 2", nivel: "error", mensaje: "Timeout de comunicación con el sensor", fecha: hoursAgo(12) },
  { id: uid(), deviceId: "dev-3", deviceNombre: "Lector VIP", nivel: "warning", mensaje: "Firmware desactualizado", fecha: hoursAgo(5) },
  { id: uid(), deviceId: "dev-1", deviceNombre: "Lector Principal", nivel: "info", mensaje: "Sincronización completada", fecha: hoursAgo(1) },
];

export const alerts: Alert[] = [
  { id: uid(), tipo: "dispositivo", mensaje: "Torniquete 2 sin respuesta — modo contingencia activado", canal: "whatsapp", fecha: hoursAgo(12), leida: false },
  { id: uid(), tipo: "contingencia", mensaje: "Acceso por PIN registrado en Entrada Secundaria", canal: "email", fecha: hoursAgo(11), leida: true },
];

export const visitors: Visitor[] = [
  { id: uid(), nombre: "Pedro Visitante", dni: "80112233", fecha: daysFromNow(0), precio: 15, pin: "3344" },
];

export const notifications: AppNotification[] = [
  { id: uid(), userId: "user-1", titulo: "Membresía por renovar", mensaje: "Tu membresía vence en 10 días.", fecha: hoursAgo(2), leida: false },
  { id: uid(), userId: "user-1", titulo: "Nuevo evento", mensaje: "Reto de Verano 2026 ya está disponible.", fecha: hoursAgo(20), leida: true },
];

const buildAttendance = (): Attendance[] => {
  const out: Attendance[] = [];
  for (let i = 0; i < 40; i++) {
    const u = profiles[1 + (i % 3)];
    out.push({
      id: uid(),
      userId: u.id,
      nombre: u.nombre,
      fecha: hoursAgo(i * 1.7),
      metodo: i % 9 === 0 ? "pin" : i % 13 === 0 ? "dni" : "biometrico",
      resultado: i % 11 === 0 ? "denegado" : i % 9 === 0 ? "pin" : "permitido",
      puerta: i % 2 === 0 ? "Entrada Recepción" : "Entrada Secundaria",
    });
  }
  return out;
};

export const attendances: Attendance[] = buildAttendance();
