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
SUPABASE_SERVICE_ROLE_KEY=eyJ...      (secreta — ver Supabase → Settings → API → service_role)
```
Están en `.env.local` (local, ignorado por git) y en Vercel → Settings → Environment Variables.
`SUPABASE_SERVICE_ROLE_KEY` la usan las API routes del servidor (`src/lib/supabaseServer.ts`) para
escribir saltándose RLS. Si no está, caen a la anon key. **Nunca exponerla al cliente.**

---

## Rutas actuales

| Ruta | Descripción |
|---|---|
| `/` | Home — bienvenida + 5 módulos + botón compartir |
| `/beneficios` | Intro — beneficios BSF por especie, composición nutricional, ventajas ambientales |
| `/huevos` | Huevos BSF — página educativa, color azul cielo #0ea5e9, framer-motion |
| ~~`/conocimiento`~~ | **UNIFICADA 2026-09-03** en la Enciclopedia. Redirect 308 → `/socios?v=enciclopedia&sec=ciclo` |
| ~~`/metas`~~ | **UNIFICADA 2026-09-03** en la Enciclopedia. Redirect 308 → `/socios?v=enciclopedia&sec=rutas` |
| ~~`/cosecha`~~ | **UNIFICADA 2026-09-03** en la Enciclopedia. Redirect 308 → `/socios?v=enciclopedia&sec=cria` |
| `/calculadora` | Calculadora BSF completa (wizard 4 pasos) |
| `/kit` | Landing de venta — Kit ProLarva 25/15, color ámbar (#f59e0b) |
| `/colonia` | Landing del Programa Colonia — grupal 5 semanas · 2 clases/semana (10) · WhatsApp 60 días post última clase · $400.000 COP, color verde (#22c55e), sección "Red de Productores". Datos bloqueados 2026-09-03. |
| ~~`/preparacion`~~ | **ELIMINADA 2026-08-29** — Módulo 2 quiz. Larvi `ya_sabe` ahora apunta a /cosecha |
| ~~`/sistema-2015`~~ | **ELIMINADA 2026-08-29** — landing legacy. Redirect 308 → `/kit` en `next.config.ts`. Larvi `faq_compra` apunta a /kit |
| `/socios` | Zona privada — tracker de lotes, panel Escuela y **Enciclopedia** (sin Larvi ni WhatsApp). Acepta `?v=enciclopedia&sec=<seccion>` para deep-link |
| `/gracias` | Página post-formulario — confirmación + redirect automático a /calculadora en 4 seg |
| `/blog` | Hub del blog — cuadrícula filtrable por categoría (Problemas, Nutrición, Manejo). 3 artículos publicados |
| `/blog/problemas` | 8 problemas comunes en cría BSF — acordeón expandible + botones compartir (copiar enlace / WhatsApp) |
| `/blog/raciones` | Raciones por animal y etapa — selector de especie (pollos/gallinas/cerdos/peces), tablas, tips + compartir |
| `/blog/alimentacion-larvas` | Qué comen las larvas BSF — sustratos, porciones por etapa del ciclo, qué evitar, variación proteica + compartir |
| `/contenido` | Gestor de contenido (#gestorcontenido) — 90 guiones, filtros, tab Hoy, calendario, editor. **Guard admin desde 2026-08-29** (redirige a `/socios` si `prl-session.rol !== 'admin'`). ⚠️ `GUIONES_BASE` sigue en el bundle client (`data/guiones.ts`) — protegido de visitantes casuales, no de quien inspeccione el JS. También embebido en Admin → tab Contenido. |

---

## Estructura de archivos

```
src/
├── app/
│   ├── layout.tsx            # Navbar + FloatingWidgets + Analytics en todas las páginas
│   ├── globals.css           # Paleta navy, Montserrat, reset
│   ├── page.tsx              # Home — 5 módulos (Beneficios Intro + 4 módulos)
│   ├── beneficios/page.tsx   # Intro — beneficios BSF por especie + nutrición + env
│   ├── huevos/page.tsx       # Huevos BSF — educativa azul cielo, framer-motion
│   ├── conocimiento/page.tsx # Módulo 1 — ciclo BSF con modal prev/next (requiere sesión)
│   ├── preparacion/page.tsx  # Módulo 2 — quiz diagnóstico + recommendation card
│   ├── metas/page.tsx        # Módulo 3 — rutas + links a /cosecha y /calculadora
│   ├── cosecha/page.tsx      # Guía práctica — 7 pasos + panel recomendación calculadora (requiere sesión)
│   ├── blog/page.tsx                      # Hub blog — cuadrícula con filtro por categoría
│   ├── blog/problemas/page.tsx            # 8 problemas BSF con acordeón + compartir
│   ├── blog/raciones/page.tsx             # Raciones por animal/etapa con selector + compartir
│   ├── blog/alimentacion-larvas/page.tsx  # Sustratos, porciones, qué evitar, proteína + compartir
│   ├── calculadora/page.tsx  # Calculadora wizard completa (React nativo, 4 pasos)
│   ├── kit/page.tsx          # Landing Kit ProLarva 25/15 — color ámbar #f59e0b
│   ├── colonia/page.tsx      # Landing Programa Colonia — color verde #22c55e
│   ├── socios/page.tsx           # Zona de Socios — solo nav, modales, estado global (~150 líneas)
│   ├── socios/_shared.ts         # Estilos compartidos: S, btnOutline, inputStyle, Modal, type View
│   ├── socios/EnciclopediaView.tsx  # Tab Enciclopedia — orquestador (nav interna + 9 secciones)
│   ├── socios/EnciclopediaSections.tsx # Ciclo, Cría, Rutas, Alimentación, Procesamiento, LowCost, Vocabulario, Galería
│   ├── socios/EnciclopediaBot.tsx   # Larvi Pro — bot de árbol de decisión embebido
│   ├── socios/EscuelaView.tsx       # Panel Escuela — orquestador principal (refactorizado)
│   ├── socios/EscuelaCronograma.tsx # Cronograma de fases
│   ├── socios/EscuelaDirectorio.tsx # Directorio de socios
│   ├── socios/EscuelaFaseModal.tsx  # Modal de fase (base)
│   ├── socios/EscuelaComunidad.tsx  # Tab Comunidad — Foro + Preguntas fusionados (feed mixto)
│   ├── socios/EscuelaProgreso.tsx   # Tabla de progreso admin
│   ├── socios/FaseModalAdmin.tsx    # Modal de fase — vista admin
│   ├── socios/FaseModalSocio.tsx    # Modal de fase — vista socio
│   ├── socios/EscuelaModals.tsx     # Modales compartidos de la Escuela
│   ├── socios/_escuela_shared.tsx   # Estilos y tipos compartidos de la Escuela
│   ├── socios/Dashboard.tsx      # Vista de resumen
│   ├── socios/MonitorView.tsx    # Monitor bloqueado/desbloqueado + sub-tabs Lotes/Stats
│   ├── socios/LotesView.tsx      # Lista de lotes
│   ├── socios/LoteDetail.tsx     # Detalle de lote con feeds, cosechas, fotos, recordatorios
│   ├── socios/CicloVertical.tsx  # Timeline VERTICAL del ciclo BSF + ajuste de estimación (estilo app de periodo)
│   ├── socios/EstadisticasView.tsx # Gráficas de producción y exportación CSV
│   ├── socios/PerfilView.tsx     # Perfil estilo Instagram con directorio
│   ├── socios/VentasView.tsx     # Registro de ventas del socio
│   ├── socios/AdminView.tsx      # Panel admin: socios, leads, ventas, invitaciones, blog
│   ├── socios/AuthScreens.tsx    # Login, Register, ResetPassword
│   ├── socios/CosechaView.tsx    # Vista cosecha + GuiaView
│   └── gracias/page.tsx          # Página de confirmación post-formulario
│
├── components/
│   ├── Navbar.tsx            # Sticky top; 6 links + botón Socios; scroll horizontal en móvil
│   ├── FloatingWidgets.tsx   # Wrapper cliente: renderiza Larvi + WhatsApp en todas las páginas EXCEPTO /socios
│   ├── Larvi.tsx             # Bot flotante bottom-right, árbol de decisión hardcodeado
│   ├── WhatsApp.tsx          # Botón flotante bottom-left → wa.me/573223212293
│   ├── ShareButton.tsx       # Botón compartir en Home (WhatsApp share)
│   └── RequireSocio.tsx      # Guard de ruta — redirige a /socios si no hay sesión activa
│
├── data/
│   ├── stages.ts             # 8 etapas del ciclo BSF con fotos[] y videos[] (usado por Enciclopedia → Ciclo)
│   ├── quiz.ts               # ⚠️ HUÉRFANO — era del quiz /preparacion (eliminado)
│   ├── metas.ts              # 3 rutas: animales, harina, ciclo cerrado (usado por Enciclopedia → Rutas)
│   ├── enciclopedia.ts       # Glosario, low cost, alimentación, procesamiento, cría paso a paso
│   └── enciclopedia-bot.ts   # Árbol de conversación de Larvi Pro
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
Links visibles: Inicio / 🥚 Huevos BSF / 🌱 Colonia / Calculadora / Blog + botón 🔐 Socios.
Ya no hay links ocultos: Conocimiento / Mi Meta / Cosecha se unificaron en la Enciclopedia (2026-09-03); Preparación se eliminó antes.
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

