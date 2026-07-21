# ProLarva — Contexto para Agentes

> Siempre responder en **español**. Tutear — usar "tú", "tienes", "puedes" — NUNCA voseo. Tono cercano y directo.
> **Leer este archivo completo antes de tocar cualquier cosa.**

---

## Qué es esta app

**ProLarva** es una plataforma web con dos funciones:
1. **Educativa** (módulos): aprendizaje gratuito sobre BSF para productores
2. **Venta** (`/sistema-2015`): landing de la oferta "Kit ProLarva 20/15" (acompañamiento 45d+180d, 4 bonos, garantías)

**URL producción:** https://prolarva-monitor.vercel.app
**Proyecto Vercel:** `juliprojects/prolarva`
**GitHub:** https://github.com/coronelzuth/prolarva (user: coronelzuth, email: coronelzulieth@gmail.com)
**Deploy:** `vercel --prod --yes` desde esta carpeta
**Dueña:** Juliana Coronel — fundadora de ProLarva, Cúcuta Colombia
**WhatsApp ProLarva:** +57 322 321 2293 (`573223212293` en formato WA)
**Sync:** Local = GitHub = Vercel (todo sincronizado, 2026-07-10)

---

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Montserrat** via `next/font/google` (ya configurado en `layout.tsx`)
- **Tailwind CSS v4** instalado pero casi todo usa **inline styles**
- **Vercel Analytics** (`@vercel/analytics/react`) — ya integrado en `layout.tsx`
- **Supabase** (`@supabase/supabase-js`) — base de datos en la nube. `localStorage` se mantiene como caché offline-first
- **Autenticación en `/socios`** — Login/registro contra tabla `socios` en Supabase (no usuarios demo)

## Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL=https://gztaznhtysmkekbbazbd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...  (ver Supabase → Settings → API)
```
Están en `.env.local` (local, ignorado por git) y en Vercel → Settings → Environment Variables.

---

## Rutas actuales

| Ruta | Descripción |
|---|---|
| `/` | Home — bienvenida + 5 módulos + botón compartir |
| `/beneficios` | Intro — beneficios BSF por especie, composición nutricional, ventajas ambientales |
| `/conocimiento` | Módulo 1 — ciclo BSF, grid 3×3 de etapas |
| `/preparacion` | Módulo 2 — quiz diagnóstico + tarjeta recomendación prominente al final |
| `/metas` | Módulo 3 — rutas de producción + links a /cosecha y /calculadora |
| `/cosecha` | Guía Práctica — 7 pasos + panel recomendación calculadora al final |
| `/calculadora` | Calculadora BSF completa (wizard 4 pasos) |
| `/sistema-2015` | Landing de venta — Kit ProLarva 20/15, acompañamiento, bonos, garantías, Juliana |
| `/socios` | Zona privada — tracker de lotes, alimentación y cosechas (sin Larvi ni WhatsApp) |
| `/gracias` | Página post-formulario — confirmación + redirect automático a /calculadora en 4 seg |
| `/contenido` | CMS de guiones — lista de 83 guiones, editor, calendario, cambio de estados |

---

## Estructura de archivos

```
src/
├── app/
│   ├── layout.tsx            # Navbar + FloatingWidgets + Analytics en todas las páginas
│   ├── globals.css           # Paleta navy, Montserrat, reset
│   ├── page.tsx              # Home — 5 módulos (Beneficios Intro + 4 módulos)
│   ├── beneficios/page.tsx   # Intro — beneficios BSF por especie + nutrición + env
│   ├── conocimiento/page.tsx # Módulo 1 — ciclo BSF con modal prev/next
│   ├── preparacion/page.tsx  # Módulo 2 — quiz diagnóstico + recommendation card
│   ├── metas/page.tsx        # Módulo 3 — rutas + links a /cosecha y /calculadora
│   ├── cosecha/page.tsx      # Guía práctica — 7 pasos + panel recomendación calculadora
│   ├── calculadora/page.tsx  # Calculadora wizard completa (React nativo, 4 pasos)
│   ├── socios/page.tsx       # Zona de Socios (login + tracker)
│   └── gracias/page.tsx      # Página de confirmación post-formulario
│
├── components/
│   ├── Navbar.tsx            # Sticky top; 6 links + botón Socios; scroll horizontal en móvil
│   ├── FloatingWidgets.tsx   # Wrapper cliente: renderiza Larvi + WhatsApp en todas las páginas EXCEPTO /socios
│   ├── Larvi.tsx             # Bot flotante bottom-right, árbol de decisión hardcodeado
│   ├── WhatsApp.tsx          # Botón flotante bottom-left → wa.me/573223212293
│   └── ShareButton.tsx       # Botón compartir en Home (WhatsApp share)
│
├── data/
│   ├── stages.ts             # 8 etapas del ciclo BSF con fotos[] y videos[]
│   ├── quiz.ts               # Preguntas del diagnóstico de preparación
│   └── metas.ts              # 3 rutas: pollos, harina, ciclo cerrado
│
├── hooks/
│   ├── useProgress.ts        # Estado global del alumno — localStorage + sync Supabase (device_id)
│   └── useSocios.ts          # Estado de la Zona de Socios — localStorage + sync Supabase (socio_code)
│
└── lib/
    └── supabase.ts           # Cliente Supabase singleton (retorna null si no hay env vars)

