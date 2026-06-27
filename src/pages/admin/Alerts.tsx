import { useState } from "react";
import { useStore, store } from "@/lib/store";
import { PageHeader } from "@/components/Ui";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { fromNow } from "@/lib/format";
import { Mail, MessageCircle, Bell, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminAlerts() {
  const alerts = useStore((s) => s.alerts);
  const [email, setEmail] = useState("admin@evolutiongym.pe");
  const [whatsapp, setWhatsapp] = useState("+51 999 888 777");
  const [emailOn, setEmailOn] = useState(true);
  const [waOn, setWaOn] = useState(true);

  const channelIcon = (c: string) =>
    c === "email" ? <Mail className="size-4" /> : c === "whatsapp" ? <MessageCircle className="size-4" /> : <Bell className="size-4" />;

  return (
    <div>
      <PageHeader title="Alertas y notificaciones" subtitle="Configuración de canales y registro de envíos" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card p-6">
          <h3 className="mb-4 font-semibold">Configuración de canales</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2"><Mail className="size-4 text-primary" /> Correo electrónico</Label>
                <Switch checked={emailOn} onCheckedChange={setEmailOn} />
              </div>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={!emailOn} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2"><MessageCircle className="size-4 text-primary" /> WhatsApp (Twilio API)</Label>
                <Switch checked={waOn} onCheckedChange={setWaOn} />
              </div>
              <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} disabled={!waOn} />
            </div>
            <Button onClick={() => toast.success("Configuración guardada")}>Guardar configuración</Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => { store.addAlert({ tipo: "sistema", mensaje: "Alerta de prueba enviada correctamente", canal: emailOn ? "email" : "whatsapp" }); toast.success("Alerta de prueba enviada"); }}
            >
              Enviar alerta de prueba
            </Button>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Registro de alertas</h3>
            {alerts.some((a) => !a.leida) && (
              <Button size="sm" variant="ghost" onClick={() => alerts.forEach((a) => store.markAlertRead(a.id))}>
                Marcar todo leído
              </Button>
            )}
          </div>
          <div className="max-h-[460px] space-y-2 overflow-auto pr-1">
            {alerts.map((a) => (
              <div
                key={a.id}
                onClick={() => store.markAlertRead(a.id)}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm",
                  a.leida ? "bg-accent/40" : "bg-primary/10 border border-primary/30",
                )}
              >
                <div className="mt-0.5 text-primary">{channelIcon(a.canal)}</div>
                <div className="flex-1">
                  <p>{a.mensaje}</p>
                  <p className="text-xs text-muted-foreground capitalize">{a.tipo} · {a.canal} · {fromNow(a.fecha)}</p>
                </div>
                {a.leida && <Check className="size-4 text-green-400" />}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