### `socios/page.tsx` + componentes divididos
Login por email o código de socio. Cuentas admin: `admin.zuth/prolarva2025`, `admin/pl2025`.
**Nav:** 6 tabs — 🏠 Resumen · 🎓 Escuela · 🔬 Monitor · 📚 Enciclopedia · 💰 Mis Ventas · 👤 Mi Perfil. Admin aparece como botón dentro de Perfil.
Sidebar sticky a `top: 0`, `height: 100vh` (navbar oculto en /socios).
**Móvil (<768px):** sidebar oculto → bottom tab bar fijo.
Estado en `localStorage` via `useSocios`. Arquitectura refactorizada: `page.tsx` (~150 líneas) + 12 archivos separados (ver estructura).

### `MonitorView.tsx`
Tab 🔬 Monitor — herramienta de trazabilidad BSF.
- **Bloqueado** (fases_aprobadas < 3 y no admin): muestra teasers rotativos de 5 beneficios + barra de progreso de fases
- **Desbloqueado** (fases_aprobadas ≥ 3 o admin): sub-tabs 📦 Lotes y 📊 Estadísticas
- Los trackers de lotes y estadísticas ya NO están en el nav principal — viven dentro de Monitor

### `PerfilView.tsx`
Estilo Instagram con foto de perfil, campos de perfil público (tipo_produccion chips, ubicacion, redes sociales), toggle directorio, sección Cuenta y seguridad colapsable. Botón Admin solo para rol=admin.

