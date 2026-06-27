import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/lib/store";
import { PageHeader, AccessBadge, StatCard } from "@/components/Ui";
import { Card } from "@/components/ui/card";
import { fmtDateTime, daysLeft } from "@/lib/format";
import { CalendarCheck, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEK = ["L", "M", "X", "J", "V", "S", "D"];

export default function UserAttendance() {
  const { profile } = useAuth();
  const attendances = useStore((s) => s.attendances);
  const memberships = useStore((s) => s.memberships);
  const membership = memberships.find((m) => m.userId === profile?.id);
  const mine = attendances.filter((a) => a.userId === profile?.id);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const attendedDays = new Set(
    mine
      .filter((a) => {
        const d = new Date(a.fecha);
        return d.getMonth() === month && d.getFullYear() === year && a.resultado !== "denegado";
      })
      .map((a) => new Date(a.fecha).getDate()),
  );
  const membershipEnd = membership ? new Date(membership.fin) : null;

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <PageHeader title="Asistencias" subtitle="Tu historial y calendario del mes" />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Días asistidos (mes)" value={attendedDays.size} icon={CalendarCheck} tone="primary" />
        <StatCard label="Total registros" value={mine.length} icon={CalendarCheck} />
        <StatCard
          label="Días de membresía restantes"
          value={membership ? Math.max(0, daysLeft(membership.fin)) : 0}
          icon={Flame}
          tone="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card p-5">
          <h3 className="mb-4 font-semibold capitalize">
            {today.toLocaleDateString("es", { month: "long", year: "numeric" })}
          </h3>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
            {WEEK.map((w) => (
              <div key={w} className="py-1 font-medium">{w}</div>
            ))}
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />;
              const date = new Date(year, month, d);
              const attended = attendedDays.has(d);
              const isToday = d === today.getDate();
              const withinMembership = membershipEnd && date <= membershipEnd && date >= today;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-md text-sm",
                    attended && "bg-primary font-bold text-primary-foreground shadow-[var(--shadow-glow)]",
                    !attended && withinMembership && "bg-accent/60 text-foreground",
                    !attended && !withinMembership && "text-muted-foreground",
                    isToday && "ring-2 ring-primary",
                  )}
                >
                  {d}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <Legend cls="bg-primary" label="Asistido" />
            <Legend cls="bg-accent/60" label="Membresía vigente" />
          </div>
        </Card>

        <Card className="glass-card p-5">
          <h3 className="mb-4 font-semibold">Historial completo</h3>
          <div className="max-h-[420px] space-y-2 overflow-auto pr-1">
            {mine.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg bg-accent/40 px-3 py-2 text-sm">
                <div>
                  <p>{fmtDateTime(a.fecha)}</p>
                  <p className="text-xs text-muted-foreground">{a.puerta} · {a.metodo}</p>
                </div>
                <AccessBadge result={a.resultado} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-3 rounded", cls)} /> {label}
    </span>
  );
}
