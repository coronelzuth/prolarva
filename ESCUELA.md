# Escuela ProLarva — Contexto para agentes

Panel de aprendizaje dentro de la Zona de Socios (`/socios` → tab 🎓 Escuela).
Programa **Colonia**: 4 semanas de clases en vivo para socios inscritos.

---

## Archivos relevantes

| Archivo | Qué hace |
|---|---|
| `src/app/socios/EscuelaView.tsx` | Componente principal — toda la UI del panel |
| `src/hooks/useEscuela.ts` | Hook de estado — consultas directas a Supabase |
| `supabase/escuela.sql` | SQL tablas base: clases, progreso, plantillas, foro |
| `supabase/escuela-alta-prioridad.sql` | SQL: config_escuela, anuncios_escuela, tareas, entregas_tareas |
| `supabase/escuela-media-prioridad.sql` | SQL: foro_likes.tipo, socios.en_colonia |
| `supabase/escuela-baja-prioridad.sql` | SQL: foro_posts.fijado |
| `supabase/cronograma_escuela.sql` | SQL tabla cronograma_dias |
| `supabase/fases-progreso.sql` | SQL columnas fases_aprobadas + fase_en_revision en tabla socios |
| `src/app/api/push/cronograma-reminder/route.ts` | Endpoint push recordatorio del cronograma |
| `src/app/api/socios/marcar-fase/route.ts` | POST {code, fase} — socio marca su fase como lista para revisar |
| `src/app/api/socios/aprobar-fase/route.ts` | POST {adminCode, code, fase} — admin aprueba una fase de un socio |

---

## Tablas Supabase

| Tabla | Qué guarda |
|---|---|
| `clases` | Clases por semana (1–4): título, descripción, URL YouTube, activa/inactiva |
| `progreso_clases` | Qué clases marcó como vistas cada socio |
| `plantillas` | PDFs descargables por semana (título, URL Drive, tamaño) |
| `foro_posts` | Posts del foro + respuestas anidadas (`parent_id`) + `fijado` boolean |
| `foro_likes` | Reacciones por post y socio — columna `tipo` (❤️🔥💡🙌) |
| `config_escuela` | Configuración general — clave `proxima_clase` para el countdown |
| `anuncios_escuela` | Tablón de anuncios con `fijado` boolean |
| `tareas` | Tareas semanales: pregunta, semana, activa/inactiva |
| `entregas_tareas` | Respuestas de socios a las tareas (UNIQUE tarea_id+socio_code) |
| `socios` | Campos `en_colonia boolean` + `fases_aprobadas INTEGER` + `fase_en_revision INTEGER` |
| `cronograma_dias` | Días individuales del programa: fecha, semana, tipo, título, descripción |

---

## Funcionalidades actuales

### Cronograma (2026-07-30) ← NUEVA VISTA PRINCIPAL
- Tab **📅 Cronograma** es ahora la vista de entrada de la Escuela
- Grid de 4 columnas (una por semana) con días individuales y sus actividades
- Cada semana es colapsable (clic en header ▶/▼) — muestra emoji + título, sin "Sem X"
- Badge **HOY** en verde cuando hay actividad ese día
- Días pasados con opacidad reducida; día de hoy resaltado en verde
- **Al hacer clic en un día** se expande un panel inline con el contenido:
  - Tipo `clase` → embed YouTube + botón "Marcar como vista"
  - Tipo `tarea` → pregunta + textarea + botón entregar
  - Tipo `recurso` → grid de PDFs descargables
  - Tipos `reporte` / `libre` → solo info descriptiva
- Clic de nuevo → colapsa el panel
- Admin: botón **"+ Agregar actividad"** con modal (fecha, semana, tipo, título, descripción)
- Admin: botón **"+"** en el header de cada semana para agregar rápido
- Admin: botón ✏️ en cada día para editar/eliminar
- Admin: botón **"📲 Enviar recordatorio"** → push inmediato a todos los suscritos con la próxima actividad
- Tipos de actividad: `clase` 🎥 / `tarea` 📝 / `reporte` 📊 / `recurso` 📄 / `libre` 🗓️