**Funcionalidades en detalle de lote (`LoteDetail.tsx`):**
- Botón ✏️ Editar (modal para cambiar nombre/fecha)
- `CicloVertical`: timeline **vertical** del ciclo (5 etapas), etapa actual resaltada, fechas reales por etapa, y ajuste de estimación (−1/+1 día, "Empezó hoy") que recalcula las etapas siguientes — persiste en `Lote.ajustes`. Botón "📅 Ver en el calendario" despliega el grid mensual Lu–Do (`CalendarMonth`) con los hitos ya ajustados.
- Al crear lote: selector de objetivo (⚖️ Cosechar larvas / 🔄 Continuar camada) que cambia las etiquetas de las 2 últimas etapas del `CicloVertical` (Cosecha/Prepupa vs Prepupa/Mosca adulta).
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
Retorna: `{ loaded, session, login, logout, lotes, feeds, cosechas, addLote, deleteLote, updateLote, addFeed, addCosecha, activeLotes, readyLotes, totalKg, avgConv, updateFases }`.
`SocioSession` incluye: `code, name, email, rol, fases_aprobadas, fase_en_revision`.
`updateFases(faseEnRevision, fasesAprobadas?)` actualiza la sesión en estado + localStorage.

### `useEscuela.ts`
Estado del panel Escuela. Consultas directas a Supabase (sin localStorage).
Clave de sincronización: `socio_code`.
Tipos: `Clase`, `ProgresoClase`, `Plantilla`, `ForoPost`.
Retorna: `{ loaded, clases, progreso, plantillas, posts, marcarVisto, publicarPost, toggleLike, guardarClase, eliminarClase, guardarPlantilla, eliminarPlantilla, eliminarPost, clasesPorSemana, plantillasPorSemana, estaVisto, totalClases, totalVistos, reload }`.
**Tablas Supabase:** `clases`, `progreso_clases`, `plantillas`, `foro_posts`, `foro_likes` (SQL en `supabase/escuela.sql`).

### `EscuelaView.tsx` (`src/app/socios/`)
Panel Escuela completo. Props: `{ socioCode, socioNombre, isAdmin, fasesAprobadas, faseEnRevision, onMarcarFase?, onAprobFase? }`.
**Secciones:**
- **Cronograma** — vista principal. Grid de fases con panel expandible inline por actividad.
- **Clases / Plantillas / Tareas** — accesibles por admin desde sección Gestionar.
- **Foro** — estilo Twitter con reacciones, respuestas anidadas y push.
- **Progreso** (solo admin) — tabla ✅/⬜ por clase + sección "Fases pendientes de aprobación" con botón "✅ Aprobar Fase X" por socio.
- **Barra de progreso de fases** — en el Cronograma para socios: 5 segmentos (verde=aprobada, ámbar=en revisión).
- **Botón "Marcar fase como lista"** — en FaseModal para socios; activa el flujo socio→admin→aprobación.
**Desktop:** sidebar 176px. **Móvil:** tabs horizontales.

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

**Última actualización:** 2026-09-04

