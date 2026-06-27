import { useStore, store } from "@/lib/store";
import { PageHeader, DeviceBadge } from "@/components/Ui";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { fmtDateTime } from "@/lib/format";
import { Cpu, AlertTriangle, Wrench, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDevices() {
  const devices = useStore((s) => s.devices);
  const logs = useStore((s) => s.hardwareLogs);

  return (
    <div>
      <PageHeader title="Gestión de dispositivos" subtitle="Monitoreo de hardware, logs e incidencias" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {devices.map((d) => (
          <Card key={d.id} className="glass-card p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-accent p-2"><Cpu className="size-5 text-primary" /></div>
                <div>
                  <p className="font-semibold">{d.nombre}</p>
                  <p className="text-xs text-muted-foreground">{d.ubicacion}</p>
                </div>
              </div>
              <DeviceBadge status={d.status} />
            </div>

            <p className="mt-3 text-xs text-muted-foreground">Última conexión: {fmtDateTime(d.ultimaConexion)}</p>

            <div className="mt-4 flex items-center justify-between rounded-lg bg-accent/40 px-3 py-2">
              <span className="text-sm">Forzar PIN en esta puerta</span>
              <Switch
                checked={!!d.forzarPin}
                onCheckedChange={(v) => { store.toggleForcePin(d.id, v); toast.info(v ? "PIN forzado activado" : "PIN forzado desactivado"); }}
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => { store.setDeviceStatus(d.id, "activo"); toast.success("Dispositivo activo"); }}>
                <CheckCircle2 className="size-4" /> Activar
              </Button>
              <Button size="sm" variant="outline" onClick={() => { store.setDeviceStatus(d.id, "mantenimiento"); toast.info("En mantenimiento"); }}>
                <Wrench className="size-4" /> Mant.
              </Button>
              <Button size="sm" variant="destructive" onClick={() => { store.setDeviceStatus(d.id, "caido"); toast.error("Lector caído — alerta enviada"); }}>
                <AlertTriangle className="size-4" /> Simular caída
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="glass-card mt-6 p-5">
        <h3 className="mb-4 font-semibold">Consola de diagnóstico / Logs</h3>
        <div className="max-h-96 space-y-1 overflow-auto rounded-lg bg-[#111] p-3 font-mono text-xs">
          {logs.map((l) => (
            <div key={l.id} className="flex gap-2">
              <span className="text-muted-foreground">{fmtDateTime(l.fecha)}</span>
              <span className={cn(
                l.nivel === "error" && "text-primary",
                l.nivel === "warning" && "text-yellow-400",
                l.nivel === "info" && "text-green-400",
              )}>[{l.nivel.toUpperCase()}]</span>
              <span className="text-foreground/80">{l.deviceNombre}: {l.mensaje}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
