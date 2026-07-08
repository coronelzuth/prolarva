# ProLarva Monitor — Contexto para Agentes

> Siempre responder en **español**. Segunda persona (vos). Tono cercano y directo.
> **Leer este archivo completo antes de tocar cualquier cosa.**

---

## Qué es esta app

**ProLarva Monitor** es una app web educativa de acompañamiento para productores que aprenden a cultivar Larva de Mosca Soldado Negra (BSF). Es la antesala del curso ProLarva.

**URL producción:** https://prolarva-monitor.vercel.app
**Proyecto Vercel:** `juliprojects/prolarva-monitor`
**Deploy:** `vercel --prod --yes` desde esta carpeta
**Dueña:** Juliana Coronel — fundadora de ProLarva, Cúcuta Colombia
**WhatsApp ProLarva:** +57 322 321 2293 (`573223212293` en formato WA)

---

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Montserrat** via `next/font/google` (ya configurado en `layout.tsx`)
- **Tailwind CSS v4** instalado pero casi todo usa **inline styles**
- **Vercel Analytics** (`@vercel/analytics/react`) — ya integrado en `layout.tsx`
- Sin base de datos — todo el estado va en `localStorage`
- Sin autenticación pública — `/socios` tiene login propio con credenciales hardcodeadas

---

## Rutas actuales

| Ruta | Descripción |
|---|---|
| `/` | Home — bienvenida + 4 módulos + botón compartir |
| `/conocimiento` | Módulo 1 — ciclo BSF, grid 3×3 de etapas |
| `/preparacion` | Módulo 2 — quiz diagnóstico |
| `/metas` | Módulo 3 — rutas de producción + link a /calculadora |
| `/cosecha` | Guía Práctica — 7 pasos: del huevo a la cosecha + ciclo cerrado |
| `/calculadora` | Calculadora BSF completa (wizard 4 pasos) |
| `/landing` | Landing page pública de ProLarva |
| `/socios` | Zona privada — tracker de lotes, alimentación y cosechas |

---

## Estructura de archivos

```
src/
├── app/
│   ├── layout.tsx            # Navbar + Larvi + WhatsApp + Analytics en todas las páginas
│   ├── globals.css           # Paleta navy, Montserrat, reset
│   ├── page.tsx              # Home — 4 módulos (incluye /cosecha como Módulo 4)
│   ├── conocimiento/page.tsx # Módulo 1 — ciclo BSF con modal prev/next
│   ├── preparacion/page.tsx  # Módulo 2 — quiz diagnóstico
│   ├── metas/page.tsx        # Módulo 3 — rutas + link a /cosecha y /calculadora
│   ├── cosecha/page.tsx      # Guía práctica — 7 pasos accordion + sección ciclo cerrado
│   ├── calculadora/page.tsx  # Calculadora wizard completa (React nativo, 4 pasos)
│   ├── landing/page.tsx      # Landing page pública
│   └── socios/page.tsx       # Zona de Socios (login + tracker)
│
├── components/
│   ├── Navbar.tsx            # Sticky top; 6 links + botón Socios; scroll horizontal en móvil
│   ├── Larvi.tsx             # Bot flotante bottom-right, árbol de decisión hardcodeado
│   ├── WhatsApp.tsx          # Botón flotante bottom-left → wa.me/573223212293
│   └── ShareButton.tsx       # Botón compartir en Home (WhatsApp share)
│
├── data/
│   ├── stages.ts             # 8 etapas del ciclo BSF con fotos[] y videos[]
│   ├── quiz.ts               # Preguntas del diagnóstico de preparación
│   └── metas.ts              # 3 rutas: pollos, harina, ciclo cerrado
│
└── hooks/
    ├── useProgress.ts        # Estado global del alumno en localStorage
    └── useSocios.ts          # Estado de la Zona de Socios en localStorage

public/
├── larvi-mascota.png         # Mascota PNG con fondo transparente (moño rojo)
├── og-image.png              # OG image 1200×630 para redes sociales
└── calculadora-bsf.html      # HTML original de respaldo (no se usa en producción)
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

### `cosecha/page.tsx`
Guía práctica en 7 pasos totales, divididos en dos secciones:
- **Pasos 1–5 (Meta 1):** Conseguir semilla → Cuna → Eclosión → Traslado → Cosecha (días 15–18)
- **Pasos 6–7 (Meta 3 — ciclo cerrado):** Las prepupas → Trampas de madera con afrecho/aserrín
Patrón: acordeón con `useState<number>` (main) y `useState<number | null>` (ciclo).
Cada paso tiene: descripción, consejos, alertas y sección "Qué registrar".

---

## Hooks

### `useProgress.ts`
Estado global del alumno. Guarda en localStorage:
- `modulesVisited` / `modulesCompleted`
- `stagesViewed`
- `quizAnswers` / `quizCompleted`
- `selectedMeta`

### `useSocios.ts`
Estado de la zona privada. Tipos: `Lote`, `FeedLog`, `Cosecha`, `SocioSession`.
Exports: `BSF_STAGES`, `daysSince(dateStr)`, `getStage(days)`, `uid()`, `useSocios()`.
Retorna: `{ loaded, session, login, logout, lotes, feeds, cosechas, addLote, deleteLote, addFeed, addCosecha, activeLotes, readyLotes, totalKg, avgConv }`.

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
| `calculadora-bsf.html` | HTML original de la calculadora (respaldo, no se sirve) |

---

## Pendientes conocidos

- [ ] **Fotos reales** — infraestructura lista en `stages.ts`, Juliana debe proveer archivos para `public/fotos/`
- [ ] **Videos reales** — campo `videos[]` listo en `stages.ts`, necesita URLs de YouTube
- [ ] **Foto real de Juliana** — placeholder "Tu foto aquí" en `/landing`
- [ ] **URL del VSL** — campo listo en `/landing`, falta el link cuando el video esté listo

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
26c0d62  chore: eliminar CalculadoraInline.tsx (componente sin uso)
cc2b4e7  refactor: reemplazar CalculadoraInline por link a /calculadora
7aeb7f5  docs: actualizar CLAUDE.md con estado real del proyecto
a5cc857  feat: port calculadora BSF a React con paleta de la app
5d4c8e9  restore: zona de socios + calculadora + navbar completo
f6e3fe2  feat: calculadora inline + WhatsApp flotante + OG tags + Analytics + botón compartir
677babc  backup: versión azul v1 (antes del rediseño verde)
```

