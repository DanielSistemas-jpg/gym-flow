import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/format";
import { Dumbbell, Fingerprint, ShieldCheck, Activity, CalendarDays } from "lucide-react";
import hero from "@/assets/hero.jpg";

export default function Landing() {
  const events = useStore((s) => s.events);

  return (
    <div className="min-h-screen">
      <header className="container flex items-center justify-between py-5">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary shadow-[var(--shadow-glow)]">
            <Dumbbell className="size-5 text-primary-foreground" />
          </div>
          <span className="font-bold">Gym Evolution</span>
        </div>
        <Button asChild>
          <Link to="/login">Ingresar</Link>
        </Button>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={hero}
          alt="Interior del gimnasio Gym Evolution con iluminación neón roja"
          width={1536}
          height={1024}
          className="absolute inset-0 size-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="container relative py-24 text-center md:py-36">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Huánuco · Perú
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
            Evoluciona tu cuerpo, <span className="neon-text">controla tu acceso</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground md:text-lg">
            Control de acceso biométrico con respaldo por PIN, monitoreo en tiempo real y gestión
            completa de membresías.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/login">Soy socio</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Panel administrador</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container grid gap-4 py-16 md:grid-cols-4">
        {[
          { icon: Fingerprint, t: "Acceso biométrico", d: "Lectura de huella simulada en segundos." },
          { icon: ShieldCheck, t: "Contingencia por PIN", d: "Nunca detengas el ingreso aunque falle el lector." },
          { icon: Activity, t: "Tiempo real", d: "Dashboard con ingresos y alertas en vivo." },
          { icon: CalendarDays, t: "Membresías", d: "Renueva y controla tu vigencia fácilmente." },
        ].map((f) => (
          <Card key={f.t} className="glass-card p-6">
            <f.icon className="mb-3 size-7 text-primary" />
            <h3 className="font-semibold">{f.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
          </Card>
        ))}
      </section>

      {/* Events */}
      <section className="container py-10">
        <h2 className="mb-6 text-2xl font-bold">Próximos eventos</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {events.map((e) => (
            <Card key={e.id} className="glass-card p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {fmtDate(e.fecha)}
              </p>
              <h3 className="mt-2 font-semibold">{e.titulo}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{e.descripcion}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="container border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Gym Evolution Huánuco. Todos los derechos reservados.
      </footer>
    </div>
  );
}
