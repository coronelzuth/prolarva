import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// ⚠️ Actualiza este link cuando crees el grupo de WhatsApp de Colonia
const WA_COLONIA_GROUP = 'https://chat.whatsapp.com/IsIytjcbHgg5LXvPjTYgLM?s=cl&p=a&mlu=4';

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function generarCodigo(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'PRL-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function codigoUnico(db: any): Promise<string> {
  let codigo = generarCodigo();
  for (let i = 0; i < 5; i++) {
    const { data } = await db.from('invitaciones').select('id').eq('codigo', codigo).single();
    if (!data) return codigo;
    codigo = generarCodigo();
  }
  return codigo;
}

async function enviarEmail(email: string, nombre: string, codigo: string) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const resend = new Resend(resendKey);
  const sociosUrl = `https://prolarva.co/socios`;
  const primerNombre = nombre.split(' ')[0];

  await resend.emails.send({
    from: 'Juliana · ProLarva <noreply@prolarva.co>',
    to: email,
    subject: '🌱 Tu acceso al Programa Colonia está listo',
    html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
  <tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,#15803d 0%,#22c55e 100%);padding:40px 40px 32px;text-align:center;">
            <div style="font-size:36px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;margin-bottom:2px;">
              Pro<span style="color:#bbf7d0;">Larva</span>
            </div>
            <div style="font-size:11px;font-weight:700;color:#bbf7d0;letter-spacing:0.16em;text-transform:uppercase;margin-bottom:20px;">
              Programa Colonia
            </div>
            <div style="background:rgba(255,255,255,0.15);border:2px solid rgba(255,255,255,0.3);border-radius:50%;width:64px;height:64px;margin:0 auto;line-height:64px;font-size:30px;">
              🎉
            </div>
          </td>
        </tr>

        <!-- GREETING -->
        <tr>
          <td style="padding:36px 40px 0;">
            <h1 style="margin:0 0 10px;font-size:22px;font-weight:900;color:#111827;line-height:1.3;">
              ¡Bienvenida, ${primerNombre}!
            </h1>
            <p style="margin:0 0 28px;font-size:15px;color:#4b5563;line-height:1.7;">
              Ya estás dentro del Programa Colonia. Aquí tienes todo lo que necesitas para arrancar.
            </p>
          </td>
        </tr>

        <!-- CÓDIGO DE ACCESO -->
        <tr>
          <td style="padding:0 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:2px solid #22c55e;border-radius:14px;">
              <tr>
                <td style="padding:24px;text-align:center;">
                  <div style="font-size:11px;font-weight:700;color:#15803d;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:10px;">
                    Tu código de invitación
                  </div>
                  <div style="font-size:38px;font-weight:900;color:#14532d;letter-spacing:0.12em;font-family:'Courier New',Courier,monospace;margin-bottom:10px;">
                    ${codigo}
                  </div>
                  <div style="font-size:12px;color:#6b7280;line-height:1.5;">
                    Guárdalo — lo necesitas para crear tu cuenta en la app
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- DIVIDER -->
        <tr><td style="padding:28px 40px 0;"><div style="height:1px;background:#e5e7eb;"></div></td></tr>

        <!-- PASOS -->
        <tr>
          <td style="padding:24px 40px 0;">
            <h2 style="margin:0 0 20px;font-size:16px;font-weight:800;color:#111827;">
              Cómo acceder a la app en 3 pasos:
            </h2>

            <!-- Paso 1 -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr>
                <td width="40" valign="top" style="padding-top:2px;">
                  <div style="width:32px;height:32px;background:#22c55e;border-radius:50%;text-align:center;line-height:32px;font-size:14px;font-weight:900;color:#ffffff;">1</div>
                </td>
                <td style="padding-left:14px;">
                  <div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:6px;">📱 Instala la app en tu celular</div>
                  <div style="font-size:13px;color:#6b7280;line-height:1.65;">
                    <strong style="color:#374151;">Android:</strong> Abre <a href="https://prolarva.co" style="color:#16a34a;text-decoration:none;font-weight:600;">prolarva.co</a> en Chrome → menú <strong>(⋮)</strong> → <em>"Añadir a pantalla de inicio"</em><br>
                    <strong style="color:#374151;">iPhone:</strong> Abre <a href="https://prolarva.co" style="color:#16a34a;text-decoration:none;font-weight:600;">prolarva.co</a> en Safari → compartir <strong>(↑)</strong> → <em>"Agregar a pantalla de inicio"</em>
                  </div>
                </td>
              </tr>
            </table>

            <!-- Paso 2 -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr>
                <td width="40" valign="top" style="padding-top:2px;">
                  <div style="width:32px;height:32px;background:#22c55e;border-radius:50%;text-align:center;line-height:32px;font-size:14px;font-weight:900;color:#ffffff;">2</div>
                </td>
                <td style="padding-left:14px;">
                  <div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:6px;">🔐 Ve a la Zona de Socios</div>
                  <div style="font-size:13px;color:#6b7280;line-height:1.65;">
                    Toca <strong>"Socios"</strong> en el menú de la app o entra directamente a <a href="${sociosUrl}" style="color:#16a34a;text-decoration:none;font-weight:600;">prolarva.co/socios</a>.<br>
                    Haz clic en <strong>"¿Eres nuevo? Crear cuenta"</strong>.
                  </div>
                </td>
              </tr>
            </table>

            <!-- Paso 3 -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="40" valign="top" style="padding-top:2px;">
                  <div style="width:32px;height:32px;background:#22c55e;border-radius:50%;text-align:center;line-height:32px;font-size:14px;font-weight:900;color:#ffffff;">3</div>
                </td>
                <td style="padding-left:14px;">
                  <div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:6px;">✅ Ingresa tu código y crea tu contraseña</div>
                  <div style="font-size:13px;color:#6b7280;line-height:1.65;">
                    En el campo <strong>"Código de invitación"</strong> ingresa: <strong style="color:#15803d;font-family:'Courier New',monospace;">${codigo}</strong><br>
                    Llena tus datos, crea una contraseña y ¡listo! Ya estás adentro.
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA SOCIOS -->
        <tr>
          <td style="padding:24px 40px 0;text-align:center;">
            <a href="${sociosUrl}" style="display:inline-block;background:linear-gradient(135deg,#16a34a,#22c55e);color:#ffffff;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.02em;">
              Entrar a mi zona de socios →
            </a>
          </td>
        </tr>

        <!-- DIVIDER -->
        <tr><td style="padding:28px 40px 0;"><div style="height:1px;background:#e5e7eb;"></div></td></tr>

        <!-- WHATSAPP GROUP -->
        <tr>
          <td style="padding:24px 40px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-left:4px solid #22c55e;border-radius:0 10px 10px 0;">
              <tr>
                <td style="padding:18px 20px;">
                  <div style="font-size:14px;font-weight:700;color:#15803d;margin-bottom:6px;">💬 Únete al grupo del programa</div>
                  <div style="font-size:13px;color:#374151;line-height:1.65;margin-bottom:12px;">
                    En el grupo compartimos avances entre sesiones, resolvemos dudas y nos acompañamos como productores.
                  </div>
                  <a href="${WA_COLONIA_GROUP}" style="display:inline-block;background:#25D366;color:#ffffff;padding:10px 22px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">
                    📲 Unirme al grupo WhatsApp
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- DIVIDER -->
        <tr><td style="padding:28px 40px 0;"><div style="height:1px;background:#e5e7eb;"></div></td></tr>

        <!-- LO QUE VIENE -->
        <tr>
          <td style="padding:24px 40px 0;">
            <h2 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#111827;">📅 Lo que viene semana a semana:</h2>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom:10px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;">
                    <tr>
                      <td width="48" style="padding:12px 0 12px 14px;font-size:22px;vertical-align:top;">🌱</td>
                      <td style="padding:12px 14px 12px 8px;vertical-align:top;">
                        <div style="font-size:12px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:2px;">Semana 1</div>
                        <div style="font-size:13px;font-weight:700;color:#111827;">Bases del Sistema</div>
                        <div style="font-size:12px;color:#6b7280;margin-top:2px;">El ciclo BSF, tu primer espacio, materiales y activación de semilla</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:10px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;">
                    <tr>
                      <td width="48" style="padding:12px 0 12px 14px;font-size:22px;vertical-align:top;">🐛</td>
                      <td style="padding:12px 14px 12px 8px;vertical-align:top;">
                        <div style="font-size:12px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:2px;">Semana 2</div>
                        <div style="font-size:13px;font-weight:700;color:#111827;">Manejo del Lote</div>
                        <div style="font-size:12px;color:#6b7280;margin-top:2px;">Alimentación diaria, temperatura, cómo leer el estado de las larvas</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:10px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;">
                    <tr>
                      <td width="48" style="padding:12px 0 12px 14px;font-size:22px;vertical-align:top;">⚖️</td>
                      <td style="padding:12px 14px 12px 8px;vertical-align:top;">
                        <div style="font-size:12px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:2px;">Semana 3</div>
                        <div style="font-size:13px;font-weight:700;color:#111827;">Cosecha y Uso</div>
                        <div style="font-size:12px;color:#6b7280;margin-top:2px;">Cuándo y cómo cosechar, raciones por especie, documentar resultados</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;">
                    <tr>
                      <td width="48" style="padding:12px 0 12px 14px;font-size:22px;vertical-align:top;">🔄</td>
                      <td style="padding:12px 14px 12px 8px;vertical-align:top;">
                        <div style="font-size:12px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:2px;">Semana 4</div>
                        <div style="font-size:13px;font-weight:700;color:#111827;">Ciclo Cerrado</div>
                        <div style="font-size:12px;color:#6b7280;margin-top:2px;">Tu propia semilla, trampas de oviposición, plan de sostenibilidad</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- DIVIDER -->
        <tr><td style="padding:28px 40px 0;"><div style="height:1px;background:#e5e7eb;"></div></td></tr>

        <!-- CONTACTO -->
        <tr>
          <td style="padding:20px 40px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:10px;">
              <tr>
                <td style="padding:16px 20px;">
                  <div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:6px;">¿Tienes alguna duda?</div>
                  <div style="font-size:13px;color:#6b7280;line-height:1.6;">
                    Escríbele directo a Juliana por WhatsApp:<br>
                    <a href="https://wa.me/573223212293" style="color:#16a34a;font-weight:700;text-decoration:none;">+57 322 321 2293</a>
                    · Lunes a viernes · 8am–6pm (Colombia)
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.6;">
              ProLarva · <a href="https://prolarva.co" style="color:#22c55e;text-decoration:none;">prolarva.co</a> · Cúcuta, Colombia 🇨🇴<br>
              Recibiste este email porque te registraste en el Programa Colonia
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>
    `.trim(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, whatsapp } = await req.json();

    if (!nombre?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Nombre y email son obligatorios' }, { status: 400 });
    }

    const db = getDb();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    const emailLower = email.toLowerCase().trim();

    // Si ya se registró → reenviar email con su código
    const { data: existing } = await db
      .from('leads_colonia')
      .select('codigo_invitacion, nombre')
      .eq('email', emailLower)
      .single();

    if (existing?.codigo_invitacion) {
      await enviarEmail(emailLower, existing.nombre || nombre.trim(), existing.codigo_invitacion);
      return NextResponse.json({ success: true });
    }

    // Generar código único
    const codigo = await codigoUnico(db);

    // Guardar lead
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const { error: leadError } = await db.from('leads_colonia').insert({
      id,
      nombre: nombre.trim(),
      email: emailLower,
      whatsapp: whatsapp?.trim() || null,
      codigo_invitacion: codigo,
      created_at: new Date().toISOString(),
    });
    if (leadError) return NextResponse.json({ error: leadError.message }, { status: 500 });

    // Crear invitación en tabla invitaciones
    const invId = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    await db.from('invitaciones').insert({ id: invId, codigo, usado: false });

    // Enviar email de bienvenida
    await enviarEmail(emailLower, nombre.trim(), codigo);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
