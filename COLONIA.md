# Programa Colonia — Contexto rápido

## Qué es

Landing de venta del Programa Colonia BSF. Grupal, 4 semanas, $400.000 COP (~$96 USD).
- Arranca: 9 sep 2026
- URL: `prolarva.co/colonia`
- Archivo: `src/app/colonia/page.tsx`
- Color principal: verde `#22c55e`

## Oferta

- **Precio:** $400.000 COP
- **Formato:** 4 clases grupales en vivo
- **Promesa:** Primera colonia BSF funcionando en 30 días
- **Cupo:** limitado (urgencia real)

## 3 Bonos incluidos

| Bono | Valor | Estado |
|---|---|---|
| 🧮 Calculadora BSF ProLarva | $97 USD | Activo en `prolarva.co/calculadora` |
| 🛡️ Protocolo Anti-Crisis BSF | $67 USD | Modal interactivo — 7 problemas con diagnóstico y pasos |
| 🌐 Red de Productores BSF | $97 USD | Directorio en `/socios` → Perfil → toggle público |

## Componentes clave

- `ProtocoloCrisisModal` en `src/components/ProtocoloCrisisModal.tsx` — compartido entre `/colonia` (preview) y `/socios` (acceso completo)
- En `/colonia`: botón "👁 Ver un preview →" en la card del Bono 2 abre el modal directamente
- En `/socios`: tarjeta ámbar en Dashboard + botón en BienvenidaModal (fase bonos)

## Zona de socios relacionada

Al comprar el programa, el admin crea un código de invitación desde `AdminView` → tab Invitaciones.
El socio se registra en `prolarva.co/socios` con ese código.
Accede a: Escuela (cronograma 4 semanas), Monitor (se desbloquea en Fase 3), Bonos.

## Flujo de inscripción actual

1. Cliente ve `/colonia` → toca CTA WhatsApp (+57 322 321 2293)
2. Juliana confirma pago manualmente
3. Admin crea código en AdminView → Invitaciones
4. Cliente se registra en `/socios?inv=CODIGO`
5. Primera vez que entra → BienvenidaModal con los 3 bonos animados
