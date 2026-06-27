import { useState } from "react";
import { useStore, store } from "@/lib/store";
import { PageHeader } from "@/components/Ui";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { fmtDate } from "@/lib/format";
import { Plus, Pencil, Trash2, CalendarDays } from "lucide-react";
import type { GymEvent } from "@/lib/types";

const empty = { titulo: "", descripcion: "", fecha: new Date().toISOString().slice(0, 10) };

export default function AdminContent() {
  const events = useStore((s) => s.events);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GymEvent | null>(null);
  const [form, setForm] = useState(empty);

  function openNew() {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  }
  function openEdit(e: GymEvent) {
    setEditing(e);
    setForm({ titulo: e.titulo, descripcion: e.descripcion, fecha: e.fecha.slice(0, 10) });
    setOpen(true);
  }
  function save() {
    if (!form.titulo) return toast.error("Ingresa un título");
    if (editing) {
      store.updateEvent(editing.id, { ...form, fecha: new Date(form.fecha).toISOString() });
      toast.success("Evento actualizado");
    } else {
      store.addEvent({ ...form, fecha: new Date(form.fecha).toISOString() });
      toast.success("Evento publicado");
    }
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Gestión de contenido"
        subtitle="Eventos y anuncios mostrados en la página principal"
        action={<Button onClick={openNew}><Plus className="size-4" /> Nuevo evento</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <Card key={e.id} className="glass-card p-5">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <CalendarDays className="size-4" />
              <span className="text-xs font-semibold uppercase">{fmtDate(e.fecha)}</span>
            </div>
            <h3 className="font-semibold">{e.titulo}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{e.descripcion}</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => openEdit(e)}><Pencil className="size-4" /> Editar</Button>
              <Button size="sm" variant="ghost" onClick={() => { store.removeEvent(e.id); toast.success("Evento eliminado"); }}>
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-card">
          <DialogHeader><DialogTitle>{editing ? "Editar evento" : "Nuevo evento"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Título</Label>
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Fecha</Label>
              <Input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
            </div>
          </div>
          <DialogFooter><Button onClick={save}>{editing ? "Guardar" : "Publicar"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
