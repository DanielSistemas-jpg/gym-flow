import { useState } from "react";
import { useStore, store } from "@/lib/store";
import { PageHeader, AccessBadge } from "@/components/Ui";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Fingerprint, KeyRound, Loader2 } from "lucide-react";
import { fmtDateTime } from "@/lib/format";
import type { AccessResult } from "@/lib/types";
import { cn } from "@/lib/utils";

type Result = { resultado: string; mensaje: string; nombre: string } | null;

export default function AdminAccess() {
  const profiles = useStore((s) => s.profiles);
  const memberships = useStore((s) => s.memberships);
  const attendances = useStore((s) => s.attendances);
  const devices = useStore((s) => s.devices);
  const forcedPin = devices.some((d) => d.forzarPin || d.status === "caido");

  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [pin, setPin] = useState("");
  const members = profiles.filter((p) => p.role === "user");

  function evaluate(userId: string, metodo: "biometrico" | "pin") {
    const u = profiles.find((p) => p.id === userId);
    const mem = memberships.find((m) => m.userId === userId);
    if (!u) return;
    let resultado: AccessResult = "permitido";
    let mensaje = "Acceso permitido. ¡Bienvenido!";
    if (!mem || mem.status === "vencida") {
      resultado = "vencida";
      mensaje = "Membresía vencida. Acceso denegado.";
    } else if (mem.status !== "activa") {
      resultado = "denegado";
      mensaje = "Acceso denegado.";
    } else if (metodo === "pin") {
      resultado = "pin";
      mensaje = "Acceso por PIN de contingencia registrado.";
    }
    store.registerAccess({
      userId,
      nombre: u.nombre,
      metodo,
      resultado,
      puerta: "Entrada Recepción",
    });
    setResult({ resultado, mensaje, nombre: u.nombre });
  }

  function simulateBiometric() {
    if (members.length === 0) return;
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      if (forcedPin) {
        setResult({ resultado: "denegado", nombre: "—", mensaje: "Lector en contingencia. Use PIN de respaldo." });
        return;
      }
      const u = members[Math.floor(Math.random() * members.length)];
      evaluate(u.id, "biometrico");
    }, 1600);
  }

  function submitPin() {
    const u = profiles.find((p) => p.pin === pin.trim());
    if (!u) {
      setResult({ resultado: "denegado", nombre: "—", mensaje: "PIN o DNI no reconocido." });
      return;
    }
    evaluate(u.id, "pin");
    setPin("");
  }

  return (
    <div>
      <PageHeader title="Control de acceso" subtitle="Simulación de lectura biométrica y PIN de contingencia" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card flex flex-col items-center p-8 text-center">
          <button
            onClick={simulateBiometric}
            disabled={scanning}
            className={cn(
              "flex size-32 items-center justify-center rounded-full border-2 transition-all",
              scanning ? "animate-pulse border-primary bg-primary/20" : "border-border hover:border-primary",
            )}
          >
            {scanning ? <Loader2 className="size-12 animate-spin text-primary" /> : <Fingerprint className="size-14 text-primary" />}
          </button>
          <p className="mt-4 text-sm text-muted-foreground">
            {scanning ? "Leyendo huella..." : "Toca para simular lectura biométrica"}
          </p>
          {forcedPin && <p className="mt-2 text-xs text-primary">⚠ Modo contingencia activo: usa PIN/DNI</p>}
        </Card>

        <Card className="glass-card p-8">
          <h3 className="flex items-center gap-2 font-semibold"><KeyRound className="size-4 text-primary" /> Ingreso por PIN / DNI</h3>
          <p className="mt-1 text-sm text-muted-foreground">Contingencia ante falla biométrica.</p>
          <div className="mt-4 space-y-3">
            <Label>PIN de respaldo o DNI</Label>
            <Input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Ej: 4821" className="text-center text-lg tracking-widest" />
            <Button className="w-full" onClick={submitPin}>Validar acceso</Button>
          </div>

          {result && (
            <div className={cn(
              "mt-6 rounded-xl border p-4 text-center",
              result.resultado === "permitido" || result.resultado === "pin"
                ? "border-green-500/40 bg-green-500/10"
                : "border-primary/40 bg-primary/10",
            )}>
              <p className="font-bold">{result.nombre}</p>
              <p className="mt-1 text-sm">{result.mensaje}</p>
            </div>
          )}
        </Card>
      </div>

      <Card className="glass-card mt-6 p-5">
        <h3 className="mb-4 font-semibold">Registro de ingresos</h3>
        <div className="max-h-80 space-y-2 overflow-auto pr-1">
          {attendances.slice(0, 20).map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg bg-accent/40 px-3 py-2 text-sm">
              <span className="font-medium">{a.nombre}</span>
              <span className="text-xs text-muted-foreground">{fmtDateTime(a.fecha)} · {a.metodo}</span>
              <AccessBadge result={a.resultado} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
