import { AppShell } from "./AppShell";
import {
  LayoutDashboard,
  Users,
  Fingerprint,
  HardDrive,
  BellRing,
  Megaphone,
} from "lucide-react";

export default function AdminLayout() {
  return (
    <AppShell
      title="Administración"
      items={[
        { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: "/admin/socios", label: "Socios", icon: Users },
        { to: "/admin/acceso", label: "Control de acceso", icon: Fingerprint },
        { to: "/admin/dispositivos", label: "Dispositivos", icon: HardDrive },
        { to: "/admin/alertas", label: "Alertas", icon: BellRing },
        { to: "/admin/contenido", label: "Contenido", icon: Megaphone },
      ]}
    />
  );
}
