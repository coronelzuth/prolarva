import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { randomBytes } from 'crypto';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ success: true }); // no revelar nada

    const db = getSupabaseAdmin();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    // Buscar socio por email (sin revelar si existe)
    const { data } = await db.from('socios').select('codigo, nombre').eq('email', email.toLowerCase().trim()).eq('estado', 'activo').single();
    if (!data) return NextResponse.json({ success: true }); // respuesta silenciosa

    // Generar token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hora

    await db.from('password_resets').insert({
      token,
      socio_code: data.codigo,
      email: email.toLowerCase().trim(),
      expires_at: expiresAt,
    });

    // Enviar email
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      const resetUrl = `https://prolarva.co/socios?reset=${token}`;
      await resend.emails.send({
        from: 'ProLarva <noreply@prolarva.co>',
        to: email,
        subject: '🔐 Recupera tu contraseña — ProLarva',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
            <!-- Header -->
            <div style="background: #16a34a; padding: 28px 32px; text-align: center;">
              <span style="font-size: 28px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">Pro<span style="color: #bbf7d0;">Larva</span></span>
              <p style="color: #bbf7d0; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; margin: 4px 0 0; text-transform: uppercase;">Zona de Socios</p>
            </div>
            <!-- Body -->
            <div style="padding: 32px;">
              <h2 style="color: #111827; font-size: 20px; margin: 0 0 8px;">Hola, ${data.nombre} 👋</h2>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">Recibimos una solicitud para restablecer la contraseña de tu cuenta en la Zona de Socios de ProLarva.</p>
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 28px;">Toca el botón para crear una nueva contraseña. El enlace es válido por <strong style="color: #111827;">1 hora</strong>.</p>
              <div style="text-align: center; margin-bottom: 28px;">
                <a href="${resetUrl}" style="display: inline-block; background: #16a34a; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px;">
                  Cambiar contraseña →
                </a>
              </div>
              <div style="background: #f9fafb; border-radius: 8px; padding: 14px 16px; margin-bottom: 24px;">
                <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.5;">⚠️ Si no solicitaste este cambio, ignora este mensaje. Tu contraseña actual sigue siendo la misma y nadie más puede acceder a tu cuenta.</p>
              </div>
            </div>
            <!-- Footer -->
            <div style="border-top: 1px solid #e5e7eb; padding: 16px 32px; text-align: center;">
              <p style="color: #9ca3af; font-size: 11px; margin: 0;">ProLarva · <a href="https://prolarva.co" style="color: #16a34a; text-decoration: none;">prolarva.co</a></p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