**Cambios recientes (2026-09-04 — sesión 24 — Timeline vertical del ciclo + ajuste de estimación):**
- ✅ **Nuevo `src/app/socios/CicloVertical.tsx`** — reemplaza la línea de tiempo **horizontal con scroll** del detalle de lote por un **stepper vertical** (5 etapas de arriba hacia abajo). Riel con nodos ✓/●/○, línea que se rellena según el avance, la etapa actual resaltada en tarjeta verde con "● Ahora · día X de Y". Cada etapa muestra su rango de fechas real calculado. Sin scroll horizontal en ningún lado.
- ✅ **Ajuste de estimación estilo app de periodo** — en la etapa actual y las siguientes hay "✎ ajustar fecha": botones **−1 día / +1 día**, **"Empezó hoy"**, y "↺ quitar ajuste". Al mover una etapa, todas las siguientes se recalculan solas (arrastre del desfase). Chip ámbar "ajustado +Nd" en las etapas tocadas. Botón "↺ Estimación estándar" para resetear todo.
- ✅ **Modelo de datos:** `Lote.ajustes?: Record<string, number>` (etapaKey → día real de inicio). Helpers nuevos en `useSocios.ts`: `STAGE_BASE_STARTS`, `loteStarts(ajustes)`, `getStageLote(lote)` (etapa actual considerando ajustes). `updateLote` acepta `ajustes`. `LotesView` y `Dashboard` usan `getStageLote`.
- ✅ **API `/api/socios/data`** — `lote.update` acepta y sanea `ajustes` (solo pares string→number). `loteToRow` solo manda la columna `ajustes` cuando hay algo (los flujos viejos siguen intactos aunque la migración no se haya corrido).
- 🔻 **Eliminados de `_shared.tsx`:** `Timeline` y `MiniCalendar` (el grid de calendario mensual `CalendarMonth` se conserva y ahora lo usa `CicloVertical` con "📅 Ver en el calendario"). Único consumidor era `LoteDetail`.
- ✅ **SQL corrido** (`supabase/lote-ajustes.sql` — `ALTER TABLE lotes ADD COLUMN ajustes JSONB DEFAULT '{}'`, 2026-09-04).
- ⚠️ **Fuera de alcance:** `readyLotes` / alertas de cosecha / push cron siguen usando el estimado base (día 22–28), no el ajustado. El ajuste por ahora solo mueve la vista del detalle + su calendario.
- ✅ `tsc` limpio, `next build` OK. **Commit `137d62d` (+ sesiones 23-23b bundled), push a GitHub, deploy prod `dpl_DVDaYb7KDW2MQcsT4LsdVp52WfaA` → prolarva.co (2026-09-04).** Nota: `vercel --prod --yes` dio "Not authorized" transitorio; funcionó con `vercel deploy --prod --yes`.

**Cambios recientes (2026-09-03 — sesión 23b — Escuela: Foro + Preguntas → Comunidad):**
- ✅ **Fusión Foro + Cajita de Preguntas** en un solo tab **`💬 Comunidad`** de la Escuela. Nuevo `EscuelaComunidad.tsx` (self-contained, absorbe `EscuelaForo.tsx` que se **eliminó**).
- ✅ **Composer unificado:** textarea + toggle "❓ Es una pregunta para la clase" → al activarlo aparece selector de semana (1-5 + "General") y el botón pasa a "Enviar pregunta". OFF → `esc.publicarPost`; ON → `esc.publicarPregunta`. Sin migración de DB — siguen las 2 tablas (`foro_posts`, `preguntas_escuela`), se mergean en el feed por fecha.
- ✅ **Feed mixto:** posts (con reacciones/hilos/fijar) + preguntas (badge ❓ + chip semana + estado ⏳/✅ + respuesta admin inline) intercalados. Filtros `Todo / ❓ Preguntas / ⏳ Sin responder` + búsqueda. Banner admin "N sin responder".
- ✅ `EscuelaSub`: `'foro'` + `'preguntas'` → `'comunidad'`. Nav sidebar + mobile tabs con 1 solo ítem. Badge = nº pendientes (solo admin).
- ✅ **FaseModal:** la pestaña "❓ Preguntas" (que en realidad editaba `tareas`) se renombró a **"💭 Reflexión"** (`FaseModalAdmin`, `FaseModalSocio`, `EscuelaCronograma`) para quitar la colisión de nombres.
- ✅ Notificaciones push de like/reply preservadas (movidas dentro de `EscuelaComunidad`). `tsc` + `next build` OK, verificado en navegador. Deploy prod `dpl_Gmv8LECdA2oDrGnLEmGGBBGTjhAb` → prolarva.co.