public/
├── larvi-mascota.png         # Mascota PNG con fondo transparente (moño rojo)
├── og-image.png              # OG image 1200×630 para redes sociales
└── juliana.jpg               # Foto real de Juliana — usada en /sistema-2015

supabase/
└── schema.sql                # SQL para crear las 4 tablas + políticas RLS en Supabase
```

---

## Paleta de colores

```
Fondo principal:   #0d1b2a
Card primaria:     #152035
Card secundaria:   #1e3050
Fondo profundo:    #0a1628

Verde primario:    #22c55e
Verde claro:       #4ade80
Verde oscuro:      #16a34a
Emerald:           #10b981  (usado en CalculadoraInline y completados)

Texto:             #e2e8f0 / #f1f5f9
Muted:             #94a3b8 / #64748b
Borde eléctrico:   rgba(14,165,233,0.2)

Ámbar (CTA/costo): #f59e0b
Rojo (pérdidas):   #ef4444
```

---

## Componentes clave

### `Navbar.tsx`
Links: Inicio / Conocimiento / Preparación / Mi Meta / Cosecha / Calculadora.
Botón separado `🔐 Socios` con gradiente verde cuando está activo.
Muestra barra de progreso `overallPercent` del hook `useProgress`.
**Móvil (<599px):** scroll horizontal, oculta textos de labels y barra de progreso, solo íconos.

### `Larvi.tsx`
Bot flotante bottom-right. Árbol de decisión hardcodeado (`tree`).
Usa `/larvi-mascota.png`. Botón circular verde con la larvita con moño.

### `WhatsApp.tsx`
Botón flotante bottom-left. Verde WhatsApp #25D366. Link directo a `wa.me/573223212293`.

### `CalculadoraInline.tsx`
Mini-calculadora embebida al final de `/metas`. Solo 3 inputs: especie, gasto mensual en COP.
Muestra ahorro mensual y anual. No reemplaza a `/calculadora`.

### `calculadora/page.tsx`
Wizard completo de 4 pasos portado a React (NO es un iframe).
- Step 1: Seleccionar especie (pollos/cerdos/peces)
- Step 2: Datos del lote (animales, días, precios, mortalidad)
- Step 3: Config BSF (modo compra vs kit, % reemplazo, precio BSF)
- Step 4: Resultados — hero pérdida, desglose, con BSF, beneficios, kit timeline, CTA WhatsApp
Cálculo en `useEffect` que se dispara cuando `step === 4`.

### `socios/page.tsx`
Login con credenciales demo: `SOCIO-2025 / larva123`, `coronelzulieth@gmail.com / prolarva2025`, `PROLARVA-ADMIN / admin2025`.
5 vistas: Resumen, Mis Lotes, Alimentación, Cosechas, Guía Rápida.
Sidebar sticky a `top: 60px` (debajo del Navbar), `height: calc(100vh - 60px)`.
**Móvil (<768px):** sidebar oculto → bottom tab bar fijo + mobile header con nombre y logout.
Estado en `localStorage` via `useSocios`.
**Funcionalidades en detalle de lote:**
- `LoteDetail` tiene botón ✏️ Editar (modal para cambiar nombre/fecha)
- `MiniCalendar`: strip de hitos + botón "📅 Ver calendario" que despliega grid real Lu–Do con emojis de hitos sobre sus fechas. Si el ciclo cruza dos meses se muestran ambos apilados.
- Al crear lote: selector de objetivo (⚖️ Cosechar larvas / 🔄 Continuar camada) que ajusta los hitos del MiniCalendar (día 22: cosecha vs prepupa; día 28/40: fin vs mosca).
- Larvi y WhatsApp NO se renderizan en /socios (ver `FloatingWidgets.tsx`).

### `cosecha/page.tsx`
Guía práctica en 7 pasos totales, divididos en dos secciones:
- **Pasos 1–5 (Meta 1):** Conseguir semilla → Cuna → Eclosión → Traslado → Cosecha (días 15–18)
- **Pasos 6–7 (Meta 3 — ciclo cerrado):** Las prepupas → Trampas de madera con afrecho/aserrín
Patrón: acordeón con `useState<number>` (main) y `useState<number | null>` (ciclo).
Cada paso tiene: descripción, consejos, alertas y sección "Qué registrar".

---

## Hooks

### `useProgress.ts`
Estado global del alumno. localStorage como caché + sync a Supabase tabla `user_progress`.
Clave de sincronización: `device_id` (UUID generado una vez, guardado en localStorage como `prl-device-id`).
Campos: `modulesVisited` / `modulesCompleted` / `stagesViewed` / `quizAnswers` / `quizCompleted` / `selectedMeta`.

### `useSocios.ts`
Estado de la zona privada. localStorage como caché + sync a Supabase tablas `lotes`, `feed_logs`, `cosechas`.
Clave de sincronización: `socio_code` (del login actual).
Tipos: `Lote`, `FeedLog`, `Cosecha`, `SocioSession`.
`Lote` tiene campo opcional `objetivo?: 'cosechar' | 'continuar'` (default `'cosechar'`).
Exports: `BSF_STAGES`, `daysSince(dateStr)`, `getStage(days)`, `uid()`, `useSocios()`.
Retorna: `{ loaded, session, login, logout, lotes, feeds, cosechas, addLote, deleteLote, updateLote, addFeed, addCosecha, activeLotes, readyLotes, totalKg, avgConv }`.

---

## Datos editables

### `data/stages.ts`
```typescript
interface Stage {
  id: string; name: string; emoji: string; duration: string;
  temp: string; humidity: string; color: string;
  description: string; tips: string[]; alerts: string[];
  isHarvestStage?: boolean;
  photos?: string[];   // rutas en /public/fotos/ o URLs externas
  videos?: { title: string; url: string }[];
}
```
**Para agregar fotos reales:** poner archivos en `public/fotos/` y referenciar como `'/fotos/nombre.jpg'`.
**Para agregar videos:** agregar `{ title: 'Nombre', url: 'https://youtube.com/...' }` al array `videos`.

---

## Assets en `/public`

| Archivo | Uso |
|---|---|
| `larvi-mascota.png` | Mascota PNG — NO reemplazar sin avisar |
| `og-image.png` | OG image 1200×630 generada con Python PIL |
| `juliana.jpg` | Foto de Juliana — usada en /sistema-2015 |
| `fotos/*.mp4` | Videos educativos por etapa BSF (excluidos de git, deploy directo con vercel) |

---

## CMS de Contenido — `/contenido`

- Tabla Supabase: `guiones_cms` (SQL en `supabase/guiones_cms.sql`)
- Hook: `src/hooks/useGuionesCms.ts` — sincroniza con Supabase
- Datos base: `src/data/guiones.ts` — 83 guiones con metadatos
- Primera carga: si la tabla está vacía, popula todos los guiones automáticamente
- Campos editables: estado, fecha_programada, plataforma, NC, ángulo, contenido, notas
- **IMPORTANTE:** Ejecutar `supabase/guiones_cms.sql` en Supabase → SQL Editor antes de usar

## Pendientes conocidos

- [ ] **Fotos reales** — infraestructura lista en `stages.ts`, Juliana debe proveer archivos para `public/fotos/`
- [x] **Videos reales** — todas las 8 etapas tienen videos en `public/fotos/` (ver tabla abajo)
- [ ] **URL del VSL** — campo listo en `/landing`, falta el link cuando el video esté listo
- [ ] **Exportar leads en CSV** — tabla `leads` en Supabase ya tiene los datos; falta UI o export desde el dashboard

---

## Comandos útiles

```bash
# Dev local
npm run dev        # http://localhost:3000

# Deploy a producción
vercel --prod --yes

# Si producción no actualiza
vercel --prod --yes --force

# Ver historial de cambios
git log --oneline
```

---

## Historial de commits relevantes

```
d2e7b72  feat: guardar leads del formulario en Supabase
d2c2544  feat: conectar Supabase como base de datos en la nube
c274c82  feat: calculadora CTA en cosecha, calendario real colapsable en socios, FloatingWidgets
29dbc32  feat: intro explicativa en calculadora antes del selector de especie
feb5b92  fix: scroll lock en modal de Metas
e250bff  fix: quiz recommendation selectedMeta → /metas
b90a76a  feat: Groups C y D — /beneficios, quiz recommendation, socios edit+calendar+objetivo
a5cc857  feat: port calculadora BSF a React con paleta de la app
```

---

## Estado actual
> **Actualizar esta sección al final de cada sesión de trabajo.**

**Última actualización:** 2026-07-16

**Qué está funcionando en producción:**
- Todas las rutas desplegadas y accesibles en móvil y desktop
- `/beneficios` — página Intro con beneficios por especie, nutrición, ventajas ambientales; CTA a `/conocimiento`
- `/calculadora` — React nativo, 4 pasos, colores de la app; intro explicativa antes del selector de especie
- `/sistema-2015` — Landing de venta completa (tema navy ProLarva): kit, acompañamiento (45d+180d), 4 bonos, garantías, Juliana, precio, CTA WhatsApp
- `/socios` — login, tracker de lotes/alimentación/cosechas, sidebar desktop + bottom tab bar móvil; calendario real colapsable por lote; edición de nombre/fecha; selector de objetivo al crear lote; sin Larvi ni WhatsApp; **datos sincronizan a Supabase**
- `/metas` — 3 rutas + links a `/cosecha` y `/calculadora`; scroll lock en modal
- `/cosecha` — guía completa 7 pasos + panel recomendación calculadora al final
- `/preparacion` — quiz + tarjeta recomendación prominente al final
- `/conocimiento` — modal con navegación prev/next por etapa, fotos y videos en etapa Huevo
- `/gracias` — confirmación post-formulario + redirect a /calculadora en 4 seg
- Home: 5 módulos + notificación de lotes listos para cosechar
- Navbar: centrado, 7 links (Inicio, Oferta, Conocimiento, Preparación, Mi Meta, Cosecha, Calculadora) + Socios; scroll horizontal en móvil; sin logo "Monitor"
- WhatsApp flotante (+57 322 321 2293), Larvi bot, OG tags, Analytics y Google Search Console activos (excepto en /socios)
- **Supabase** conectado — lotes, feeds, cosechas, progreso y leads se sincronizan en la nube
- `sitemap.xml` generado automáticamente por Next.js
- Título global: "ProLarva" (sin "Monitor")

**Responsive móvil implementado:**
- Navbar: scroll horizontal, oculta texto de labels y barra de progreso (<599px)
- Socios: sidebar → bottom tab bar fijo + mobile header (<768px)
- Calculadora: beneficios en 1 columna (<380px)
- Landing: stats apiladas con separador horizontal (<600px)
- Home: mascota se apila sobre el título (<480px)

**Carpeta de trabajo canónica:**
`C:\Users\HP\Desktop\Zu Office\01 - PROYECTOS\HUB PROLARVA\06 - Apps y Artifacts\prolarva-monitor`

**Supabase — tablas activas:**
| Tabla | Qué guarda |
|---|---|
| `user_progress` | Progreso de módulos por device_id |
| `lotes` | Lotes de producción por socio_code |
| `feed_logs` | Registros de alimentación |
| `cosechas` | Cosechas registradas |
| `leads` | Leads del formulario de /landing (nombre + email) |
| `socios` | Usuarios registrados (codigo, email, nombre, password, estado) — **NUEVO** |

**Cambios recientes (2026-07-16):**
- ✅ **Módulo Diagnóstico oculto** — `/preparacion` sigue activa pero no aparece en navbar ni home (`hidden: true` en `Navbar.tsx` y `page.tsx`)
- ✅ **Videos en todas las etapas BSF** — `data/stages.ts` actualizado con videos locales en `public/fotos/`:
  | Etapa | Videos |
  |---|---|
  | 🥚 Huevo | `huevos.mp4` + `huevos2_web.mp4` (ya existían) |
  | 🐛 L1–L3 | `neonatos.mp4` + `neonato_1dia.mp4` |
  | 🐛 L4 | `estadios.mp4` |
  | ⭐ L5 Cosecha | `biglarvae.mp4` + `grandes.mp4` |
  | 🟤 Prepupa | `prepupas.mp4` + `prepupas2.mp4` |
  | 🫘 Pupa | `pupas.mp4` + `pupas2.mp4` |
  | 🦟 Adulto | `apareamiento.mp4` + `moscagrande3.mp4` + `moscas_fly.mp4` |
  | 🔄 Postura | `postura_huevos.mp4` |
- ✅ **Videos `*.mp4` en `/public/fotos/` excluidos de git** (`.gitignore`) — son muy pesados; se despliegan directo desde local vía `vercel --prod --yes`

**Cambios recientes (2026-07-11 — sesión completa):**
- ✅ **bcryptjs** — passwords hasheadas con salt 10 vía API routes en servidor (nunca texto plano en Supabase)
- ✅ **Login endpoint** — compara contra hash bcrypt; migra contraseñas legadas en texto plano automáticamente al primer login
- ✅ **Sistema de invitaciones** — tabla `invitaciones` en Supabase, endpoints `/api/invitaciones/crear` y `/api/invitaciones/listar`
- ✅ **Columna `rol`** en tabla `socios` (admin/socio); cuenta de Juliana marcada como admin (`admin.zuth`)
- ✅ **Panel Admin** en `/socios` — tab 🔑 visible solo para admin; genera códigos `PRL-XXXXXX`, lista estado usado/disponible, copia link completo al portapapeles
- ✅ **Link mágico de invitación** — `?inv=PRL-XXXXXX` abre registro con código pre-llenado y bloqueado
- ✅ **Registro simplificado** — sin campo "código de socio"; se auto-genera desde el nombre (ej. `CARLOS-X4F2`); solo pide nombre, email y contraseña
- ✅ **Cuenta admin creada** — `admin.zuth` / `prolarva2025` en tabla socios con rol=admin
- ✅ **SQL ejecutado en Supabase** — tabla invitaciones + columna rol + cuenta admin todo activo
- ✅ **Git commits** — 2bc32ae → cb43fc8 → 17ec129 → da79c85 → 265029e
- ✅ **Deploy en producción** — https://prolarva-monitor.vercel.app

**Zona de socios — estado de seguridad:**
- Passwords: hasheadas con bcrypt salt 10 ✅
- Acceso: solo con código de invitación generado por admin ✅
- Admin: rol verificado en servidor antes de cualquier acción privilegiada ✅
- Login: por email o código de socio ✅

**Próxima sesión — pendientes:**
1. **Dashboard admin** — lista de socios registrados (nombre, email, fecha, estado) desde el panel Admin
2. **Exportar datos** — CSV/Excel de lotes y cosechas por socio
3. **Recuperar contraseña** — email reset para socios que olvidan su password
4. **Fotos/videos educativas** — agregar fotos reales en `data/stages.ts` para las 7 etapas restantes

**Cómo arrancar una sesión nueva:**
1. Abre Claude Code desde la carpeta canónica de arriba
2. Di: *"Lee el CLAUDE.md y continuamos"*
3. Pide el cambio directamente

**Resumen de sesión:**
Al inicio de cada sesión: leer `docs/RESUMEN EJECUTIVO - 2026-07-11.txt` (o el más reciente que exista en `docs/`) para retomar desde donde se quedó.
Al cierre de cada sesión: actualizar ese archivo con lo que se hizo, estado actual y pendientes. Sobrescribir el archivo existente — solo importa el más reciente.
