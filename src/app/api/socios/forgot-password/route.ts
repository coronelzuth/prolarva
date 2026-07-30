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
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #0d1b2a; color: #e2e8f0; padding: 32px; border-radius: 12px;">
            <h2 style="color: #4ade80; margin-top: 0;">Hola, ${data.nombre} 🪲</h2>
            <p style="color: #94a3b8; font-size: 14px;">Recibimos una solicitud para cambiar tu contraseña en la Zona de Socios de ProLarva.</p>
            <p style="color: #94a3b8; font-size: 14px;">Este enlace es válido por <strong style="color: #e2e8f0;">1 hora</strong>.</p>
            <div style="text-align: center; margin: 28px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px;">
                Cambiar contraseña →
              </a>
            </div>
            <p style="color: #475569; font-size: 12px;">Si no solicitaste este cambio, ignora este mensaje — tu contraseña seguirá siendo la misma.</p>
            <hr style="border-color: rgba(34,197,94,0.2); margin: 20px 0;" />
            <p style="color: #334155; font-size: 11px; margin: 0;">ProLarva · Zona de Socios · prolarva.co</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