**Cambios recientes (2026-09-03 — sesión 23 — Enciclopedia BSF):**
- ✅ **Nueva tab `📚 Enciclopedia` en `/socios`** (6º ítem del sidebar; móvil = "Wiki"). `view: 'enciclopedia'` en `_shared.tsx` + `NAV_ITEMS` en `SociosSidebar.tsx`. Contenido 100% hardcoded en `src/data/enciclopedia.ts` + `enciclopedia-bot.ts` (sin tablas Supabase).
- ✅ **9 secciones** con nav interna propia (sidebar desktop + tabs móvil, patrón EscuelaView): 🤖 Larvi Pro (bot de árbol), 🔄 El ciclo (8 etapas, portado de /conocimiento), 🌾 Cría paso a paso (portado de /cosecha), 🎯 Rutas de producción (usa `data/metas.ts`), 🥗 Qué darles / qué NO (de blog/alimentacion-larvas + Documento Maestro), 🏭 Procesamiento (larva viva vs harina), 💸 Low cost (Apéndice C del Documento Maestro), 📖 Vocabulario (~60 términos buscables), 🖼️ Mega galería (**placeholder — 10 categorías, esperan paquete de fotos de Juliana**).
- ✅ **`/conocimiento`, `/metas`, `/cosecha` unificadas y eliminadas.** Carpetas borradas. Redirects 308 en `next.config.ts` → `/socios?v=enciclopedia&sec=ciclo|rutas|cria`. `sitemap.ts` limpiado. Navbar sin links ocultos. `RequireSocio.tsx` quedó sin usar (no borrado).
- ✅ **Deep-link:** `/socios` lee `?v=enciclopedia&sec=<seccion>` → `EnciclopediaView initialSection`. Links de Larvi (`faq_ciclo`, `faq_residuos`, metas, cosecha…) y de EscuelaView "Mi Meta" actualizados a la nueva ruta.
- ⚠️ **OJO Larvi público:** en páginas públicas (home, colonia, kit, blog) los botones de Larvi sobre ciclo/cosecha/rutas ahora mandan a `/socios` → muro de login. Si molesta para conversión, apuntarlos a `/huevos` o `/blog`.
- 📌 **Pendiente:** paquete de fotos de referencia para la Mega galería (sana/enferma, plagas, sustratos, montajes low cost).
- ✅ **Build + deploy:** `tsc` limpio, `next build` OK, verificado en navegador (modo demo). Deploy a prod `dpl_4EXonQYttPdwsfYovxsEmW4nWVbg` → prolarva.co. Redirects 308 de `/conocimiento|/metas|/cosecha` verificados en producción.

