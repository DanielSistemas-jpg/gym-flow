import { useAuth } from "@/contexts/AuthContext";
import { useStore, store } from "@/lib/store";
import { PageHeader } from "@/components/Ui";
import { Card } from "@/components/ui/card";
import { fromNow } from "@/lib/format";
import { Bell, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserNotifications() {
  const { profile } = useAuth();
  const notifications = useStore((s) => s.notifications);
  const mine = notifications.filter((n) => n.userId === profile?.id);

  return (
    <div>
      <PageHeader title="Notificaciones" subtitle="Mensajes importantes para ti" />
      <div className="space-y-3">
        {mine.length === 0 && (
          <Card className="glass-card flex items-center gap-3 p-6 text-muted-foreground">
            <BellOff className="size-5" /> No tienes notificaciones.
          </Card>
        )}
        {mine.map((n) => (
          <Card
            key={n.id}
            onClick={() => store.markNotificationRead(n.id)}
            className={cn(
              "glass-card flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-accent/40",
              !n.leida && "border-primary/40",
            )}
          >
            <div className={cn("mt-0.5 rounded-lg p-2", n.leida ? "bg-accent" : "bg-primary/15 text-primary")}>
              <Bell className="size-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{n.titulo}</p>
                <span className="text-xs text-muted-foreground">{fromNow(n.fecha)}</span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{n.mensaje}</p>
            </div>
            {!n.leida && <span className="mt-2 size-2 rounded-full bg-primary" />}
          </Card>
        ))}
      </div>
    </div>
  );
}
