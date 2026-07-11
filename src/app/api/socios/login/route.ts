import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const { code, password } = await req.json();

    if (!code || !password) {
      return NextResponse.json({ error: 'Código y contraseña requeridos' }, { status: 400 });
    }

    const db = getSupabaseAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Error de configuración del servidor' }, { status: 500 });
    }

    // Buscar por código o email
    const { data, error } = await db
      .from('socios')
      .select('*')
      .or(`codigo.eq.${code},email.eq.${code}`)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    if (data.estado !== 'activo') {
      return NextResponse.json({ error: 'Cuenta inactiva' }, { status: 403 });
    }

    // Verificar contraseña — soporta tanto hash bcrypt como texto plano (legado)
    let passwordOk = false;
    if (data.password.startsWith('$2')) {
      passwordOk = await bcrypt.compare(password, data.password);
    } else {
      // Contraseña legada en texto plano — validar y migrar al hash
      passwordOk = data.password === password;
      if (passwordOk) {
        const hash = await bcrypt.hash(password, 10);
        await db.from('socios').update({ password: hash }).eq('id', data.id);
      }
    }

    if (!passwordOk) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    return NextResponse.json({ success: true, codigo: data.codigo, nombre: data.nombre });
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
