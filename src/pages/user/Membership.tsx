import { useAuth } from "@/contexts/AuthContext";
import { useStore, store } from "@/lib/store";
import { PageHeader, MembershipBadge } from "@/components/Ui";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fmtDate, daysLeft, money } from "@/lib/format";
import { toast } from "sonner";
import { Check } from "lucide-react";

const PLANS = [
  { plan: "Básico Mensual", precio: 80, dias: 30, perks: ["Acceso a sala", "Horario regular"] },
  { plan: "Premium Mensual", precio: 120, dias: 30, perks: ["Acceso total", "Clases grupales", "Zona VIP"] },
  { plan: "Trimestral", precio: 300, dias: 90, perks: ["3 meses", "Ahorra S/ 60", "Clases grupales"] },
];

export default function UserMembership() {
  const { profile } = useAuth();
  const memberships = useStore((s) => s.memberships);
  const membership = memberships.find((m) => m.userId === profile?.id);

  function buy(plan: string, precio: number, dias: number) {
    if (!profile) return;
    store.renewMembership(profile.id, plan, precio, dias);
    toast.success(`Membresía ${plan} activada`);
  }

  return (
    <div>
      <PageHeader title="Mi membresía" subtitle="Compra o renueva tu plan" />

      <Card className="glass-card mb-6 p-6">
        {membership ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold">{membership.plan}</h3>
                <MembershipBadge status={membership.status} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Vence el {fmtDate(membership.fin)} · {Math.max(0, daysLeft(membership.fin))} días restantes
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold neon-text">{money(membership.precio)}</p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No tienes una membresía. Elige un plan abajo.</p>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <Card key={p.plan} className="glass-card flex flex-col p-6">
            <h3 className="font-semibold">{p.plan}</h3>
            <p className="my-2 text-3xl font-bold neon-text">{money(p.precio)}</p>
            <ul className="mb-5 flex-1 space-y-2 text-sm text-muted-foreground">
              {p.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2">
                  <Check className="size-4 text-primary" /> {perk}
                </li>
              ))}
            </ul>
            <Button onClick={() => buy(p.plan, p.precio, p.dias)}>
              {membership ? "Renovar" : "Comprar"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