---

## Estado actual
> **Actualizar esta sección al final de cada sesión de trabajo.**

**Última actualización:** 2026-07-08

**Qué está funcionando en producción:**
- Todas las rutas desplegadas y accesibles en móvil y desktop
- `/calculadora` — React nativo, 4 pasos, colores de la app
- `/socios` — login, tracker de lotes/alimentación/cosechas, sidebar desktop + bottom tab bar móvil
- `/metas` — 3 rutas + links a `/cosecha` y `/calculadora`
- `/cosecha` — guía completa 7 pasos: Meta 1 (días 0–18) + Meta 3 ciclo cerrado (prepupas + trampas)
- `/conocimiento` — modal con navegación prev/next por etapa, fotos y videos en etapa Huevo
- `/landing` — landing pública con placeholder para foto de Juliana y VSL
- Navbar: 6 links + Socios; scroll horizontal en móvil
- WhatsApp flotante, Larvi bot, OG tags y Analytics activos

**Responsive móvil implementado:**
- Navbar: scroll horizontal, oculta texto de labels y barra de progreso (<599px)
- Socios: sidebar → bottom tab bar fijo + mobile header (<768px)
- Calculadora: beneficios en 1 columna (<380px)
- Landing: stats apiladas con separador horizontal (<600px)
- Home: mascota se apila sobre el título (<480px)

**Carpeta de trabajo canónica:**
`C:\Users\HP\Desktop\Cosas de Zu\BR Prolarva\06 - Apps & Artifacts\prolarva-monitor`

**Próxima sesión — continuar con:**
- Agregar fotos reales para las 7 etapas restantes → copiar a `public/fotos/` y editar `data/stages.ts`
- Agregar URLs de videos YouTube → editar `data/stages.ts`
- Agregar foto real de Juliana → placeholder "Tu foto aquí" en `/landing`
- Agregar URL del VSL cuando esté listo en `/landing`

**Cómo arrancar una sesión nueva:**
1. Abrí Claude Code desde la carpeta canónica de arriba
2. Decí: *"Leé el CLAUDE.md y continuamos"*
3. Pedí el cambio directamente
