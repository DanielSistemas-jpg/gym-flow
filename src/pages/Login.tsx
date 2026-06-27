import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dumbbell, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const { signIn, signUp, signInWithGoogle, demoMode } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");

  async function go(action: "in" | "up") {
    setLoading(true);
    const res =
      action === "in" ? await signIn(email, password) : await signUp(email, password, nombre);
    setLoading(false);
    if (res.error) return toast.error(res.error);
    toast.success("Bienvenido a Gym Evolution");
    navigate("/app");
  }

  async function google() {
    const res = await signInWithGoogle();
    if (res.error) return toast.error(res.error);
    if (demoMode) navigate("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="glass-card w-full max-w-md p-7">
        <Link to="/" className="mb-6 flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary shadow-[var(--shadow-glow)]">
            <Dumbbell className="size-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-bold leading-tight">Gym Evolution</p>
            <p className="text-xs text-muted-foreground">Huánuco</p>
          </div>
        </Link>

        {demoMode && (
          <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
            Modo demo (sin Supabase). Usa <b>admin@evolution.com</b> para administrador o{" "}
            <b>user@evolution.com</b> para socio. Cualquier contraseña funciona.
          </div>
        )}

        <Tabs defaultValue="in">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="in">Ingresar</TabsTrigger>
            <TabsTrigger value="up">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="in" className="space-y-4 pt-4">
            <Field id="email" label="Correo" type="email" value={email} onChange={setEmail} />
            <Field id="pass" label="Contraseña" type="password" value={password} onChange={setPassword} />
            <Button className="w-full" disabled={loading} onClick={() => go("in")}>
              {loading && <Loader2 className="size-4 animate-spin" />} Ingresar
            </Button>
          </TabsContent>

          <TabsContent value="up" className="space-y-4 pt-4">
            <Field id="nombre" label="Nombre completo" value={nombre} onChange={setNombre} />
            <Field id="email2" label="Correo" type="email" value={email} onChange={setEmail} />
            <Field id="pass2" label="Contraseña" type="password" value={password} onChange={setPassword} />
            <Button className="w-full" disabled={loading} onClick={() => go("up")}>
              {loading && <Loader2 className="size-4 animate-spin" />} Crear cuenta
            </Button>
          </TabsContent>
        </Tabs>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> o <div className="h-px flex-1 bg-border" />
        </div>
        <Button variant="outline" className="w-full" onClick={google}>
          Continuar con Google (Administrador)
        </Button>
      </Card>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
