import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/Ui";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { KeyRound } from "lucide-react";

export default function UserProfile() {
  const { profile } = useAuth();
  const memberships = useStore((s) => s.memberships);
  const membership = memberships.find((m) => m.userId === profile?.id);
  if (!profile) return null;
  const initials = profile.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <div>
      <PageHeader title="Mi perfil" subtitle="Tu información personal" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass-card flex flex-col items-center p-6 text-center">
          <Avatar className="size-20">
            <AvatarFallback className="bg-primary/20 text-2xl text-primary">{initials}</AvatarFallback>
          </Avatar>
          <h3 className="mt-4 text-lg font-bold">{profile.nombre}</h3>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          <span className="mt-3 rounded-full bg-accent px-3 py-1 text-xs capitalize">{profile.role}</span>
        </Card>

        <Card className="glass-card p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold">Datos personales</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Info label="DNI" value={profile.dni || "—"} />
            <Info label="Teléfono" value={profile.telefono || "—"} />
            <Info label="Plan actual" value={membership?.plan ?? "Sin membresía"} />
            <Info label="Estado" value={membership?.status ?? "—"} />
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 p-4">
            <KeyRound className="size-5 text-primary" />
            <div>
              <p className="text-sm font-medium">PIN de respaldo</p>
              <p className="text-xs text-muted-foreground">
                Úsalo si la huella falla. Tu PIN: <b className="text-foreground tracking-widest">{profile.pin}</b>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium capitalize">{value}</p>
    </div>
  );
}
