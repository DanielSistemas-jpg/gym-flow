# 🏋️ Gym Evolution — Huánuco

Plataforma web profesional de control de acceso, membresías y monitoreo en tiempo real para **Evolution GYM Huánuco**. Construida con **React + Vite + TypeScript** en el frontend y **Supabase** como backend (autenticación, base de datos, almacenamiento y realtime). Lista para desplegar en **Vercel**.

> 💡 La app funciona **en modo demo** con datos locales si no configuras Supabase. Para producción, sigue los pasos de abajo.

---

## ✨ Características

- **Tema oscuro deportivo** (rojo neón `#D31413`, gris `#8B8C8D`, oscuro `#1C1C1C`).
- **Dos roles**: Administrador y Usuario.
- **Usuario**: perfil, membresías (comprar/renovar), estado de membresía, historial y calendario de asistencias, eventos, notificaciones, ingreso por PIN/DNI.
- **Admin**: dashboard en tiempo real, gestión de socios, control de acceso (huella + PIN de contingencia), gestión de dispositivos con logs y consola de diagnóstico, alertas (Email/WhatsApp), gestión de contenido/eventos, visitantes del día.
- **Tiempo real** simulado en demo y vía Supabase Realtime en producción.

---

## 🚀 Requisitos previos

- [Node.js](https://nodejs.org) 18+ (o [Bun](https://bun.sh))
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Vercel](https://vercel.com)
- Cuenta de [GitHub](https://github.com)

---

## 🖥️ Desarrollo local

```bash
# 1. Clona el repositorio
git clone https://github.com/TU_USUARIO/gym-evolution.git
cd gym-evolution

# 2. Instala dependencias
npm install        # o: bun install

# 3. (Opcional) configura variables de entorno
cp .env.example .env
# completa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY

# 4. Inicia el servidor de desarrollo
npm run dev        # o: bun run dev
```

La app queda disponible en `http://localhost:8080`.

### Acceso demo (sin Supabase)
- **Administrador**: botón *“Entrar como Admin”* en la página de login.
- **Usuario**: botón *“Entrar como Usuario”*.

---

## 🗄️ Configurar Supabase (backend)

### 1. Crea el proyecto
1. Entra a [supabase.com](https://supabase.com) → **New project**.
2. Elige nombre, contraseña de base de datos y región (recomendado: South America).
3. Espera a que el proyecto termine de aprovisionarse.

### 2. Crea las tablas y la seguridad (RLS)
1. En el panel de Supabase ve a **SQL Editor → New query**.
2. Copia y pega TODO el contenido de [`supabase/schema.sql`](./supabase/schema.sql).
3. Pulsa **Run**. Esto crea todas las tablas (perfiles, membresías, asistencias, eventos, dispositivos, logs_hardware, errores, alertas, visitantes, pagos, configuraciones, pines_emergencia, notificaciones), las políticas **RLS** y habilita **Realtime**.

### 3. Obtén las credenciales
1. Ve a **Project Settings → API**.
2. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`
3. Pégalas en tu archivo `.env` local (y luego en Vercel).

### 4. Configura el login con Google (solo administrador)
1. En Supabase: **Authentication → Providers → Google → Enable**.
2. En [Google Cloud Console](https://console.cloud.google.com): crea credenciales OAuth 2.0.
   - **Authorized redirect URI**: `https://TU-PROYECTO.supabase.co/auth/v1/callback`
3. Copia el **Client ID** y **Client Secret** en Supabase y guarda.
4. En **Authentication → URL Configuration**, agrega tu dominio de Vercel a *Site URL* y *Redirect URLs*.

### 5. Crea el primer administrador
Regístrate con Google/email y luego, en **SQL Editor**, ejecuta:
```sql
update perfiles set role = 'admin' where email = 'tucorreo@gmail.com';
```

---

## ▲ Desplegar en Vercel

### Opción A — Desde la interfaz de Vercel (recomendado)
1. Sube el proyecto a un repositorio de **GitHub**.
2. En [vercel.com](https://vercel.com) → **Add New → Project** → importa el repo.
3. Vercel detecta Vite automáticamente:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. En **Environment Variables** agrega:
   | Nombre | Valor |
   |---|---|
   | `VITE_SUPABASE_URL` | tu Project URL |
   | `VITE_SUPABASE_ANON_KEY` | tu anon public key |
5. Pulsa **Deploy**.

El archivo [`vercel.json`](./vercel.json) ya incluye el *rewrite* para que el enrutado SPA (React Router) funcione correctamente.

### Opción B — Desde la CLI
```bash
npm i -g vercel
vercel            # configura el proyecto
vercel --prod     # despliegue a producción
```
Recuerda agregar las variables de entorno con `vercel env add`.

---

## 📁 Estructura del proyecto

```
src/
├── components/      # Componentes reutilizables (UI, layout)
├── contexts/        # AuthContext (Supabase + demo)
├── lib/             # supabase.ts, store.ts, types.ts, mock-data.ts, format.ts
├── pages/
│   ├── user/        # Dashboard, Membership, Attendance, Events, Notifications, Profile
│   └── admin/       # Dashboard, Members, Access, Devices, Alerts, Content
supabase/
└── schema.sql       # Esquema completo + RLS + Realtime
vercel.json          # Rewrites para SPA
.env.example         # Plantilla de variables de entorno
```

---

## 🔔 Integraciones opcionales

- **WhatsApp (Twilio)**: configura tus credenciales en una Supabase Edge Function y dispara mensajes desde el evento de caída de lector (tabla `alertas`). La UI ya está preparada en *Admin → Alertas*.
- **Email**: configura SMTP en Supabase o un proveedor (Resend/SendGrid) vía Edge Function.

---

## 📝 Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (`dist/`) |
| `npm run preview` | Previsualiza el build |

---

Hecho con ❤️ para **Evolution GYM Huánuco**.
