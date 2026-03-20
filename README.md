# Simulacro de examen de manejo

Sistema de reservas para clases de práctica de manejo en Lima, Perú. Los alumnos eligen un horario, completan un formulario y el instructor gestiona todo desde un panel administrativo.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, `output: export`) |
| Estilos | Tailwind CSS v4 |
| Base de datos / Auth | Supabase (PostgreSQL + RLS) |
| Formularios | React Hook Form + Zod |
| Calendario | react-big-calendar + date-fns |
| Mapas | Leaflet + Nominatim (OpenStreetMap) |
| Toasts | sonner |
| PWA | next-pwa |
| Deploy | Cloudflare Pages |

## Requisitos

- Node.js 20+
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Cloudflare Pages](https://pages.cloudflare.com) (para deploy)

## Correr localmente

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd simulacro-manejo

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear .env.local con las variables indicadas abajo

# 4. Correr el servidor de desarrollo
npm run dev
```

La app estará disponible en `http://localhost:3000`.

## Variables de entorno

Crear `.env.local` en la raíz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_WHATSAPP_NUMBER=51987654321
```

- `NEXT_PUBLIC_SUPABASE_URL` → Supabase → Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Supabase → Settings → API → anon public key
- `NEXT_PUBLIC_WHATSAPP_NUMBER` → número con código de país (sin `+`)

## Migraciones de base de datos

Ejecutar en orden desde el **SQL Editor** de Supabase:

```
supabase/migrations/001_schema.sql   → tablas, enum, índices, RLS, función is_admin()
supabase/migrations/002_rpc.sql      → función reserve_slot (transacción atómica)
supabase/migrations/003_seed.sql     → ~70 horarios de ejemplo (próximas 3 semanas)
```

> Si necesitas regenerar el seed:
> ```sql
> delete from bookings;
> delete from time_slots;
> ```

## Crear el primer administrador

1. En Supabase → **Authentication → Users → Add user** (email + contraseña)
2. Ejecutar en el SQL Editor:

```sql
insert into profiles (id, role)
select id, 'admin'
from auth.users
where email = 'admin@tudominio.pe';
```

3. Ingresar al panel desde `/admin/login`

## Deploy en Cloudflare Pages

1. Push del repositorio a GitHub
2. En Cloudflare Pages → **Create a project → Connect to Git**
3. Seleccionar el repositorio
4. Configurar el build:
   - **Build command:** `npm run build`
   - **Output directory:** `out`
   - **Node version:** `20`
5. En **Settings → Environment Variables** agregar las 3 variables
6. **Save and Deploy**

## Estructura del proyecto

```
src/
├── app/
│   ├── (public)/          # Landing + /agendar (layout con Navbar/Footer)
│   └── admin/             # Panel admin (dashboard, reservas, horarios, login)
├── components/
│   ├── landing/           # HeroSection, BenefitsSection, HowItWorks, FAQ
│   ├── shared/            # Navbar, Footer, WhatsAppButton
│   ├── calendar/          # BookingCalendar, SlotEvent
│   ├── booking/           # BookingModal, BookingForm, MapPicker, BookingSuccess
│   └── admin/             # Sidebar, StatsCards, AdminCalendar, BookingTable, SlotManager, BookingDetail
├── hooks/                 # useSlots, useAuth
├── lib/                   # supabase.ts, utils.ts, validations/
└── types/                 # index.ts (TimeSlot, Booking, SlotStatus)
supabase/
└── migrations/            # 001_schema, 002_rpc, 003_seed
public/
├── manifest.json          # PWA manifest
└── icons/                 # icon-192.png, icon-512.png
```

## Generar íconos PWA

```bash
node scripts/gen-icons.mjs
```

Genera `public/icons/icon-192.png`, `icon-512.png` y `public/apple-touch-icon.png` con fondo azul `#1d4ed8`. Reemplazar con íconos reales antes de producción.