### Navegación actualizada
- **Socios**: sidebar y tabs móviles muestran solo Cronograma → Foro → Directorio
- **Admin**: además tiene sección "Gestionar" con ⚙️ Semana 1-4 para gestionar clases, plantillas y tareas
- Los tabs "Sem 1-4" ya NO aparecen para socios — el cronograma es el punto de entrada

### Clases
- Admin agrega/edita/activa clases con URL de YouTube, asignadas a una semana
- Embed de YouTube accesible desde el panel expandible del cronograma (tipo `clase`)
- Botón "Marcar como vista" → guarda en `progreso_clases`
- Badge de progreso por semana visible en la sección Gestionar (admin)

### Plantillas
- Admin sube link (Google Drive) con título y tamaño, asignadas a semana
- Accesibles desde el panel expandible del cronograma (tipo `recurso`)

### Foro
- Publicar posts (máx 500 chars)
- **Respuestas anidadas** con `parent_id` — hilo colapsado por defecto
- Botón `▼ X respuestas` para expandir/colapsar el hilo
- **4 reacciones** ❤️ 🔥 💡 🙌 en posts y respuestas (una por usuario, cambiable)
- Eliminar: autor o admin
- **Badge ProLarva ✓** en posts/respuestas de cuentas con `rol = admin`
- **Notificación push** al autor cuando alguien le responde (`/api/foro/notify-reply`)
- **Notificación push** al autor cuando alguien reacciona (`/api/foro/notify-like`)
- **Pin de posts** (solo admin) — botón 📌 por post; los fijados aparecen arriba con borde ámbar
- **Búsqueda** — input encima del feed, filtra por contenido o nombre de socio en tiempo real

### Tablón de anuncios
- Admin publica anuncios (máx 600 chars) con opción de fijar 📌
- Visible para todos los socios como card ámbar colapsable
- Admin puede toggle pin y eliminar

### Countdown próxima clase
- Banner azul sobre las tabs con cuenta regresiva `Xd Yh Zm`
- Cambia a verde "¡Clase en curso!" cuando la fecha pasa
- Admin edita fecha con datetime-local input

### Tareas semanales
- Admin crea pregunta por semana (activa/inactiva)
- Socios entregan texto (máx 1000 chars) desde el panel expandible del cronograma (tipo `tarea`)
- Admin ve todas las entregas con nombre, código y timestamp

### Certificado de completación
- Banner 🏆 verde aparece automáticamente cuando el socio completa **todas** las clases activas
- Botón "⬇️ Descargar certificado" genera PNG con Canvas API (1200×800, diseño ProLarva)

### Directorio de la cohorte
- Tab 👥 en sidebar y móvil
- Grid de cards con todos los socios activos
- Badge "✓ En el programa" para socios con `en_colonia = true`
- Admin puede inscribir/retirar socios con botón "+ Inscribir / ✕ Retirar"

### Progreso de Fases (2026-07-30) ← NUEVO
Sistema de aprobación de fases del Programa Colonia. Flujo: **socio marca → admin aprueba → barra avanza → Monitor se desbloquea**.

**Para el socio:**
- Botón "📩 Marcar fase como lista para revisar" en FaseModal (tab descripción)
- Valida que sea la fase siguiente a la aprobada y que no haya otra en revisión
- Badge de estado: "En revisión ⏳" o "✅ Aprobada"
- Barra de progreso de 5 segmentos en el Cronograma (verde=aprobada, ámbar=en revisión)
- Al llegar a 3 fases aprobadas: badge "🔬 Monitor desbloqueado"

**Para el admin (tab Progreso):**
- Sección "⏳ Fases pendientes de aprobación" — lista socios con fase_en_revision > 0
- Botón "✅ Aprobar Fase X" por socio → llama `/api/socios/aprobar-fase` → actualiza UI local inmediatamente

**Columnas en Supabase (`socios`):**
- `fases_aprobadas INTEGER DEFAULT 0` — cuántas fases fueron aprobadas por el admin
- `fase_en_revision INTEGER DEFAULT 0` — qué fase está esperando revisión (0 = ninguna)

