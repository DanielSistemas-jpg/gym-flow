import { useEffect } from "react";
import { useStore, store } from "@/lib/store";
import { PageHeader, StatCard, AccessBadge, DeviceBadge } from "@/components/Ui";
import { Card } from "@/components/ui/card";
import { fmtDateTime } from "@/lib/format";
import { Users, DoorOpen, ShieldX, AlertTriangle } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  const attendances = useStore((s) => s.attendances);
  const devices = useStore((s) => s.devices);
  const profiles = useStore((s) => s.profiles);
  const alerts = useStore((s) => s.alerts);

  // Simulate realtime ingress every 6s
  useEffect(() => {
    const id = setInterval(() => {
      const users = store.get().profiles.filter((p) => p.role === "user");
      const u = users[Math.floor(Math.random() * users.length)];
      if (!u) return;
      const denied = Math.random() < 0.15;
      store.registerAccess({
        userId: u.id,
        nombre: u.nombre,
        metodo: "biometrico",
        resultado: denied ? "denegado" : "permitido",
        puerta: "Entrada Recepción",
      });
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const todayList = attendances.filter(
    (a) => new Date(a.fecha).toDateString() === new Date().toDateString(),
  );
  const permitidos = todayList.filter((a) => a.resultado === "permitido" || a.resultado === "pin").length;
  const denegados = todayList.filter((a) => a.resultado === "denegado").length;
  const fallas = devices.filter((d) => d.status !== "activo").length;

  // Hourly chart
  const byHour = Array.from({ length: 12 }, (_, i) => {
    const hour = new Date().getHours() - 11 + i;
    const count = attendances.filter((a) => {
      const d = new Date(a.fecha);
      return d.toDateString() === new Date().toDateString() && d.getHours() === ((hour % 24) + 24) % 24;
    }).length;
    return { hora: `${((hour % 24) + 24) % 24}h`, ingresos: count };
  });

  return (
    <div>
      <PageHeader
        title="Dashboard en tiempo real"
        subtitle="Ingresos y estado del sistema actualizándose en vivo"
        action={
          <span className="flex items-center gap-2 rounded-full bg-green-500/15 px-3 py-1 text-xs text-green-400">
            <span className="size-2 animate-pulse rounded-full bg-green-400" /> En vivo
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Socios activos" value={profiles.filter((p) => p.role === "user").length} icon={Users} />
        <StatCard label="Accesos hoy" value={permitidos} icon={DoorOpen} tone="success" />
        <StatCard label="Denegados hoy" value={denegados} icon={ShieldX} tone="warning" />
        <StatCard label="Dispositivos con falla" value={fallas} icon={AlertTriangle} tone={fallas ? "primary" : "default"} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="glass-card p-5 lg:col-span-2">
          <h3 className="mb-4 font-semibold">Ingresos por hora</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={byHour}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D31413" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#D31413" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
              <XAxis dataKey="hora" stroke="#8b8c8d" fontSize={12} />
              <YAxis stroke="#8b8c8d" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#1c1c1c", border: "1px solid #2e2e2e", borderRadius: 8 }}
              />
              <Area type="monotone" dataKey="ingresos" stroke="#D31413" strokeWidth={2} fill="url(#g)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass-card p-5">
          <h3 className="mb-4 font-semibold">Terminales biométricas</h3>
          <div className="space-y-3">
            {devices.map((d) => (
              <div key={d.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{d.nombre}</p>
                  <p className="text-xs text-muted-foreground">{d.ubicacion}</p>
                </div>
                <DeviceBadge status={d.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="glass-card mt-6 p-5">
        <h3 className="mb-4 font-semibold">Accesos recientes</h3>
        <div className="max-h-80 space-y-2 overflow-auto pr-1">
          {attendances.slice(0, 15).map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg bg-accent/40 px-3 py-2 text-sm">
              <span className="font-medium">{a.nombre}</span>
              <span className="text-xs text-muted-foreground">{fmtDateTime(a.fecha)} · {a.puerta}</span>
              <AccessBadge result={a.resultado} />
            </div>
          ))}
        </div>
      </Card>

      {alerts.some((a) => !a.leida) && (
        <Card className="glass-card mt-6 border-primary/40 p-4">
          <p className="flex items-center gap-2 text-sm text-primary">
            <AlertTriangle className="size-4" /> Hay {alerts.filter((a) => !a.leida).length} alertas sin leer.
          </p>
        </Card>
      )}
    </div>
  );
}
