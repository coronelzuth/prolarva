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
| `EscuelaView.tsx` | Panel Escuela — cronograma, clases, foro, progreso, plantillas |
| `MonitorView.tsx` | Monitor bloqueado/desbloqueado — lotes y estadísticas |
| `LotesView.tsx` | Lista de lotes |
| `LoteDetail.tsx` | Detalle de lote — feeds, cosechas, fotos, recordatorios, calendario |
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

`useSocios` en `src/hooks/useSocios.ts` — localStorage + Supabase.
Retorna: `session, login, logout, register, lotes, feeds, cosechas, recordatorios, fotos, ventasSocios, addLote, updateLote, deleteLote, addFeed, addCosecha, addRecordatorio, toggleRecordatorio, deleteRecordatorio, addFoto, deleteFoto, addVentaSocio, deleteVentaSocio, updateName, updateEmail, updateFases, resetAllData, activeLotes, readyLotes, totalKg, avgConv`.

## Vistas disponibles (type View en _shared.ts)

`dashboard | escuela | monitor | lote-detail | ventas | guia | perfil | admin | cosecha`

## Auth

- Login por email o código de socio
- Admins: `admin.zuth/prolarva2025` y `admin/pl2025`
- Demo: código `DEMO` — sin sync a Supabase, con banner ámbar

## Paleta de colores (`S` en _shared.ts)

```
bg: #0d1b2a  |  navy2: #152035  |  green: #22c55e  |  amber: #f59e0b  |  red: #ef4444
```
