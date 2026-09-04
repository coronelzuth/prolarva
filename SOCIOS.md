# Zona de Socios — Contexto rápido

Ruta: `src/app/socios/`

## Arquitectura (post-refactor)

`page.tsx` (~180 líneas) — solo orquesta estado y routing. Importa todo lo demás.

| Archivo | Qué hace |
|---|---|
| `page.tsx` | Estado global, routing de vistas, auth |
| `_shared.ts` | Estilos compartidos: S, cardStyle, btnPrimary, btnOutline, btnDanger, Modal, Field, View |
| `SociosSidebar.tsx` | Sidebar desktop + mobile bottom nav + CSS responsive. Exporta `NAV_ITEMS` |
| `SpotlightTour.tsx` | Tour onboarding. Exporta `SpotlightTour` + `TOUR_STEPS` |
| `Dashboard.tsx` | Vista Resumen — alertas, stats, recordatorios, tarjeta Protocolo Anti-Crisis |
| `EscuelaView.tsx` | Panel Escuela — cronograma, clases, comunidad, progreso, plantillas |
| `EscuelaComunidad.tsx` | Tab Comunidad — Foro + Cajita de Preguntas fusionados en un feed mixto |
| `EnciclopediaView.tsx` | Tab Enciclopedia — orquestador de 9 secciones (nav interna sidebar+tabs) |
| `EnciclopediaSections.tsx` | Ciclo, Cría, Rutas, Alimentación, Procesamiento, LowCost, Vocabulario, Galería |
| `EnciclopediaBot.tsx` | Larvi Pro — bot de árbol embebido (`data/enciclopedia-bot.ts`) |
| `MonitorView.tsx` | Monitor bloqueado/desbloqueado — lotes y estadísticas |
| `LotesView.tsx` | Lista de lotes |
| `LoteDetail.tsx` | Detalle de lote — feeds, cosechas, fotos, recordatorios, ciclo |
| `CicloVertical.tsx` | Timeline vertical del ciclo BSF + ajuste de estimación (−1/+1 día, "empezó hoy") estilo app de periodo; persiste en `Lote.ajustes` |
| `EstadisticasView.tsx` | Gráficas SVG + export CSV |
| `PerfilView.tsx` | Perfil estilo Instagram, herramientas, cambiar contraseña |
| `VentasView.tsx` | Registro de ventas del socio |
| `AdminView.tsx` | Panel admin — socios, leads, ventas, invitaciones, blog |
| `CosechaView.tsx` | Vista cosecha + GuiaView |
| `AuthScreens.tsx` | LoginScreen, RegisterScreen, ResetPasswordScreen |
| `BienvenidaModal.tsx` | Modal de bienvenida primer acceso — 2 fases (bienvenida → bonos animados) |
| `ModalNuevoLote.tsx` | Formulario nuevo lote (auto-maneja refs y estado interno) |
| `ModalEditarLote.tsx` | Formulario editar lote |
| `ModalAlimentacion.tsx` | Formulario registrar alimentación |
| `ModalCosecha.tsx` | Formulario registrar cosecha |

## Modales globales (en page.tsx)

- `BienvenidaModal` — primer login o manual desde Perfil. Prop `showClose` solo en apertura manual.
- `ProtocoloCrisisModal` — abre desde Dashboard (tarjeta ámbar) o desde BienvenidaModal (Bono 2).

## Hook principal

`useSocios` en `src/hooks/useSocios.ts` — localStorage (cache) + `/api/socios/data`.
Retorna: `session, login, logout, register, lotes, feeds, cosechas, recordatorios, fotos, ventasSocios, addLote, updateLote, deleteLote, addFeed, addCosecha, addRecordatorio, toggleRecordatorio, deleteRecordatorio, addFoto, deleteFoto, addVentaSocio, deleteVentaSocio, updateName, updateEmail, updateFases, resetAllData, activeLotes, readyLotes, totalKg, avgConv`.

**Datos por API (no directo a Supabase):** desde 2026-08-30 todas las lecturas/escrituras
de datos del socio van por `/api/socios/data` con el `token` de sesión (`SocioSession.token`).
El servidor resuelve el `socio_code` desde el token. Las 6 tablas (`lotes`, `feed_logs`,
`cosechas`, `recordatorios`, `fotos_lotes`, `ventas_socios`) + `sesiones` están cerradas a
la anon key. `login` devuelve el token; sesiones viejas sin token fuerzan re-login.
`getSupabase()` en el hook solo se usa para refrescar la fila de `socios` (SELECT).

## Vistas disponibles (type View en _shared.ts)

`dashboard | escuela | monitor | enciclopedia | lote-detail | ventas | guia | perfil | admin | cosecha`

Deep-link a la Enciclopedia: `/socios?v=enciclopedia&sec=<inicio|bot|ciclo|cria|rutas|alimentacion|procesamiento|lowcost|vocabulario|galeria>`.
Las URLs viejas `/conocimiento`, `/metas`, `/cosecha` redirigen (308) a `sec=ciclo|rutas|cria`.

## Auth

- Login por email o código de socio
- Admins: `admin.zuth/prolarva2025` y `admin/pl2025`
- Demo: código `DEMO` — sin sync a Supabase, con banner ámbar

## Paleta de colores (`S` en _shared.ts)

```
bg: #0d1b2a  |  navy2: #152035  |  green: #22c55e  |  amber: #f59e0b  |  red: #ef4444
```
