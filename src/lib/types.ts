export type Role = "admin" | "user";

export type MembershipStatus = "activa" | "vencida" | "por_vencer";
export type DeviceStatus = "activo" | "mantenimiento" | "caido";
export type AccessResult = "permitido" | "vencida" | "denegado" | "pin";

export interface Profile {
  id: string;
  nombre: string;
  email: string;
  dni: string;
  telefono: string;
  role: Role;
  avatar?: string;
  pin: string;
}

export interface Membership {
  id: string;
  userId: string;
  plan: string;
  inicio: string; // ISO date
  fin: string; // ISO date
  precio: number;
  status: MembershipStatus;
}

export interface Attendance {
  id: string;
  userId: string;
  nombre: string;
  fecha: string; // ISO datetime
  metodo: "biometrico" | "pin" | "dni";
  resultado: AccessResult;
  puerta: string;
}

export interface GymEvent {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  imagen?: string;
}

export interface Device {
  id: string;
  nombre: string;
  ubicacion: string;
  status: DeviceStatus;
  ultimaConexion: string;
  forzarPin?: boolean;
}

export interface HardwareLog {
  id: string;
  deviceId: string;
  deviceNombre: string;
  nivel: "info" | "warning" | "error";
  mensaje: string;
  fecha: string;
}

export interface Alert {
  id: string;
  tipo: "dispositivo" | "contingencia" | "membresia" | "sistema";
  mensaje: string;
  canal: "email" | "whatsapp" | "sistema";
  fecha: string;
  leida: boolean;
}

export interface Visitor {
  id: string;
  nombre: string;
  dni: string;
  fecha: string;
  precio: number;
  pin: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
}
