import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { MembershipStatus, DeviceStatus, AccessResult } from "@/lib/types";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  tone?: "default" | "primary" | "success" | "warning";
}) {
  const tones = {
    default: "text-foreground",
    primary: "text-primary",
    success: "text-[var(--color-success)]",
    warning: "text-[var(--color-warning)]",
  };
  return (
    <Card className="glass-card flex flex-row items-center justify-between gap-4 p-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={cn("mt-1 text-2xl font-bold", tones[tone])}>{value}</p>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className={cn("flex size-11 items-center justify-center rounded-xl bg-accent", tones[tone])}>
        <Icon className="size-5" />
      </div>
    </Card>
  );
}

const membershipMap: Record<MembershipStatus, { label: string; cls: string }> = {
  activa: { label: "Activa", cls: "bg-green-500/15 text-green-400 border-green-500/30" },
  por_vencer: { label: "Por vencer", cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  vencida: { label: "Vencida", cls: "bg-red-500/15 text-red-400 border-red-500/30" },
};
const deviceMap: Record<DeviceStatus, { label: string; cls: string }> = {
  activo: { label: "Activo", cls: "bg-green-500/15 text-green-400 border-green-500/30" },
  mantenimiento: { label: "Mantenimiento", cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  caido: { label: "Caído", cls: "bg-red-500/15 text-red-400 border-red-500/30" },
};
const accessMap: Record<AccessResult, { label: string; cls: string }> = {
  permitido: { label: "Permitido", cls: "bg-green-500/15 text-green-400 border-green-500/30" },
  vencida: { label: "Membresía vencida", cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  denegado: { label: "Denegado", cls: "bg-red-500/15 text-red-400 border-red-500/30" },
  pin: { label: "PIN contingencia", cls: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
};

export function MembershipBadge({ status }: { status: MembershipStatus }) {
  const m = membershipMap[status];
  return <Badge variant="outline" className={m.cls}>{m.label}</Badge>;
}
export function DeviceBadge({ status }: { status: DeviceStatus }) {
  const m = deviceMap[status];
  return <Badge variant="outline" className={m.cls}>{m.label}</Badge>;
}
export function AccessBadge({ result }: { result: AccessResult }) {
  const m = accessMap[result];
  return <Badge variant="outline" className={m.cls}>{m.label}</Badge>;
}
