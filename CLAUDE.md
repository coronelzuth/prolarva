# ProLarva Monitor — Contexto para Agentes

> Siempre responde en español. Segunda persona (vos). Tono cercano y directo.

---

## Qué es esta app

**ProLarva Monitor** es una app web educativa de acompañamiento para productores que aprenden a cultivar Larva de Mosca Soldado Negra (BSF). Es la antesala del curso ProLarva — la primera herramienta que reciben los estudiantes.

**URL producción:** https://prolarva-monitor.vercel.app  
**Proyecto Vercel:** `juliprojects/prolarva-monitor`  
**Deploy:** `vercel --prod --yes` desde esta carpeta  
**Dueña:** Juliana Coronel — fundadora de ProLarva, Cúcuta Colombia  
**WhatsApp ProLarva:** +57 322 321 2293

---

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (pero casi todo usa inline styles)
- **Framer Motion** (instalado, poco usado aún)
- Sin base de datos — todo el estado va en `localStorage` via `useProgress`
- Sin autenticación

---

## Estructura de archivos

```
src/
├── app/
│   ├── layout.tsx          # Navbar + Larvi + WhatsApp en todas las páginas
│   ├── page.tsx            # Home — 3 módulos + mascota Larvi al lado del título
│   ├── globals.css         # Paleta verde navy, Montserrat
│   ├── conocimiento/
│   │   └── page.tsx        # Módulo 1 — grid 3x3 de etapas + panel de detalle
│   ├── preparacion/
│   │   └── page.tsx        # Módulo 2 — quiz diagnóstico de preparación
│   └── metas/
│       └── page.tsx        # Módulo 3 — 3 rutas de producción + link calculadora
├── components/
│   ├── Navbar.tsx          # Navbar sticky con progreso
│   ├── Larvi.tsx           # Bot flotante bottom-right con mascota real PNG
│   └── WhatsApp.tsx        # Botón flotante bottom-left → wa.me/573223212293
├── data/
│   ├── stages.ts           # 8 etapas del ciclo BSF con fotos[] y videos[]
│   ├── quiz.ts             # Preguntas del diagnóstico de preparación
│   └── metas.ts            # 3 metas: animales, harina, ciclo cerrado
├── hooks/
│   └── useProgress.ts      # Estado global en localStorage
└── public/
    └── larvi-mascota.png   # Mascota PNG con fondo transparente (moño rojo)
```

---

## Paleta de colores

```
Fondo:        #0d1b2a  (navy oscuro)
Secundario:   #152035 / #1e3050
Verde primario:   #22c55e
Verde claro:      #4ade80
Verde oscuro:     #16a34a
Texto:        #e2e8f0 / #f1f5f9
Muted:        #94a3b8 / #64748b
Ámbar:        #f59e0b  (Módulo 2)
Emerald:      #10b981  (Módulo 3 / completado)
```

---

## Módulos de la app

### Módulo 1 — Conocimiento (`/conocimiento`)
- Grid 3 columnas con las 8 etapas del ciclo BSF
- Cada tarjeta muestra foto (si tiene) o emoji, nombre y duración
- Al hacer clic se abre un panel de detalle con: descripción, fotos, videos, consejos, alertas
- Progreso guardado en localStorage (`stagesViewed`)

### Módulo 2 — Preparación (`/preparacion`)
- Quiz de N preguntas sobre clima, espacio, utensilios, meta
- Al terminar muestra diagnóstico: qué tiene listo, qué mejorar, qué falta
- CTA inteligente según resultado

### Módulo 3 — Metas (`/metas`)
- 3 rutas: 🐔 Alimentar Animales · 🌾 Producir Harina · ♻️ Ciclo Cerrado
- Cada meta tiene guía paso a paso expandible
- Link a calculadora BSF: https://prolarva-calculadora.vercel.app

---

## Datos editables — `data/stages.ts`

```typescript
interface Stage {
  id: string;
  name: string;
  emoji: string;
  duration: string;
  temp: string;
  humidity: string;
  color: string;        // hex, color de acento de la etapa
  description: string;
  tips: string[];
  alerts: string[];
  isHarvestStage?: boolean;
  photos?: string[];    // rutas en /public o URLs externas
  videos?: { title: string; url: string }[];  // YouTube u otros
}
```

**Para agregar fotos:** poner archivos en `public/fotos/` y referenciarlos como `'/fotos/nombre.jpg'`  
**Para agregar videos:** agregar objetos `{ title: 'Nombre', url: 'https://youtube.com/...' }` al array `videos`

---

## Componentes clave

### `Larvi.tsx`
Bot de chat flotante en bottom-right. Tiene árbol de decisión hardcodeado (`tree`). Usa la mascota PNG `/larvi-mascota.png`. El botón es un círculo verde con la larvita con moño.

### `WhatsApp.tsx`
Botón flotante bottom-left. Link directo a `wa.me/573223212293`. Verde WhatsApp (#25D366).

### `useProgress.ts`
Hook de estado global en localStorage. Guarda:
- `modulesVisited` / `modulesCompleted`
- `stagesViewed`
- `quizAnswers` / `quizCompleted`
- `selectedMeta`

---

## Integración de Trackers (PENDIENTE)

> Los trackers de cosecha y seguimiento de ciclos se están desarrollando desde otro agente y se integrarán aquí.

**Punto de integración sugerido:**
- Nueva ruta `/tracker` o `/mis-ciclos`
- Puede leer/escribir en localStorage bajo clave `prolarva_tracker`
- El botón de acceso iría en el Home como Módulo 4 (tarjeta con color distinto, ej. `#8b5cf6`)
- El Navbar puede agregar un enlace cuando el tracker esté listo

---

## Backup y versionado

El proyecto tiene git inicializado localmente. Commits principales:
- `677babc` — versión azul v1 (backup antes del rediseño verde)
- `d906f23` — paleta verde + Larvi SVG + quick links
- `aad63cc` — mascota real PNG
- `1183f7f` — grid 3x3 + soporte fotos
- `a506d4a` — fixes responsive móvil

---

## Comandos útiles

```bash
# Desarrollo local
npm run dev        # http://localhost:3000

# Deploy a producción
vercel --prod --yes

# Ver logs de la última build
vercel logs https://prolarva-monitor.vercel.app
```
