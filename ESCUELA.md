# Escuela ProLarva — Contexto para agentes

Panel de aprendizaje dentro de la Zona de Socios (`/socios` → tab 🎓 Escuela).
Programa **Colonia**: 4 semanas de clases en vivo para socios inscritos.

---

## Archivos relevantes

| Archivo | Qué hace |
|---|---|
| `src/app/socios/EscuelaView.tsx` | Componente principal — toda la UI del panel |
| `src/hooks/useEscuela.ts` | Hook de estado — consultas directas a Supabase |
| `supabase/escuela.sql` | SQL de creación de tablas (referencia) |

---

## Tablas Supabase

| Tabla | Qué guarda |
|---|---|
| `clases` | Clases por semana (1–4): título, descripción, URL YouTube, activa/inactiva |
| `progreso_clases` | Qué clases marcó como vistas cada socio |
| `plantillas` | PDFs descargables por semana (título, URL Drive, tamaño) |
| `foro_posts` | Posts del foro + respuestas anidadas (`parent_id`) |
| `foro_likes` | Likes por post y socio |

---

## Funcionalidades actuales

### Clases
- Admin agrega/edita/activa clases con URL de YouTube
- Embed de YouTube visible para el estudiante
- Botón "Marcar como vista" → guarda en `progreso_clases`
- Badge de progreso por semana en el sidebar (`vis/total` o `✓`)

### Plantillas
- Admin sube link (Google Drive) con título y tamaño
- Grid de cards con botón "⬇️ Descargar PDF"

### Foro
- Publicar posts (máx 500 chars)
- **Respuestas anidadas** con `parent_id` — hilo colapsado por defecto
- Botón `▼ X respuestas` para expandir/colapsar el hilo
- Likes ❤️ en posts y respuestas
- Eliminar: autor o admin
- **Badge ProLarva ✓** en posts/respuestas de cuentas con `rol = admin`
- **Notificación push** al autor cuando alguien le responde (endpoint `/api/foro/notify-reply`)
  - No se notifica si el autor se responde a sí mismo
  - Solo funciona si el socio tiene push activado

### Progreso (solo admin)
- Tabla socios activos × clases activas con ✅/⬜ y % completado

### Banner informativo por semana
Antes del video de cada semana aparece un banner verde con el emoji, título y 4 temas de esa sesión (datos hardcodeados en `SEMANAS_INFO` dentro de `EscuelaView.tsx`).

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

**Desktop:** sidebar propio de 176px con semanas + Foro + Progreso (admin)
**Móvil:** tabs horizontales superiores (Sem 1/2/3/4 + Foro) + sub-tabs (Clase / Plantillas)

El navbar global de la app está oculto dentro de `/socios`.

---

## API relacionada

| Endpoint | Método | Qué hace |
|---|---|---|
| `/api/foro/notify-reply` | POST | Envía push al autor de un post cuando alguien le responde |

---

## Estado actual (2026-07-29)

- ✅ Clases + plantillas + foro funcionando en producción
- ✅ Respuestas anidadas con collapse y notificación push
- ✅ Badge ProLarva ✓ para admins
- ✅ Banner de temas por semana

## Pendientes

- [ ] Notificación cuando alguien da like a tu post (opcional)
- [ ] Búsqueda dentro del foro
- [ ] Fijar posts importantes (pin) — solo admin