**Cambios recientes (2026-08-30 — sesión 22 — audit Escuela + arreglos):**
- ✅ **Bug `codigo` vs `code` en Escuela** — `useEscuela.ts` y `EscuelaView.tsx` consultaban `socios.code` (columna inexistente; la real es `codigo`). Rompía en silencio: Directorio vacío, badges "ProLarva ✓" nunca aparecían, panel Progreso admin sin socios, `toggleColonia` no guardaba. Corregido: `select('codigo,...')` + alias a `.code` en JS. `toggleColonia` ahora `.eq('codigo', code)`.
- ✅ **Sesión se refresca al cargar `/socios`** — `useSocios.init()` re-consulta la fila de `socios` y actualiza `fases_aprobadas` / `fase_en_revision` / `rol` / `email` / `nombre`. Antes el socio tenía que cerrar sesión y volver a entrar para ver una semana aprobada por el admin o el Monitor desbloqueado. También cierra sesión si la cuenta pasó a `inactivo`.
- ✅ **Enlace de la videollamada en la Escuela** — nueva clave `url_reunion` en `config_escuela` (misma tabla key/value, sin migración). Botón "🎥 Entrar a la clase / Enlace de la clase en vivo" en el banner del countdown para todos; input para el admin al lado de "editar próxima clase". Hook: `esc.urlReunion` + `esc.setUrlReunion()`.
- ✅ **Vocabulario unificado a "Semana"** — se eliminó "Fase" de toda la UII (Cronograma, FaseModal socio/admin, Monitor bloqueado, EscuelaProgreso, EscuelaModals, toasts, tour, login preview). El código interno sigue usando `fase`/`fasesAprobadas`; solo cambió el texto visible.
- ✅ **Certificado 4→5 semanas** — `descargarCertificado` decía "Programa Colonia · 4 Semanas". Corregido a 5.
- ✅ **Tour de bienvenida re-enfocado a la Escuela** — el paso 1 ahora es Escuela ("Empieza aquí"), y el Monitor se presenta como "se abre en la Semana 3, no te preocupes por él todavía" (antes enseñaba features bloqueadas el día 1).
- ✅ **Dashboard sin lotes** — card verde "Tu programa arranca en la Escuela" → lleva a la Escuela, en vez de solo stats en 0.
- ✅ **`/gracias`** — redirige a `/colonia` (5 s) en vez de `/calculadora` (era un loop: ya venía de la calculadora). CTA doble: Programa Colonia (primario) + Calculadora (secundario).
- ✅ **Seguridad Escuela — escrituras de admin movidas al servidor** — antes `useEscuela` hacía INSERT/UPDATE/DELETE directo con la anon key (clases, tareas, anuncios, responder preguntas, borrar posts, `toggleColonia`). Ahora pasan por **`/api/escuela`** (endpoint único, verifica `rol === 'admin'` contra `socios`; permite autoría para borrar post/pregunta propios). Nuevo helper `src/lib/supabaseServer.ts` (`getServerSupabase` + `esAdmin`). Las 30 API routes ahora usan `SUPABASE_SERVICE_ROLE_KEY || NEXT_PUBLIC_SUPABASE_ANON_KEY` (sin cambio de comportamiento hasta que exista la env var).
- ✅ **`SUPABASE_SERVICE_ROLE_KEY`** — agregada a `.env.local` + Vercel Production + Preview (2026-08-30).
- ✅ **Deploy a producción** — `dpl_3uTh5t1XZyaPT2nhNkid5i6qn5mt`, aliased a prolarva.co. Verificado: `/api/escuela` devuelve 403 "No autorizado" a un código no-admin (la verificación de rol con service_role funciona en prod).
- ✅ **`supabase/escuela-seguridad.sql` ejecutado** (2026-08-30) — anon key bloqueada a SELECT en `socios` + 6 tablas de la Escuela. Verificado con la anon key real contra prod: no puede `update socios`, `insert clases`, `insert cronograma_dias`, `update config_escuela`; sí puede leer y publicar en el foro. El script se corrigió para borrar TODA policy dinámicamente (la 1ª versión dejó 2 policies sueltas por nombre; ya limpiadas).
- ✅ **`EscuelaCronograma.tsx` — código muerto eliminado** — el bloque de "días individuales" con `display:'none'` se borró. Ahora la vista es solo las 5 tarjetas de semana → clic abre `FaseModal` con todo el detalle. Ya no se oculta el cronograma cuando `cronograma_dias` está vacío (antes salía "disponible pronto" tapando las tarjetas). El admin conserva "+ fecha" para marcar días en el calendario. Props recortados en `EscuelaView` (quitado `expandedDia` state).
- ✅ **Certificado — descarga arreglada para PWA/móvil** — `descargarCertificado` usa `canvas.toBlob` + Web Share API (móvil/Android) con fallback a blob URL en desktop (antes `<a download>` de un dataURL, que falla en PWA Android).
- ✅ **`supabase/seguridad-tablas.sql` ejecutado** (2026-08-30) — anon key sin acceso a `leads`, `invitaciones`, `ventas`, `password_resets`, `push_subscriptions`. Antes la anon key (está en el bundle) leía los tokens de recuperación de contraseña, los códigos de invitación sin usar y los leads con WhatsApp. Verificado: anon → `permission denied` en las 5; service_role sigue leyendo todo (admin panel, register, forgot-password OK).
- ✅ **Aislamiento de datos por socio — refactor completo** (2026-08-30). Antes `lotes`/`feed_logs`/`cosechas`/`recordatorios`/`fotos_lotes`/`ventas_socios` se leían/escribían client-side con la anon key filtrando por `socio_code` (string spoofeable). Ahora:
  - Tabla **`sesiones`** (`token`, `socio_code`, `creado_en`, `ultimo_uso`) — token opaco (`crypto.randomBytes`, base64url) por login. SQL: `supabase/sesiones-1-tabla.sql`.
  - **`src/lib/sesion.ts`** — `crearSesion` / `socioDeToken` (valida + expira a 90 días) / `borrarSesion`. Solo servidor.
  - **`/api/socios/login`** devuelve `token`; `useSocios` lo guarda en `SocioSession.token` + localStorage.
  - **`/api/socios/data`** — endpoint único. Acciones: `sync` (trae las 6 tablas + recuperación desde localStorage si la DB está vacía), `lote.add/update/delete` (delete en cascada), `feed.add`, `cosecha.add`, `recordatorio.add/toggle/delete`, `foto.add/delete`, `venta.add/delete`, `reset`, `logout`. **El `socio_code` sale del token, nunca del body.** Update/delete por id se acotan además con `.eq('socio_code', code)`.
  - **`useSocios` reescrito** — cada mutación → `postData(action, payload)`. Cache localStorage + update optimista intactos. Sesiones viejas sin token → re-login forzado una vez.
  - **`update-profile` / `update-email` / `marcar-fase`** pasan a `token` en vez de `code` (callers: `PerfilView`, `page.tsx`).
  - SQL lockdown: `supabase/sesiones-2-lockdown.sql` — anon key sin acceso a las 6 tablas + `sesiones`. **Ejecutado y verificado**: anon → `permission denied` en las 7; el camino token (login→sync) sigue vivo.
  - **Fuera de alcance:** `user_progress` (device_id, sin datos personales) y `push_subscriptions` siguen con la anon key.
- 📌 **Para después (pedido explícito):**
  - **Wompi:** link de pago en `/colonia` (sigue todo manual por WhatsApp).
  - **Cohortes:** no hay separación de ediciones. La 2ª cohorte verá foro/clases/fechas de la 1ª.

