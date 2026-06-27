import { useSyncExternalStore } from "react";
import * as mock from "./mock-data";
import {
  type Alert,
  type AppNotification,
  type Attendance,
  type Device,
  type DeviceStatus,
  type GymEvent,
  type Membership,
  type Profile,
  type Visitor,
} from "./types";

/**
 * In-memory reactive store powering the demo. It simulates Supabase Realtime by
 * notifying subscribers on every mutation. When you wire your own Supabase
 * project, replace these functions with table queries + realtime channels
 * (see README and supabase/schema.sql).
 */

interface State {
  profiles: Profile[];
  memberships: Membership[];
  attendances: Attendance[];
  events: GymEvent[];
  devices: Device[];
  hardwareLogs: typeof mock.hardwareLogs;
  alerts: Alert[];
  visitors: Visitor[];
  notifications: AppNotification[];
}

let state: State = {
  profiles: [...mock.profiles],
  memberships: [...mock.memberships],
  attendances: [...mock.attendances],
  events: [...mock.events],
  devices: [...mock.devices],
  hardwareLogs: [...mock.hardwareLogs],
  alerts: [...mock.alerts],
  visitors: [...mock.visitors],
  notifications: [...mock.notifications],
};

const listeners = new Set<() => void>();
const emit = () => {
  state = { ...state };
  listeners.forEach((l) => l());
};
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  );
}

const uid = () => Math.random().toString(36).slice(2, 10);
const genPin = () => String(Math.floor(1000 + Math.random() * 9000));

export const store = {
  get: () => state,

  // Members
  addMember(data: Omit<Profile, "id" | "role" | "pin">) {
    const profile: Profile = { ...data, id: uid(), role: "user", pin: genPin() };
    state.profiles.push(profile);
    emit();
    return profile;
  },
  updateMember(id: string, patch: Partial<Profile>) {
    state.profiles = state.profiles.map((p) => (p.id === id ? { ...p, ...patch } : p));
    emit();
  },
  removeMember(id: string) {
    state.profiles = state.profiles.filter((p) => p.id !== id);
    state.memberships = state.memberships.filter((m) => m.userId !== id);
    emit();
  },
  regeneratePin(id: string) {
    const pin = genPin();
    store.updateMember(id, { pin });
    return pin;
  },

  // Memberships
  setMembershipActive(userId: string, active: boolean) {
    state.memberships = state.memberships.map((m) =>
      m.userId === userId ? { ...m, status: active ? "activa" : "vencida" } : m,
    );
    emit();
  },
  renewMembership(userId: string, plan: string, precio: number, dias: number) {
    const fin = new Date(Date.now() + dias * 86400000).toISOString();
    const existing = state.memberships.find((m) => m.userId === userId);
    if (existing) {
      existing.plan = plan;
      existing.precio = precio;
      existing.inicio = new Date().toISOString();
      existing.fin = fin;
      existing.status = "activa";
    } else {
      state.memberships.push({
        id: uid(),
        userId,
        plan,
        precio,
        inicio: new Date().toISOString(),
        fin,
        status: "activa",
      });
    }
    emit();
  },

  // Attendance / access control
  registerAccess(att: Omit<Attendance, "id" | "fecha">) {
    const record: Attendance = { ...att, id: uid(), fecha: new Date().toISOString() };
    state.attendances = [record, ...state.attendances];
    emit();
    return record;
  },

  // Events
  addEvent(data: Omit<GymEvent, "id">) {
    state.events = [{ ...data, id: uid() }, ...state.events];
    emit();
  },
  updateEvent(id: string, patch: Partial<GymEvent>) {
    state.events = state.events.map((e) => (e.id === id ? { ...e, ...patch } : e));
    emit();
  },
  removeEvent(id: string) {
    state.events = state.events.filter((e) => e.id !== id);
    emit();
  },

  // Devices
  setDeviceStatus(id: string, status: DeviceStatus) {
    state.devices = state.devices.map((d) =>
      d.id === id ? { ...d, status, ultimaConexion: new Date().toISOString() } : d,
    );
    const dev = state.devices.find((d) => d.id === id);
    if (dev) {
      state.hardwareLogs = [
        {
          id: uid(),
          deviceId: id,
          deviceNombre: dev.nombre,
          nivel: status === "caido" ? "error" : status === "mantenimiento" ? "warning" : "info",
          mensaje: `Estado cambiado a ${status}`,
          fecha: new Date().toISOString(),
        },
        ...state.hardwareLogs,
      ];
      if (status === "caido") {
        store.addAlert({
          tipo: "dispositivo",
          mensaje: `${dev.nombre} caído — modo contingencia activado`,
          canal: "whatsapp",
        });
      }
    }
    emit();
  },

  // Alerts
  addAlert(data: Omit<Alert, "id" | "fecha" | "leida">) {
    state.alerts = [{ ...data, id: uid(), fecha: new Date().toISOString(), leida: false }, ...state.alerts];
    emit();
  },
  markAlertRead(id: string) {
    state.alerts = state.alerts.map((a) => (a.id === id ? { ...a, leida: true } : a));
    emit();
  },

  // Visitors
  addVisitor(data: Omit<Visitor, "id" | "pin" | "fecha">) {
    const visitor: Visitor = { ...data, id: uid(), pin: genPin(), fecha: new Date().toISOString() };
    state.visitors = [visitor, ...state.visitors];
    emit();
    return visitor;
  },

  // Notifications
  markNotificationRead(id: string) {
    state.notifications = state.notifications.map((n) => (n.id === id ? { ...n, leida: true } : n));
    emit();
  },
};