**El Monitor se desbloquea** cuando `fases_aprobadas >= 3` (o si es admin).

### Progreso de clases (solo admin)
- Tabla socios activos × clases activas con ✅/⬜ y % completado

### Vista de preview (solo admin)
- Botón **"👁️ Vista de socio"** en header — oculta todos los controles de admin

---

## Tipos del cronograma (`TipoDia`)

| Tipo | Emoji | Label | Panel expandible muestra |
|---|---|---|---|
| `clase` | 🎥 | Clase en vivo | Embed YouTube + marcar vista |
| `tarea` | 📝 | Tarea | Pregunta + textarea entrega |
| `recurso` | 📄 | Recurso | Grid PDFs descargables |
| `reporte` | 📊 | Reporte | Descripción del día |
| `libre` | 🗓️ | Actividad libre | Descripción del día |

---

## Contenido por semana (hardcodeado en SEMANAS_INFO)

| Semana | Título | Temas |
|---|---|---|
| 1 🌱 | Bases del Sistema | Ciclo BSF sin tecnicismos · Espacio desde 1m² · Materiales · Activar semilla |
| 2 🐛 | Manejo del Lote | Alimentación diaria · Temperatura y humedad · Leer estado de larvas · Imprevistos |
| 3 ⚖️ | Cosecha y Uso | Cuándo cosechar · Larva viva/seca/harina · Raciones por especie · Calcular ahorro |
| 4 🔄 | Ciclo Cerrado | Generar semilla propia · Trampas de oviposición · Sostenibilidad · Revisión final |

---

## Navegación

**Desktop:** sidebar 176px — Cronograma (vista principal) → Foro → Directorio → sección Gestionar solo para admin (Semana 1-4 con sub-items Clase/Plantillas/Tarea) → Progreso (admin)
**Móvil:** tabs horizontales — Cronograma → Foro → 👥 → para admin: ⚙️ S1-S4 + 📊

El navbar global de la app está oculto dentro de `/socios`.

---

## API relacionada

| Endpoint | Método | Qué hace |
|---|---|---|
| `/api/foro/notify-reply` | POST | Push al autor de un post cuando alguien le responde |
| `/api/foro/notify-like` | POST | Push al autor cuando alguien reacciona a su post |
| `/api/push/cronograma-reminder` | POST | Push a todos los suscritos con la próxima actividad del cronograma |
| `/api/socios/marcar-fase` | POST | Socio envía su fase a revisión — valida orden y no duplicados |
| `/api/socios/aprobar-fase` | POST | Admin aprueba la fase de un socio — requiere adminCode con rol=admin |

---

## Estado actual (2026-07-30)

- ✅ Clases + plantillas + foro funcionando en producción
- ✅ Respuestas anidadas con collapse y notificación push
- ✅ Badge ProLarva ✓ para admins
- ✅ Banner de temas por semana
- ✅ Tablón de anuncios + Countdown + Tareas semanales
- ✅ 4 reacciones (❤️🔥💡🙌) con notificación push al autor
- ✅ Directorio de cohorte + gestión de inscripción (admin)
- ✅ Certificado de completación descargable (Canvas PNG)
- ✅ Vista de preview para admin ("👁️ Vista de socio")
- ✅ Búsqueda en el foro (client-side)
- ✅ Pin de posts en el foro (solo admin)
- ✅ **Cronograma con días individuales** — tabla `cronograma_dias`, grid colapsable por semana, panel expandible inline por actividad
- ✅ **Sem 1-4 ocultas para socios** — solo accesibles vía cronograma o para admin en sección Gestionar
- ✅ **Push de recordatorio del cronograma** — endpoint `/api/push/cronograma-reminder`
- ✅ **Sistema de fases** (sesión 17, 2026-07-30) — columnas `fases_aprobadas`+`fase_en_revision` en socios (SQL ejecutado), flujo socio→admin→aprobación, barra de progreso en Cronograma, panel de aprobación en tab Progreso, Monitor se desbloquea en Fase 3