**Cambios recientes (2026-08-29 — sesión 21):**
- ✅ **Escuela — `SEMANAS_INFO` sincronizado** con los 5 guiones del Curso Grupal (`HUB PROLARVA\11- Curso Grupal\Clase_0N.md`). Títulos/temas nuevos, vocabulario "pie de cría" (no "semilla"). Cada semana tiene 2 sesiones: contenido + "Preguntas y Respuestas". En `src/app/socios/_escuela_shared.tsx`.
- ✅ **Escuela — Cajita de Preguntas** — nueva tab `❓ Preguntas` (sidebar + móvil). Tabla `preguntas_escuela` (`supabase/preguntas_escuela.sql`). Alumno elige semana + escribe + "Enviar pregunta"; admin responde inline, edita, elimina; badge en nav = nº sin responder. Hook: `publicarPregunta` / `responderPregunta` / `eliminarPregunta` en `useEscuela.ts`. Se responden en la 2ª sesión de cada semana.
- ✅ **Escuela — Resumen de clase** — columna `clases.resumen` (en el mismo SQL). Campo en `ClaseModal` (admin). Se muestra en card verde "📝 Resumen" en la vista de clase (`EscuelaView`) y en el panel del cronograma (`EscuelaCronograma`).
- ✅ **Rutas eliminadas** — `/preparacion` (Módulo 2 quiz) y `/sistema-2015` (landing legacy). Carpetas borradas. `/sistema-2015` → **redirect 308 a `/kit`** en `next.config.ts`. Navbar y `sitemap.ts` limpiados.
- ✅ **`/contenido` — guard admin** — el `default export` redirige a `/socios` si `prl-session.rol !== 'admin'`. El named export `ContenidoGestor` (embebido en AdminView) no cambia. Nota: `GUIONES_BASE` sigue en el bundle client.
- ✅ **Larvi (bot)** — `nuevo` → `/` (era `/conocimiento`, con muro); `ya_sabe` → `/calculadora` (era `/preparacion`); `faq_compra` → `/kit` (era `/sistema-2015`); quitado el saludo contextual de `/preparacion`.
- ✅ **`sitemap.ts`** — quitado `/landing` (404), agregados `/colonia` y `/kit`.
- ✅ **Vinculación Vercel restaurada** — `.vercel/` local re-creado (`vercel link` → `juliprojects/prolarva`). Deploy: `vercel --prod --yes` desde esta carpeta.

**Cambios recientes (2026-08-09 — sesión 20):**
- ✅ **Navbar — menús ocultos al público** — `hidden: true` en: Conocimiento, Preparación, Mi Meta, Cosecha. Solo visible: Inicio / Huevos BSF / Colonia / Calculadora / Blog + botón Socios. El link 📋 Contenido fue eliminado completamente del navbar (antes solo admin lo veía).
- ✅ **Navbar móvil — distribución uniforme** — quitado `overflow-x: auto`. Cada ítem tiene `flex: 1` y `justify-content: center` para distribuirse a lo largo del ancho completo en móvil.
- ✅ **Nueva ruta `/huevos`** — `src/app/huevos/page.tsx` (430 líneas). Color azul cielo `#0ea5e9`, animaciones con `framer-motion`. Aparece en navbar como "🥚 Huevos BSF".
- ✅ **`RequireSocio.tsx`** — nuevo componente guard en `src/components/`. Redirige a `/socios` si no hay `prl-session` en localStorage. Aplicado en `/conocimiento` y `/cosecha`.
- ✅ **`EscuelaView.tsx` — gran refactor** — dividido en 10 archivos separados: `EscuelaCronograma`, `EscuelaDirectorio`, `EscuelaFaseModal`, `EscuelaForo`, `EscuelaProgreso`, `FaseModalAdmin`, `FaseModalSocio`, `EscuelaModals`, `_escuela_shared`. `EscuelaView` queda como orquestador principal.
- ✅ **`/colonia` — ajustes menores** — ediciones en `src/app/colonia/page.tsx`.
- ✅ **Home (`/`) rediseñado completamente** — contenido de `/beneficios` desplegado directamente en el home sin navegación intermedia:
  - Tabs inline (Gallinas / Cerdos / Peces) con `useState` para mostrar beneficios por especie
  - Composición nutricional — 4 stats en grid
  - Ventajas ambientales
  - Sección "🚀 Cualquier productor puede empezar" — 3 pasos
  - FAQ acordeón — 5 preguntas frecuentes (`FaqSection` componente inline)
  - Sección "¿Quién está detrás de ProLarva?" — foto de Juliana + bio
  - Botones CTA: 🌱 Colonia + 🎵 TikTok (@prolarva.co)
  - Botón compartir al final
- **Vercel:** múltiples deployments hoy, todos ✅ Ready.

