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
| `socios` | Campo `en_colonia boolean` para gestión de cohorte |

---

## Funcionalidades actuales

### Clases
- Admin agrega/edita/activa clases con URL de YouTube
- Embed de YouTube visible para el estudiante
- Botón "Marcar como vista" → guarda en `progreso_clases`
- Badge de progreso por semana en el sidebar (`vis/total` o `✓`)
- Banner informativo por semana (emoji, título, 4 temas — hardcodeado en `SEMANAS_INFO`)

### Plantillas
- Admin sube link (Google Drive) con título y tamaño
- Grid de cards con botón "⬇️ Descargar PDF"

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
- Socios entregan texto (máx 1000 chars) — upsert, pueden actualizar
- Admin ve todas las entregas con nombre, código y timestamp

### Certificado de completación
- Banner 🏆 verde aparece automáticamente cuando el socio completa **todas** las clases activas
- Botón "⬇️ Descargar certificado" genera PNG con Canvas API (1200×800, diseño ProLarva)

### Directorio de la cohorte
- Tab 👥 en sidebar y móvil
- Grid de cards con todos los socios activos
- Badge "✓ En el programa" para socios con `en_colonia = true`
- Admin puede inscribir/retirar socios con botón "+ Inscribir / ✕ Retirar"

### Progreso (solo admin)
- Tabla socios activos × clases activas con ✅/⬜ y % completado

### Vista de preview (solo admin)
- Botón **"👁️ Vista de socio"** en header — oculta todos los controles de admin
- Permite ver exactamente lo que ven los socios sin cerrar sesión

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

**Desktop:** sidebar propio de 176px con semanas + Foro + Directorio + Progreso (admin)
**Móvil:** tabs horizontales superiores (Sem 1/2/3/4 + Foro + 👥 + 📊) + sub-tabs (Clase / Plantillas / Tarea)

El navbar global de la app está oculto dentro de `/socios`.

---

## API relacionada

| Endpoint | Método | Qué hace |
|---|---|---|
| `/api/foro/notify-reply` | POST | Push al autor de un post cuando alguien le responde |
| `/api/foro/notify-like` | POST | Push al autor cuando alguien reacciona a su post |

---

## Estado actual (2026-07-29)

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
