import { AppShell } from "./AppShell";
import { LayoutDashboard, CreditCard, CalendarCheck, Megaphone, Bell, User } from "lucide-react";

export default function UserLayout() {
  return (
    <AppShell
      title="Socio"
      items={[
        { to: "/app", label: "Inicio", icon: LayoutDashboard, end: true },
        { to: "/app/membresia", label: "Membresía", icon: CreditCard },
        { to: "/app/asistencias", label: "Asistencias", icon: CalendarCheck },
        { to: "/app/eventos", label: "Eventos", icon: Megaphone },
        { to: "/app/notificaciones", label: "Notificaciones", icon: Bell },
        { to: "/app/perfil", label: "Mi perfil", icon: User },
      ]}
    />
  );
}
