import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';
import { socioDeToken } from '@/lib/sesion';

export async function POST(req: NextRequest) {
  try {
    const { token, email } = await req.json();
    if (!token || !email) {
      return NextResponse.json({ error: 'Datos requeridos' }, { status: 400 });
    }

    const emailClean = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailClean)) {
      return NextResponse.json({ error: 'Email no válido' }, { status: 400 });
    }

    const db = getServerSupabase();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    const code = await socioDeToken(db, token);
    if (!code) return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });

    // Verificar que el email no esté en uso por otro socio
    const { data: existing } = await db
      .from('socios')
      .select('codigo')
      .eq('email', emailClean)
      .neq('codigo', code)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Ese email ya está registrado por otro socio' }, { status: 409 });
    }

    const { error } = await db
      .from('socios')
      .update({ email: emailClean })
      .eq('codigo', code);

    if (error) return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
