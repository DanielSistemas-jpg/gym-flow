import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/Ui";
import { Card } from "@/components/ui/card";
import { fmtDate } from "@/lib/format";
import { CalendarDays } from "lucide-react";

export default function UserEvents() {
  const events = useStore((s) => s.events);
  return (
    <div>
      <PageHeader title="Eventos" subtitle="Actividades y anuncios del gimnasio" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <Card key={e.id} className="glass-card p-6">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <CalendarDays className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">{fmtDate(e.fecha)}</span>
            </div>
            <h3 className="font-semibold">{e.titulo}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{e.descripcion}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
