import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/lib/store";
import { PageHeader, StatCard, MembershipBadge, AccessBadge } from "@/components/Ui";
import { Card } from "@/components/ui/card";
import { fmtDateTime, daysLeft, fmtDate } from "@/lib/format";
import { CalendarCheck, Flame, CreditCard, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserDashboard() {
  const { profile } = useAuth();
  const memberships = useStore((s) => s.memberships);
  const attendances = useStore((s) => s.attendances);
  const events = useStore((s) => s.events);

  const membership = memberships.find((m) => m.userId === profile?.id);
  const mine = attendances.filter((a) => a.userId === profile?.id);
  const thisMonth = mine.filter((a) => new Date(a.fecha).getMonth() === new Date().getMonth());

  return (
    <div>
      <PageHeader title={`Hola, ${profile?.nombre?.split(" ")[0]} 👋`} subtitle="Resumen de tu actividad" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Membresía"
          value={membership?.status === "activa" ? "Activa" : membership?.status === "por_vencer" ? "Por vencer" : "Vencida"}
          icon={CreditCard}
          tone={membership?.status === "activa" ? "success" : "warning"}
          hint={membership ? membership.plan : "Sin membresía"}
        />
        <StatCard
          label="Días restantes"
          value={membership ? Math.max(0, daysLeft(membership.fin)) : 0}
          icon={Flame}
          tone="primary"
        />
        <StatCard label="Asistencias del mes" value={thisMonth.length} icon={CalendarCheck} />
        <StatCard label="Total asistencias" value={mine.length} icon={CalendarCheck} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="glass-card lg:col-span-2 p-5">
          <h3 className="mb-4 font-semibold">Últimas asistencias</h3>
          <div className="space-y-2">
            {mine.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg bg-accent/40 px-3 py-2 text-sm">
                <span>{fmtDateTime(a.fecha)}</span>
                <span className="text-muted-foreground">{a.puerta}</span>
                <AccessBadge result={a.resultado} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Estado</h3>
            {membership && <MembershipBadge status={membership.status} />}
          </div>
          {membership ? (
            <div className="space-y-2 text-sm">
              <Row label="Plan" value={membership.plan} />
              <Row label="Inicio" value={fmtDate(membership.inicio)} />
              <Row label="Vence" value={fmtDate(membership.fin)} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No tienes una membresía activa.</p>
          )}
          <Link to="/app/membresia" className="mt-4 block text-sm font-medium text-primary hover:underline">
            Gestionar membresía →
          </Link>
        </Card>
      </div>

      <Card className="glass-card mt-6 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Megaphone className="size-4 text-primary" />
          <h3 className="font-semibold">Eventos del gimnasio</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {events.map((e) => (
            <div key={e.id} className="rounded-lg bg-accent/40 p-3">
              <p className="text-xs font-semibold text-primary">{fmtDate(e.fecha)}</p>
              <p className="mt-1 text-sm font-medium">{e.titulo}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
