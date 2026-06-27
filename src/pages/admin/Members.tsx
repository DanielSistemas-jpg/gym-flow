import { useState } from "react";
import { useStore, store } from "@/lib/store";
import { PageHeader, MembershipBadge } from "@/components/Ui";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { UserPlus, KeyRound, Trash2, Power, Ticket } from "lucide-react";
import { money } from "@/lib/format";

export default function AdminMembers() {
  const profiles = useStore((s) => s.profiles);
  const memberships = useStore((s) => s.memberships);
  const visitors = useStore((s) => s.visitors);
  const members = profiles.filter((p) => p.role === "user");

  const [form, setForm] = useState({ nombre: "", email: "", dni: "", telefono: "" });
  const [open, setOpen] = useState(false);
  const [visitorForm, setVisitorForm] = useState({ nombre: "", dni: "", precio: 15 });
  const [vOpen, setVOpen] = useState(false);

  function createMember() {
    if (!form.nombre || !form.email) return toast.error("Completa nombre y correo");
    const p = store.addMember(form);
    toast.success(`Socio creado. PIN de respaldo: ${p.pin}`);
    setForm({ nombre: "", email: "", dni: "", telefono: "" });
    setOpen(false);
  }

  function createVisitor() {
    if (!visitorForm.nombre) return toast.error("Ingresa el nombre");
    const v = store.addVisitor(visitorForm);
    toast.success(`Visitante registrado. PIN del día: ${v.pin}`);
    setVisitorForm({ nombre: "", dni: "", precio: 15 });
    setVOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Gestión de socios"
        subtitle="Registra, edita y administra membresías"
        action={
          <div className="flex gap-2">
            <Dialog open={vOpen} onOpenChange={setVOpen}>
              <DialogTrigger asChild>
                <Button variant="outline"><Ticket className="size-4" /> Visitante del día</Button>
              </DialogTrigger>
              <DialogContent className="glass-card">
                <DialogHeader><DialogTitle>Registrar visitante (pase diario)</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <FieldRow label="Nombre" value={visitorForm.nombre} onChange={(v) => setVisitorForm({ ...visitorForm, nombre: v })} />
                  <FieldRow label="DNI" value={visitorForm.dni} onChange={(v) => setVisitorForm({ ...visitorForm, dni: v })} />
                  <FieldRow label="Precio (S/)" value={String(visitorForm.precio)} onChange={(v) => setVisitorForm({ ...visitorForm, precio: Number(v) || 0 })} />
                </div>
                <DialogFooter><Button onClick={createVisitor}>Registrar y generar PIN</Button></DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button><UserPlus className="size-4" /> Nuevo socio</Button>
              </DialogTrigger>
              <DialogContent className="glass-card">
                <DialogHeader><DialogTitle>Registrar nuevo socio</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <FieldRow label="Nombre completo" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} />
                  <FieldRow label="Correo" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                  <FieldRow label="DNI" value={form.dni} onChange={(v) => setForm({ ...form, dni: v })} />
                  <FieldRow label="Teléfono" value={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} />
                </div>
                <DialogFooter><Button onClick={createMember}>Crear socio</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <Card className="glass-card overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Socio</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead>Membresía</TableHead>
              <TableHead>PIN</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m) => {
              const mem = memberships.find((x) => x.userId === m.id);
              const active = mem?.status === "activa";
              return (
                <TableRow key={m.id}>
                  <TableCell>
                    <p className="font-medium">{m.nombre}</p>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </TableCell>
                  <TableCell>{m.dni || "—"}</TableCell>
                  <TableCell>{mem ? <MembershipBadge status={mem.status} /> : <span className="text-xs text-muted-foreground">Sin plan</span>}</TableCell>
                  <TableCell className="font-mono tracking-widest">{m.pin}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" title="Activar/Desactivar"
                        onClick={() => { store.setMembershipActive(m.id, !active); toast.success(active ? "Membresía desactivada" : "Membresía activada"); }}>
                        <Power className={active ? "size-4 text-green-400" : "size-4 text-muted-foreground"} />
                      </Button>
                      <Button size="icon" variant="ghost" title="Regenerar PIN"
                        onClick={() => { const pin = store.regeneratePin(m.id); toast.success(`Nuevo PIN: ${pin}`); }}>
                        <KeyRound className="size-4" />
                      </Button>
                      <Button size="icon" variant="ghost" title="Eliminar"
                        onClick={() => { store.removeMember(m.id); toast.success("Socio eliminado"); }}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {visitors.length > 0 && (
        <Card className="glass-card mt-6 p-5">
          <h3 className="mb-3 font-semibold">Visitantes del día</h3>
          <div className="space-y-2">
            {visitors.map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded-lg bg-accent/40 px-3 py-2 text-sm">
                <span className="font-medium">{v.nombre}</span>
                <span className="text-xs text-muted-foreground">DNI {v.dni || "—"} · {money(v.precio)}</span>
                <span className="font-mono tracking-widest text-primary">PIN {v.pin}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function FieldRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
