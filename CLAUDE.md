# ProLarva — Contexto para Agentes

> Siempre responder en **español**. Tutear — usar "tú", "tienes", "puedes" — NUNCA voseo. Tono cercano y directo.
> **Leer este archivo completo antes de tocar cualquier cosa.**

---

## Qué es esta app

**ProLarva** es una plataforma web con dos funciones:
1. **Educativa** (módulos): aprendizaje gratuito sobre BSF para productores
2. **Venta** (`/sistema-2015`): landing de la oferta "Kit ProLarva 25/15" (acompañamiento 45d+180d, 4 bonos, garantías)

**URL producción:** https://prolarva.co
**Proyecto Vercel:** `juliprojects/prolarva`
**GitHub:** https://github.com/coronelzuth/prolarva (user: coronelzuth, email: coronelzulieth@gmail.com)
**Deploy:** `vercel --prod --yes` desde esta carpeta
**Dueña:** Juliana Coronel — fundadora de ProLarva, Cúcuta Colombia
**WhatsApp ProLarva:** +57 322 321 2293 (`573223212293` en formato WA)
**Sync:** Local = GitHub = Vercel (todo sincronizado, 2026-07-29)

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
| `/kit` | Landing de venta — Kit ProLarva 25/15, color ámbar (#f59e0b). Reemplaza /sistema-2015 en el navbar |
| `/colonia` | Landing del Programa Colonia — grupal 4 semanas, $400K COP, color verde (#22c55e), sección "Red de Productores" |
| `/sistema-2015` | Landing de venta legacy — aún accesible por URL directa |
| `/socios` | Zona privada — tracker de lotes, alimentación, cosechas y panel Escuela (sin Larvi ni WhatsApp) |
| `/gracias` | Página post-formulario — confirmación + redirect automático a /calculadora en 4 seg |
| `/blog` | Hub del blog — cuadrícula filtrable por categoría (Problemas, Nutrición, Manejo). 3 artículos publicados |
| `/blog/problemas` | 8 problemas comunes en cría BSF — acordeón expandible + botones compartir (copiar enlace / WhatsApp) |
| `/blog/raciones` | Raciones por animal y etapa — selector de especie (pollos/gallinas/cerdos/peces), tablas, tips + compartir |
| `/blog/alimentacion-larvas` | Qué comen las larvas BSF — sustratos, porciones por etapa del ciclo, qué evitar, variación proteica + compartir |
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
│   ├── blog/page.tsx                      # Hub blog — cuadrícula con filtro por categoría
│   ├── blog/problemas/page.tsx            # 8 problemas BSF con acordeón + compartir
│   ├── blog/raciones/page.tsx             # Raciones por animal/etapa con selector + compartir
│   ├── blog/alimentacion-larvas/page.tsx  # Sustratos, porciones, qué evitar, proteína + compartir
│   ├── calculadora/page.tsx  # Calculadora wizard completa (React nativo, 4 pasos)
│   ├── kit/page.tsx          # Landing Kit ProLarva 25/15 — color ámbar #f59e0b
│   ├── colonia/page.tsx      # Landing Programa Colonia — color verde #22c55e
│   ├── socios/page.tsx       # Zona de Socios (login + tracker + escuela)
│   ├── socios/EscuelaView.tsx # Panel Escuela — clases, plantillas, foro, progreso admin
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
│   ├── useSocios.ts          # Estado de la Zona de Socios — localStorage + sync Supabase (socio_code)
│   └── useEscuela.ts         # Estado del panel Escuela — clases, progreso, plantillas, foro (Supabase directo)
│
└── lib/
    └── supabase.ts           # Cliente Supabase singleton (retorna null si no hay env vars)

public/
├── larvi-mascota.png         # Mascota PNG con fondo transparente (moño rojo)
├── og-image.png              # OG image 1200×630 para redes sociales
└── juliana.jpg               # Foto real de Juliana — usada en /sistema-2015

supabase/
├── schema.sql                # SQL tablas base: user_progress, lotes, feed_logs, cosechas
└── escuela.sql               # SQL tablas Escuela: clases, progreso_clases, plantillas, foro_posts, foro_likes
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
Links: Inicio / Kit / Conocimiento / Mi Meta / Cosecha / Calculadora / Blog + botón 🔐 Socios.
**IMPORTANTE:** Dentro de `/socios` el navbar retorna `null` — no se renderiza. La zona de socios tiene su propia navegación (sidebar desktop + bottom bar móvil).
**Móvil (<599px):** scroll horizontal, oculta labels, solo íconos.

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
Login por email o código de socio. Cuentas admin: `admin.zuth/prolarva2025`, `admin/pl2025`.
**Nav:** 6 tabs — 🏠 Resumen, 📦 Mis Lotes, 🎓 Escuela, 📊 Estadísticas, 👤 Mi Perfil, 🔑 Admin (solo admin).
Sidebar sticky a `top: 0`, `height: 100vh` (navbar oculto en /socios desde 2026-07-29).
**Móvil (<768px):** sidebar oculto → bottom tab bar fijo.
Estado en `localStorage` via `useSocios`.
**PerfilView — sección Herramientas:** botones 📋 Guía Rápida BSF / 🗺️ Ver guía de la app / 🗑️ Limpiar mis datos.
**PerfilView — Cambiar contraseña:** colapsable con toggle. Por defecto cerrado, se expande al tocar "🔐 Cambiar contraseña ▾".
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

### `useEscuela.ts`
Estado del panel Escuela. Consultas directas a Supabase (sin localStorage).
Clave de sincronización: `socio_code`.
Tipos: `Clase`, `ProgresoClase`, `Plantilla`, `ForoPost`.
Retorna: `{ loaded, clases, progreso, plantillas, posts, marcarVisto, publicarPost, toggleLike, guardarClase, eliminarClase, guardarPlantilla, eliminarPlantilla, eliminarPost, clasesPorSemana, plantillasPorSemana, estaVisto, totalClases, totalVistos, reload }`.
**Tablas Supabase:** `clases`, `progreso_clases`, `plantillas`, `foro_posts`, `foro_likes` (SQL en `supabase/escuela.sql`).

### `EscuelaView.tsx` (`src/app/socios/`)
Panel Escuela completo. Props: `{ socioCode, socioNombre, isAdmin }`.
**Secciones:**
- **Clases** — iframe YouTube embed por semana. Admin: agregar/editar/activar. Estudiante: marcar como vista.
- **Plantillas** — PDFs descargables por semana. Admin sube URL (Google Drive u otro).
- **Foro** — estilo Twitter. Textarea arriba + feed cronológico inverso. Likes ❤️. Eliminar (autor o admin).
- **Progreso** (solo admin) — tabla de todos los socios activos con ✅/⬜ por clase activa y % completado.
**Desktop:** sidebar propio de 176px (semanas + sub-items + foro + progreso admin).
**Móvil:** tabs horizontales superiores (Sem 1/2/3/4 + Foro) + sub-tabs (Clase / Plantillas).

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
- [x] **Exportar leads en CSV** — Tab Leads en AdminView con lista + CSV export. Tabla `leads` SQL en `supabase/leads.sql` (ejecutar en Supabase)
- [ ] **Google Analytics 4** — instalar para tener datos históricos de visitas al blog dentro del panel admin. Vercel Analytics plan gratuito no expone API de lectura. GA4 es gratuito y tiene API. Requiere: crear propiedad en analytics.google.com, agregar script en `layout.tsx`, crear API route que consulte GA4 Reporting API y mostrar en tab Blog del AdminView.

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

**Última actualización:** 2026-07-30

**Cambios recientes (2026-07-30 — sesión 16):**
- ✅ **Cronograma de la Escuela** — nueva tab "📅 Cronograma" como vista principal de la Escuela. Grid de 4 columnas (una por semana), colapsable por semana, días individuales con tipo de actividad. Panel expandible inline al hacer clic en un día: clase (embed YouTube + marcar vista), tarea (entrega), recurso (PDFs).
- ✅ **Sem 1-4 ocultas para socios** — los tabs/items de navegación de semanas desaparecen para socios. Solo el admin los ve en sección "Gestionar". Vista inicial cambiada a 'cronograma'.
- ✅ **Push recordatorio cronograma** — endpoint `/api/push/cronograma-reminder` envía push a todos los suscritos con la próxima actividad activa del cronograma. Botón "📲 Enviar recordatorio" en el panel admin del cronograma.
- ✅ **Tabla `cronograma_dias`** — campos: id, fecha, semana, tipo (clase/tarea/reporte/recurso/libre), titulo, descripcion, orden, activo. SQL en `supabase/cronograma_escuela.sql` (ya ejecutado).
- ✅ **`useEscuela.ts`** — nuevo tipo `DiaCronograma` + `TipoDia`, métodos `guardarDia` y `eliminarDia`, fetch de `cronograma_dias` en `load()`.

**Cambios recientes (2026-07-30 — sesión 15):**
- ✅ **Panel "Mis Ventas" para socios** — Nueva vista `💰 ventas` en la zona de socios. Stats del mes (ingresos COP, kg vendidos, precio promedio). Lista de ventas. Modal para registrar: producto (larva/harina/abono), kg, precio/kg, comprador, notas. Conectado a Supabase tabla `ventas_socios` via `useSocios`. SQL en `supabase/ventas_socios.sql`.
- ✅ **Recuperar contraseña (Resend)** — Flujo completo: "¿Olvidaste tu contraseña?" en login → ingresa email → recibe enlace por Resend. Token de 1 hora en tabla `password_resets`. URL: `https://prolarva.co/socios?reset=TOKEN`. Pantalla `ResetPasswordScreen` inline. SQL en `supabase/password_resets.sql`. **Requiere: crear cuenta Resend, obtener RESEND_API_KEY, agregar a Vercel, verificar dominio prolarva.co en Resend.**
- ✅ **Resend instalado** — `resend@6.18.1` en package.json.

**Cambios recientes (2026-07-30 — sesión 14):**
- ✅ **Admin → botón dentro de Perfil** — Quitado de `navItems`. Aparece como botón ámbar en sección "Administración" de `PerfilView` solo para `rol === 'admin'`. Evita overflow en bottom nav móvil.
- ✅ **Sidebar avatar personalizado** — Estado `sidebarAvatar` en `SociosInner`. Se carga desde `localStorage` al login y se sincroniza via `CustomEvent('prl-avatar-changed')` cuando el socio cambia su foto en Perfil.
- ✅ **AlimentacionView eliminada** — Código muerto borrado (~20 líneas).

**Cambios recientes (2026-07-29 — sesión 13):**
- ✅ **Navbar oculto en /socios** — `Navbar.tsx` retorna `null` cuando `pathname.startsWith('/socios')`. La zona de socios tiene su propia nav y no necesita el navbar global. Sidebar ajustado a `top: 0` / `height: 100vh`.
- ✅ **Panel Escuela** — nuevo tab 🎓 en la zona de socios. Componente `EscuelaView.tsx` con hook `useEscuela.ts`. 5 tablas nuevas en Supabase (ejecutar `supabase/escuela.sql`).
- ✅ **Clases por semana** — admin agrega clases con URL de YouTube, título, descripción y flag activa/inactiva. Estudiantes ven el iframe embed y marcan como vista.
- ✅ **Plantillas PDF** — admin sube link (Google Drive u otro) con título y tamaño. Estudiantes descargan con un tap.
- ✅ **Foro estilo Twitter** — textarea + publicar, feed cronológico inverso, likes ❤️, eliminar (autor o admin). Máx 500 chars por post.
- ✅ **Progreso admin** — tabla de socios activos × clases activas con ✅/⬜ y % completado por estudiante.

**Cambios recientes (2026-07-29 — sesión 12):**
- ✅ **Dominio prolarva.co** — todos los URLs hardcodeados actualizados en layout.tsx, sitemap.ts, ShareButton.tsx, calculadora, blog, sistema-2015, socios, kit
- ✅ **Página /kit** — nueva landing del Kit ProLarva 25/15 con color ámbar (#f59e0b). Navbar: enlace "💰 Kit" → /kit (reemplaza "Oferta" → /sistema-2015)
- ✅ **Página /colonia** — landing del Programa Colonia con color verde (#22c55e). Sección "Red de Productores" con 4 cards, bono "Red de Contactos BSF", framing de red en comparativa, "Ideal si" y CTA final
- ✅ **Diferenciación /kit vs /colonia** — /kit: ámbar. /colonia: verde + sección exclusiva de red. Ambas incluyen semilla BSF viva ✅

**Cambios recientes (2026-07-29 — sesión 11):**
- ✅ **Modo demo rediseñado** — login screen con hero compacto, login form visible por defecto como acción primaria, botón demo outline ámbar secundario, preview de 4 secciones al fondo (discreta)
- ✅ **Bypass demo sin Supabase** — `useSocios.ts`: cuando code === 'DEMO' ya no llama a `/api/socios/login`; entra directo con sesión local + datos demo precargados
- ✅ **Banner demo sticky** — barra ámbar fija bajo el navbar con texto "MODO DEMO · Nada se guarda en el servidor" y botón "Salir del demo"
- ✅ **CSS padding refactor** — `.socios-content` maneja el padding del área de contenido (antes estaba en inline style del `<main>`); mobile override en CSS
- ✅ **Login card siempre visible** — eliminado el toggle colapsable del formulario de login

**Última actualización:** 2026-07-25

**Cambios recientes (2026-07-25 — sesión 10):**
- ✅ **Navbar: link 📋 Contenido solo admin** — lee `prl-session` de localStorage; visible solo cuando `rol === 'admin'`
- ✅ **Lotes + Cosechas unificados** — tab "Cosechas" eliminado del nav (4 tabs). Cosechas visibles y registrables dentro de `LoteDetail` con kg totales del lote
- ✅ **Mobile header eliminado** — quitado el bloque nombre + "Salir" sobre el contenido en móvil (redundante con tab Perfil)
- ✅ **Tour actualizado** — paso cosecha fusionado con lotes

**Cambios recientes (2026-07-25 — sesión 9):**
- ✅ **Notificaciones push funcionando end-to-end** — suscripción desde browser, guardado en Supabase, envío desde servidor confirmado en dispositivo real
- ✅ **VAPID keys regeneradas** — keys limpias con `web-push`; clave pública hardcodeada en `socios/page.tsx` (elimina dependencia del env var); Vercel actualizado con nuevo par
- ✅ **RLS fix `push_subscriptions`** — política `allow_all_anon` ejecutada en Supabase SQL Editor; antes bloqueaba INSERT del anon key silenciosamente
- ✅ **`urgency: 'high'`** — ambos endpoints de `/api/push/notify` ahora envían con prioridad alta a FCM
- ✅ **Service worker v4** — fuerza descarte del caché v3 en todos los navegadores
- ✅ **Ícono PWA** — `icon-192.png` e `icon-512.png` reemplazados con Larvi (`LARVI.png`) sobre fondo verde #22c55e. Pendiente: reescalar con más padding y probar fondo negro/blanco
- ✅ **Cuentas admin limpiadas** — eliminadas cuentas demo viejas (PROLARVA-ADMIN, SOCIO-2025, coronelzulieth@gmail.com); admins activos: `admin.zuth`/`prolarva2025` y `admin`/`pl2025`
- ⚠️ **Notificaciones flotantes en Android** — por defecto Android pone Chrome en "Silenciosa"; el socio debe mantener presionada la notificación → ⚙️ → Importancia → **Urgente** para que aparezcan en pantalla

**Cambios recientes (2026-07-25 — sesión 8):**
- ✅ **`/contenido` desplegado** — CMS de guiones activo en producción. Lista los 83 guiones, filtra por tipo/estado/búsqueda, panel lateral de edición, vista calendario
- ✅ **Tabla `guiones_cms` en Supabase** — ya ejecutada. Primera carga auto-popula los 83 guiones desde `src/data/guiones.ts`
- ✅ **Git commit:** incluye api/anuncios, api/leads/actualizar, api/push/notify-all, api/socios/toggle-estado, admin-migrations.sql y demás cambios acumulados

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
| Tabla | Qué guarda | SQL |
|---|---|---|
| `user_progress` | Progreso de módulos por device_id | schema.sql |
| `lotes` | Lotes de producción por socio_code | schema.sql |
| `feed_logs` | Registros de alimentación | schema.sql |
| `cosechas` | Cosechas registradas | schema.sql |
| `leads` | Leads del formulario de /landing (nombre + email) | leads.sql |
| `socios` | Usuarios registrados (codigo, email, nombre, password, estado, rol) | — |
| `invitaciones` | Códigos de invitación de un solo uso | — |
| `guiones_cms` | Guiones del CMS de contenido | guiones_cms.sql |
| `recordatorios` | Recordatorios por lote (dia, titulo, completado) | — |
| `fotos_lotes` | Fotos por lote en base64 JPEG comprimido | — |
| `push_subscriptions` | Suscripciones push por socio_code | — |
| `clases` | Clases del curso Colonia por semana (1-4) | **escuela.sql** |
| `progreso_clases` | Qué clases completó cada socio | **escuela.sql** |
| `plantillas` | PDFs descargables por semana | **escuela.sql** |
| `foro_posts` | Posts del foro del grupo | **escuela.sql** |
| `foro_likes` | Likes de posts del foro | **escuela.sql** |
| `cronograma_dias` | Días individuales del programa Colonia con actividades | **cronograma_escuela.sql** |

**Cambios recientes (2026-07-25 — sesión 7):**
- ✅ **AdminView expandido** — ahora 5 tabs: 👥 Socios, 📊 Leads, 💰 Ventas, 🎟️ Invitaciones, 📝 Blog
- ✅ **Stats globales en 2 filas** — socios activos, leads capturados, kits vendidos, ingresos totales, lotes BSF totales, kg cosechados en total (via `/api/admin/stats`)
- ✅ **Tab Leads** — lista todos los leads de la Calculadora con nombre, WhatsApp, especie, animales, pérdida COP, CTA, fecha; export CSV
- ✅ **Tab Ventas** — formulario para registrar ventas del Kit (fecha, cliente, producto, monto, canal, notas); stats del mes (ventas + ingresos); lista completa; export CSV
- ✅ **Calculadora captura leads** — al tocar WhatsApp con nombre o número guarda automáticamente el lead en Supabase (`/api/leads/guardar`)
- ✅ **Nuevas API routes:** `/api/leads/guardar` (público), `/api/leads/listar` (admin), `/api/ventas/guardar` (admin), `/api/ventas/listar` (admin), `/api/admin/stats` (admin)
- ✅ **Git commit:** e692167 | Push: main → GitHub
- 📌 **Pendiente DB:** Ejecutar `supabase/leads.sql` y `supabase/ventas.sql` en Supabase → SQL Editor para crear las tablas nuevas

**Cambios recientes (2026-07-24 — sesión 6):**
- ✅ **Panel estadísticas del blog en AdminView** — nueva tab "📝 Blog" visible solo para admin
- ✅ **Tracking de visitas en Supabase** — tabla `blog_views` (slug, views, last_viewed_at); API `/api/blog/view` incrementa contador al abrir artículo; API `/api/blog/stats` devuelve ranking (solo admin)
- ✅ **Blog pages trackeadas** — `/blog/problemas`, `/blog/raciones`, `/blog/alimentacion-larvas` registran visita al montar via `useEffect`
- ✅ **`VERCEL_ANALYTICS_TOKEN`** — agregado como env var en Vercel (no usado aún; quedó pendiente GA4)
- ⚠️ **Datos históricos no disponibles** — Vercel Analytics plan gratuito no expone API de lectura; tracking arranca desde 2026-07-24
- 📌 **Pendiente: Google Analytics 4** — ver sección Pendientes conocidos

**Tabla Supabase nueva (2026-07-24):**
- `blog_views` — slug (PK), views (integer), last_viewed_at (timestamptz). SQL en `supabase/blog_views.sql`

**Cambios recientes (2026-07-23 — sesión 5):**
- ✅ **Blog hub** — `/blog` con cuadrícula filtrable por categoría (Todos/Problemas/Nutrición/Manejo)
- ✅ **3 artículos publicados en el blog:**
  - `/blog/problemas` — 8 problemas BSF con solución (ya existía, commiteado y pusheado)
  - `/blog/raciones` — raciones por animal y etapa, selector de especie (ya existía, commiteado)
  - `/blog/alimentacion-larvas` — NUEVO: sustratos recomendados, porciones por etapa del ciclo, qué evitar, cómo variar proteína de la larva antes de cosechar
- ✅ **Botones compartir en cada artículo** — "🔗 Copiar enlace" (clipboard + feedback "¡Copiado!" 2s) + "WhatsApp" (texto preescrito con el URL del artículo específico), junto al breadcrumb
- ✅ **Guía Rápida movida del nav al Perfil** — quitada de `navItems` (sidebar y mobile bottom bar). Ahora es un botón "📋 Guía Rápida BSF" en la sección Herramientas de PerfilView. Nav quedó con 5 tabs.
- ✅ **Cambiar contraseña colapsable** — en PerfilView, muestra solo "🔐 Cambiar contraseña ▾" por defecto. Se expande/colapsa al tocar. Campos y botón ocultos hasta que se abre.
- ✅ **Tour actualizado** — quitado el paso de `nav-guia`. Tour ahora tiene 5 pasos (dashboard/lotes/cosecha/estadisticas/perfil). Descripción de Perfil actualizada.

**Cambios recientes (2026-07-23 — sesión 4):**
- ✅ **Blog commiteado** — `src/app/blog/page.tsx` nunca había sido commiteado; ahora en GitHub y producción
- ✅ **Botón "Enviar notificación de prueba"** — aparece en Perfil cuando notificaciones están activadas
- ✅ **POST en /api/push/notify** — endpoint de test que envía notificación inmediata por socio_code
- ✅ **Fix re-sync suscripción** — al cargar Perfil con permiso ya concedido, re-sincroniza la suscripción al servidor automáticamente
- ✅ **Fix reset estado** — si permiso concedido pero sin suscripción push real, resetea a "Desactivadas" para poder re-activar
- ✅ **Errores visibles** — mensajes de error de activación ahora se muestran siempre, no solo cuando está "Activadas"
- ❌ **Notificaciones push bloqueadas** — error persistente: `atob` falla con "characters outside of the Latin1 range" al intentar activar
- ⚠️ **VAPID keys regeneradas** — se regeneraron y re-subieron a Vercel con ASCII puro. El error sigue. Ver pendientes.

**Cambios recientes (2026-07-23 — sesión 3):**
- ✅ **Alimentación integrada en lote** — eliminado tab "Alimentación" del nav. Historial de feeds vive en el detalle de cada lote (ya existía). Dashboard: "Ver todo" → "Ver mis lotes". Tour: paso de alimentación removido. `AlimentacionView` deshabilitada (código aún presente, pendiente de eliminar)
- ✅ **Mobile nav: labels cortos + flex:1** — 6 tabs ahora (sin alimentación). Labels móviles: Inicio/Lotes/Cosecha/Guía/Stats/Perfil. Ícono 18px, texto 8px, `white-space: nowrap`
- ✅ **Service worker bump v3** — fuerza descarte del caché v2 en todos los navegadores

**Cambios recientes (2026-07-23 — sesión 2):**
- ✅ **Vista Perfil** — avatar (localStorage `prl-avatar-{code}`), estadísticas del socio, editar nombre (API update-profile → Supabase), cambiar contraseña (API change-password + bcrypt), relanzar tour, limpiar datos
- ✅ **Vista Estadísticas** — gráficas SVG puras (kg/mes barras + conversión línea con meta 20%), ranking de lotes por conversión, mejor sustrato automático, exportar CSV (lotes/cosechas/alimentación), compartir imagen del mes (Canvas API 1080×1080 + Web Share API con fallback descarga)
- ✅ **PWA instalable** — `public/manifest.json` (start_url: /socios, theme: #22c55e), `public/sw.js` (service worker network-first + offline fallback), íconos 192/512, meta tags en layout.tsx, registro automático del SW
- ✅ **Notificaciones push** — service worker maneja push events + click; API `/api/push/subscribe` (suscribir/cancelar por socio_code); API `/api/push/notify` (alertas por día del ciclo: D7/D14/D21/D22/D25); Vercel cron diario 10am Colombia (15:00 UTC); toggle en Perfil con estado visual
- ✅ **Tour actualizado** — 7 pasos ahora incluyen Estadísticas (nav-estadisticas) y Perfil (nav-perfil)
- ✅ Nuevas API routes: `/api/socios/update-profile`, `/api/socios/change-password`, `/api/push/subscribe`, `/api/push/notify`
- ✅ `updateName()` en `useSocios.ts` — actualiza Supabase + session localStorage
- ✅ Nav: sidebar y mobile bottom bar con 7 items (+ Estadísticas + Perfil)
- ✅ Mobile header y sidebar footer: avatar clickeable → va a Perfil (reset quitado de header)

**Tabla Supabase nueva (2026-07-23):**
- `push_subscriptions` — endpoint, auth, p256dh por socio_code (con RLS)

**Variables de entorno nuevas (Vercel):**
- `VAPID_PUBLIC_KEY` — clave pública VAPID para firmar push
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` — misma clave, expuesta al navegador para subscribe
- `VAPID_PRIVATE_KEY` — clave privada VAPID (secreta)
- `VAPID_SUBJECT` — mailto: de contacto para servidores push

**Cambios recientes (2026-07-23 — sesión 1):**
- ✅ **Ojito en contraseña** — toggle show/hide en login y registro (ambos campos de contraseña)
- ✅ **Spotlight tour de 5 pasos** — SVG overlay (55% opacidad) con máscara que deja el nav item visible y resaltado con borde verde; tooltip posicionado junto al elemento (derecha en desktop, arriba en móvil); dots de progreso, prev/next, "Saltar tour"
- ✅ **Tour se pausa al explorar** — al tocar un nav item el tour se minimiza; chip flotante con "Ver guía / Siguiente → / ✕"
- ✅ **Reset total de datos** — botón en sidebar desktop + mobile header; modal de confirmación; borra todo de Supabase y localStorage; reabre tour desde paso 1
- ✅ `resetAllData()` en `useSocios.ts` — DELETE masivo por `socio_code`
- ✅ IDs en nav items: `nav-{key}` (sidebar) y `m-nav-{key}` (mobile) para que el tour los encuentre en el DOM
- Flag del tour: `prl-onboarding-done` en localStorage

**Cambios recientes (2026-07-21 — sesión completa):**
- ✅ **Fix crítico sync Supabase** — `useSocios` ya no sobreescribe localStorage con Supabase vacío; si Supabase está vacío y local tiene datos, los empuja automáticamente (recuperación)
- ✅ **Upserts fijados** — `addLote`, `addFeed`, `addCosecha`, `updateLote`, `deleteLote` son `async`, salen del setState, y loguean errores en consola
- ✅ **Carga de Supabase tras login** — antes solo cargaba al montar; ahora sincroniza inmediatamente después del login
- ✅ **Dashboard Admin — tab Socios** — nuevo tab "👥 Socios" en panel 🔑; lista todos los socios registrados (nombre, email, código, fecha, estado); tab "🎟️ Invitaciones" para los códigos
- ✅ **Nueva API `/api/socios/listar`** — solo accesible para admin; devuelve socios sin password
- ✅ **Notificaciones de cosecha en Dashboard** — 3 tipos: 🚨 roja (vencido >día 28), ⚖️ verde (urgente días 22-28 + botón "Registrar cosecha"), ⏳ ámbar (próximo días 18-21 con cuenta regresiva)
- ✅ **Recordatorios por lote** — en detalle de lote: añadir recordatorio con texto + día del ciclo; marcar completado; eliminar; badge "¡Hoy!" / "En Xd" / "Vencido"
- ✅ **Galería de fotos por lote** — botón "+ Foto" abre cámara/galería del celular; comprime a JPEG 800px/0.72 calidad con canvas; grid 3 columnas; modal al tocar; eliminar foto
- ✅ **Recordatorios en Dashboard** — tarjeta "📌 Recordatorios" muestra TODOS los pendientes divididos en "Pendientes" (vencidos/hoy, rojo) y "Próximas" (futuros, ámbar si ≤3d); click va al lote
- ✅ **SQL ejecutado en Supabase** — tablas `recordatorios` y `fotos_lotes` creadas con RLS anon full access
- ✅ **Git commits** — f2fad19 → 14a5660 → 0762d57 → 791ce2c → d600547

**Cambios recientes (2026-07-16):**
- ✅ **Módulo Diagnóstico oculto** — `/preparacion` sigue activa pero no aparece en navbar ni home
- ✅ **Videos en todas las etapas BSF** — `data/stages.ts` con videos locales en `public/fotos/`
- ✅ **Videos `*.mp4` excluidos de git** — se despliegan directo vía `vercel --prod --yes`

**Cambios recientes (2026-07-11):**
- ✅ **bcryptjs** — passwords hasheadas con salt 10 vía API routes
- ✅ **Sistema de invitaciones** — tabla `invitaciones`, endpoints crear/listar
- ✅ **Panel Admin** en `/socios` — tab 🔑 visible solo para admin
- ✅ **Cuenta admin** — `admin.zuth` / `prolarva2025` con rol=admin

**Zona de socios — estado de seguridad:**
- Passwords: hasheadas con bcrypt salt 10 ✅
- Acceso: solo con código de invitación generado por admin ✅
- Admin: rol verificado en servidor antes de cualquier acción privilegiada ✅
- Login: por email o código de socio ✅

**Próxima sesión — pendientes:**

### ✅ RESUELTO — Notificaciones push
- VAPID keys hardcodeadas en `socios/page.tsx` (clave pública `BAgFCZDb8Ns26...`)
- RLS en `push_subscriptions` corregido con policy `allow_all_anon`
- Cron diario activo: alertas D7/D14/D21/D22/D25 por lote
- Servidor envía con `urgency: 'high'` en ambos endpoints de `/api/push/notify`
- **⚠️ IMPORTANTE para usuarios nuevos:** Android pone las notificaciones web en "Silenciosa" por defecto — no aparecen en pantalla. El socio debe activar **notificaciones flotantes** manualmente: mantener presionada la notificación → ⚙️ → Importancia → **Urgente**. Sin esto solo aparecen en la barra al deslizar.

### UX/UI (en orden de prioridad)
0. ✅ **Ícono PWA** — Regenerado con Larvi + 18% padding + fondo #0d1b2a (navy). `public/icon-192.png` y `public/icon-512.png` actualizados. (2026-07-30)
1. ✅ **alert() → inline errors** — Ya implementado. Errores inline bajo el campo: `loteError`, `feedError`, `cosechaError`, `editLoteError`. (ya estaba)
2. ✅ **Toast de éxito** — Ya implementado. `showToast()` + toast UI flotante verde en bottom-center. (ya estaba)
3. ✅ **Loading state en botones** — Ya implementado. Estado `saving` con `disabled` + `opacity: 0.6` + texto "Guardando...". (ya estaba)
4. ✅ **Modal alimentación preselecciona lote** — Corregido agregando `key={prefillLoteId ?? 'none'}` al Modal de alimentación, forzando re-mount al cambiar el lote. (2026-07-30)
5. ✅ **Dashboard "Actividad reciente"** — Reemplazado "Últimas alimentaciones" por "Actividad reciente": mezcla feeds + cosechas, ordenados por fecha desc, muestra las últimas 3. Nuevo componente `CosechaEntry`. (2026-07-30)
6. ✅ **Admin tab → botón dentro de Perfil** — Quitado `Admin` de `navItems` (ya no overflow en móvil). Dentro de `PerfilView`, sección "Administración" con botón ámbar visible solo para `rol === 'admin'`. Props: `onGoAdmin?: () => void`. (2026-07-30)
7. ✅ **Mobile header simplificado** — Ya resuelto en sesión 10 (eliminado completamente). No hay header móvil en el código actual.
8. ✅ **Sidebar avatar refleja foto personalizada** — `sidebarAvatar` state en `SociosInner`. Se carga al login desde localStorage y se actualiza via evento `prl-avatar-changed` cuando el socio cambia su foto en PerfilView. (2026-07-30)
9. ✅ **Eliminar `AlimentacionView`** — Función eliminada del código. (2026-07-30)

### Funcionalidades
10. ✅ **Panel de ventas para socios** — Vista `💰 ventas` completa. Tabla Supabase `ventas_socios` creada. (2026-07-30)
11. ✅ **Recuperar contraseña** — Flujo Resend con token 1h. Falta: configurar RESEND_API_KEY en Vercel + verificar dominio prolarva.co en Resend. (2026-07-30)
12. **Google Analytics 4** — instalar para datos históricos de blog en panel admin
13. **Fotos reales educativas** — agregar fotos en `data/stages.ts` (Juliana debe proveer archivos)

**Cómo arrancar una sesión nueva:**
1. Abre Claude Code desde la carpeta canónica de arriba
2. Di: *"Lee el CLAUDE.md y continuamos"*
3. Pide el cambio directamente