**Cambios recientes (2026-08-08 — sesión 19):**
- ✅ **`/contenido` reestructurado como #gestorcontenido** — ahora 90 guiones (83 base + 7 Reto). Cambios: 6 StatCards eliminadas; botones de perfil social (WhatsApp, TikTok, Instagram) en el header; padding móvil reducido; búsqueda colapsable (ícono 🔍 → input con autoFocus); filtros de tipo sin contadores (Todos/V/E/C/MSN); dropdown de estado eliminado; tab "🎯 Hoy" con guion aleatorio + "Sortear otro"; `DownloadTxtButton` en tab Guión; edición inline de título en tab Metadatos; `GuionCard` comprimida a 2 filas; modal `NuevoGuionModal` con botón "+Nuevo guión". Archivos: `src/app/contenido/page.tsx`, `src/hooks/useGuionesCms.ts` (nuevo método `createGuion`).
- ✅ **`_INDICE.txt` sincronizado** — añadidos los 7 guiones RETO (#84-90) al índice del Hub. Fecha actualizada a 2026-08-08.

**Cambios recientes (2026-08-08 — sesión 18):**
- ✅ **Email registro Colonia mejorado** — saludo neutro "Te damos la bienvenida, [nombre]" (antes "¡Bienvenida," femenino fijo); placeholder de video con bloque oscuro ▶; línea de promesa en verde ("En 4 semanas vas a tener tu primera cosecha..."); bloque destacado con fecha de inicio 9 de septiembre 2026. Archivo: `src/app/api/colonia/registro/route.ts`

**Cambios recientes (2026-08-01 — sesión 17):**
- ✅ **Protocolo Anti-Crisis — tarjeta permanente en Dashboard** — Card ámbar al final del Dashboard con 🛡️, título, badge "BONO · $67 USD" y flecha. Toca abre `ProtocoloCrisisModal` directo. Prop `onVerProtocolo` en Dashboard.
- ✅ **BienvenidaModal — botón X solo en apertura manual** — Prop `showClose?: boolean`. Solo aparece cuando se abre desde Perfil (segunda vez), no en el primer acceso automático. Estado `bienvenidaManual` en page.tsx.
- ✅ **Refactor page.tsx** — De 778 líneas a ~180. Extraídos: `SpotlightTour.tsx`, `SociosSidebar.tsx`, `ModalNuevoLote.tsx`, `ModalEditarLote.tsx`, `ModalAlimentacion.tsx`, `ModalCosecha.tsx`. Cada modal maneja su propio estado y refs internamente.
- ✅ **Keywords #socios y #colonia** — Nuevos archivos de contexto `SOCIOS.md` y `COLONIA.md` + keywords registradas en CLAUDE.md global.
- 🔄 **Wompi — cuenta en creación** — Se definió flujo de pago: Wompi (persona natural), link de pago $400.000 COP, flujo manual-asistido por ahora. Juliana creando cuenta en wompi.com.

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
`C:\Users\Usuario\Desktop\Zu Office\01 - PROYECTOS\HUB PROLARVA\06 - Apps y Artifacts\prolarva-monitor`

**Supabase — tablas activas:**
| Tabla | Qué guarda | SQL |
|---|---|---|
| `user_progress` | Progreso de módulos por device_id | schema.sql |
| `lotes` | Lotes de producción por socio_code (+ col. `ajustes` jsonb desde sesión 24) | schema.sql · **lote-ajustes.sql** |
| `feed_logs` | Registros de alimentación | schema.sql |
| `cosechas` | Cosechas registradas | schema.sql |
| `leads` | Leads del formulario de /landing (nombre + email) | leads.sql |
| `socios` | Usuarios registrados (codigo, email, nombre, password, estado, rol) | — |
| `invitaciones` | Códigos de invitación de un solo uso | — |
| `guiones_cms` | Guiones del CMS de contenido | guiones_cms.sql |
| `recordatorios` | Recordatorios por lote (dia, titulo, completado) | — |
| `fotos_lotes` | Fotos por lote en base64 JPEG comprimido | — |
| `push_subscriptions` | Suscripciones push por socio_code | — |
| `sesiones` | Tokens de sesión de socio (token, socio_code, creado_en) — RLS: solo service_role | **sesiones-1-tabla.sql** |
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
11. ✅ **Recuperar contraseña** — Flujo Resend completo. RESEND_API_KEY configurada en Vercel, dominio prolarva.co verificado. (2026-07-30)
12. ✅ **Google Analytics 4** — activo en producción con ID `G-HPSM3TXTLX`. Registra visitas desde web y PWA. (2026-07-31)
13. ✅ **GA4 — tracking de navegación interna** — componente `GoogleAnalytics.tsx` con `usePathname` dispara `gtag('config')` en cada cambio de ruta. (2026-07-31)
14. **Fotos reales educativas** — agregar fotos en `data/stages.ts` (Juliana debe proveer archivos)
15. 🔄 **Wompi — link de pago** — Juliana creando cuenta (persona natural). Pendiente: crear link de pago $400.000 COP y conectar CTA de `/colonia`.
16. **Webhook Wompi → código automático** — Para cuando el volumen lo justifique: webhook POST a `/api/wompi/webhook` → crea invitación → envía código por email (Resend ya instalado).
17. **Auditoría 10 puntos app-pro** — Revisar y aplicar checklist completo: seguridad, commits, y más. Ver: https://www.tododeia.com/community/10-puntos-app-pro

**Cómo arrancar una sesión nueva:**
1. Abre Claude Code desde la carpeta canónica de arriba
2. Di: *"Lee el CLAUDE.md y continuamos"*
3. Pide el cambio directamente
