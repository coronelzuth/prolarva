'use client';
import { useMemo, useState } from 'react';
import type { ForoPost, Pregunta } from '@/hooks/useEscuela';
import { S, timeAgo, inputStyle, btnPrimary, btnOutline, SEMANAS_INFO } from './_escuela_shared';

const REACTIONS = ['❤️', '🔥', '💡', '🙌'] as const;
const SEMANAS = [1, 2, 3, 4, 5];

interface Props {
  posts: ForoPost[];
  preguntas: Pregunta[];
  socioCode: string;
  socioNombre: string;
  asAdmin: boolean;
  adminCodes: Set<string>;
  publicarPost: (texto: string, nombre: string, parentId?: string) => Promise<boolean>;
  publicarPregunta: (texto: string, semana: number | null, nombre: string) => Promise<boolean>;
  responderPregunta: (id: string, respuesta: string) => Promise<boolean>;
  eliminarPregunta: (id: string) => void;
  toggleLike: (postId: string, tipo: string) => Promise<void>;
  eliminarPost: (id: string) => void;
  fijarPost: (id: string, fijado: boolean) => void;
}

type FeedItem =
  | { kind: 'post'; date: string; pinned: boolean; post: ForoPost }
  | { kind: 'pregunta'; date: string; pinned: false; pregunta: Pregunta };

const semLabelLarga = (s: number | null) =>
  s ? `Semana ${s}: ${SEMANAS_INFO[s - 1]?.title ?? ''}` : 'General (sin semana)';

export default function EscuelaComunidad({
  posts, preguntas, socioCode, socioNombre, asAdmin, adminCodes,
  publicarPost, publicarPregunta, responderPregunta, eliminarPregunta,
  toggleLike, eliminarPost, fijarPost,
}: Props) {
  // Composer
  const [text, setText] = useState('');
  const [esPregunta, setEsPregunta] = useState(false);
  const [semana, setSemana] = useState<number | null>(1);
  const [posting, setPosting] = useState(false);
  const [success, setSuccess] = useState<'post' | 'pregunta' | null>(null);

  // Feed
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState<'todo' | 'preguntas' | 'pendientes'>('todo');

  // Respuestas del foro
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyPosting, setReplyPosting] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  // Respuestas del admin a preguntas
  const [respDrafts, setRespDrafts] = useState<Record<string, string>>({});

  const pendientes = preguntas.filter(p => !p.respondida).length;

  async function handleLike(postId: string, tipo: string, authorCode: string) {
    const post = posts.find(p => p.id === postId);
    const wasReacted = post?.reactions.some(r => r.socio_code === socioCode && r.tipo === tipo);
    await toggleLike(postId, tipo);
    if (!wasReacted && authorCode !== socioCode) {
      fetch('/api/foro/notify-like', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to_code: authorCode, from_name: socioNombre, tipo }),
      }).catch(() => {});
    }
  }

  async function handleReply(parentId: string, authorCode: string) {
    if (!replyText.trim()) return;
    setReplyPosting(true);
    const ok = await publicarPost(replyText, socioNombre, parentId);
    if (ok) {
      setReplyText('');
      setReplyingTo(null);
      setExpandedReplies(prev => new Set([...prev, parentId]));
      if (authorCode !== socioCode) {
        fetch('/api/foro/notify-reply', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to_code: authorCode, from_name: socioNombre, preview: replyText }),
        }).catch(() => {});
      }
    }
    setReplyPosting(false);
  }

  async function handlePublicar() {
    if (!text.trim() || posting) return;
    setPosting(true);
    const ok = esPregunta
      ? await publicarPregunta(text, semana, socioNombre)
      : await publicarPost(text, socioNombre);
    if (ok) {
      setSuccess(esPregunta ? 'pregunta' : 'post');
      setText('');
      setTimeout(() => setSuccess(null), 2500);
    }
    setPosting(false);
  }

  const feed = useMemo<FeedItem[]>(() => {
    const q = search.trim().toLowerCase();
    const items: FeedItem[] = [
      ...posts.filter(p => !p.parent_id).map(p => ({ kind: 'post' as const, date: p.creado_en, pinned: !!p.fijado, post: p })),
      ...preguntas.map(p => ({ kind: 'pregunta' as const, date: p.creado_en, pinned: false as const, pregunta: p })),
    ];
    return items
      .filter(it => {
        if (filtro === 'preguntas' && it.kind !== 'pregunta') return false;
        if (filtro === 'pendientes' && !(it.kind === 'pregunta' && !it.pregunta.respondida)) return false;
        return true;
      })
      .filter(it => {
        if (!q) return true;
        if (it.kind === 'post') return it.post.contenido.toLowerCase().includes(q) || it.post.socio_nombre.toLowerCase().includes(q);
        return it.pregunta.texto.toLowerCase().includes(q) || it.pregunta.socio_nombre.toLowerCase().includes(q) || (it.pregunta.respuesta ?? '').toLowerCase().includes(q);
      })
      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts, preguntas, search, filtro]);

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>💬 Comunidad</h2>
        <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6 }}>
          Comparte tu avance, celebra tus logros y conecta con el grupo. Si tu mensaje es una <strong style={{ color: S.text }}>duda para resolver en la clase en vivo</strong>, márcalo como pregunta.
        </p>
      </div>

      {/* Composer */}
      <div style={{ background: S.navy2, border: `1px solid ${esPregunta ? 'rgba(245,158,11,0.35)' : S.border}`, borderRadius: 14, padding: '1.1rem', marginBottom: 18, transition: 'border-color 0.15s' }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value.slice(0, 500))}
          placeholder={esPregunta ? 'Escribe tu pregunta para la clase en vivo...' : '¿Qué quieres compartir con el grupo?'}
          style={{ ...inputStyle, resize: 'none', minHeight: 84, marginBottom: 10, background: S.navy }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
          <button
            onClick={() => setEsPregunta(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer',
              background: esPregunta ? 'rgba(245,158,11,0.14)' : 'transparent',
              border: `1px solid ${esPregunta ? 'rgba(245,158,11,0.4)' : S.border}`,
              borderRadius: 20, padding: '6px 12px',
              color: esPregunta ? S.amber : S.muted,
              fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12,
            }}
          >
            <span style={{
              width: 14, height: 14, borderRadius: 4, flexShrink: 0,
              border: `1.5px solid ${esPregunta ? S.amber : S.muted}`,
              background: esPregunta ? S.amber : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, color: '#0d1b2a', fontWeight: 900,
            }}>{esPregunta ? '✓' : ''}</span>
            ❓ Es una pregunta para la clase
          </button>

          {esPregunta && (
            <select
              value={semana === null ? 'g' : semana}
              onChange={e => setSemana(e.target.value === 'g' ? null : Number(e.target.value))}
              style={{ ...inputStyle, width: 'auto', flex: '0 1 auto', fontSize: 12, padding: '7px 10px', cursor: 'pointer' }}
            >
              {SEMANAS.map(s => <option key={s} value={s}>{semLabelLarga(s)}</option>)}
              <option value="g">{semLabelLarga(null)}</option>
            </select>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: text.length > 440 ? S.amber : S.muted }}>{text.length}/500</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {success === 'post' && <span style={{ fontSize: 12, color: S.emerald, fontWeight: 700 }}>✅ Publicado</span>}
            {success === 'pregunta' && <span style={{ fontSize: 12, color: S.amber, fontWeight: 700 }}>✅ Pregunta enviada</span>}
            <button
              style={{ ...btnPrimary, background: esPregunta ? 'linear-gradient(135deg,#f59e0b,#d97706)' : btnPrimary.background, opacity: !text.trim() || posting ? 0.5 : 1 }}
              disabled={!text.trim() || posting}
              onClick={handlePublicar}
            >
              {posting ? 'Enviando...' : esPregunta ? 'Enviar pregunta' : 'Publicar'}
            </button>
          </div>
        </div>
      </div>

      {/* Banner admin pendientes */}
      {asAdmin && pendientes > 0 && filtro !== 'pendientes' && (
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 15 }}>❓</span>
          <span style={{ flex: 1, fontSize: 13, color: S.amber, fontWeight: 700 }}>
            {pendientes} pregunta{pendientes !== 1 ? 's' : ''} sin responder
          </span>
          <button style={{ ...btnOutline, fontSize: 11, padding: '5px 12px', color: S.amber, borderColor: 'rgba(245,158,11,0.4)' }} onClick={() => setFiltro('pendientes')}>
            Ver pendientes
          </button>
        </div>
      )}

      {/* Filtros + búsqueda */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {([['todo', 'Todo'], ['preguntas', '❓ Preguntas'], ['pendientes', '⏳ Sin responder']] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setFiltro(k)}
            style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Montserrat, sans-serif',
              background: filtro === k ? 'rgba(34,197,94,0.14)' : 'transparent',
              color: filtro === k ? S.green2 : S.muted,
              border: `1px solid ${filtro === k ? 'rgba(34,197,94,0.4)' : S.border}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: S.muted, pointerEvents: 'none' }}>🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar en la comunidad..."
          style={{ ...inputStyle, paddingLeft: 34, fontSize: 13 }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: S.muted, fontSize: 14 }}>✕</button>
        )}
      </div>

      {/* Feed */}
      {feed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: S.muted }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>💬</div>
          <p style={{ fontSize: 13 }}>
            {search ? 'Sin resultados para esa búsqueda.'
              : filtro === 'pendientes' ? 'No hay preguntas sin responder. 🎉'
              : filtro === 'preguntas' ? 'Todavía no hay preguntas. Haz la primera.'
              : 'La comunidad está vacía. ¡Sé el primero en publicar!'}
          </p>
        </div>
      ) : (
        <div>
          {feed.map(it => it.kind === 'post' ? (
            <PostCard
              key={`p-${it.post.id}`}
              post={it.post}
              posts={posts}
              socioCode={socioCode}
              asAdmin={asAdmin}
              adminCodes={adminCodes}
              replyingTo={replyingTo} setReplyingTo={setReplyingTo}
              replyText={replyText} setReplyText={setReplyText}
              replyPosting={replyPosting}
              expandedReplies={expandedReplies} setExpandedReplies={setExpandedReplies}
              onLike={handleLike} onReply={handleReply}
              eliminarPost={eliminarPost} fijarPost={fijarPost}
            />
          ) : (
            <PreguntaCard
              key={`q-${it.pregunta.id}`}
              pregunta={it.pregunta}
              socioCode={socioCode}
              asAdmin={asAdmin}
              respDraft={respDrafts[it.pregunta.id] ?? it.pregunta.respuesta ?? ''}
              setRespDraft={v => setRespDrafts(d => ({ ...d, [it.pregunta.id]: v }))}
              responder={responderPregunta}
              eliminar={eliminarPregunta}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Card de post del foro ───────────────────────────────────────────────────

function PostCard({
  post, posts, socioCode, asAdmin, adminCodes,
  replyingTo, setReplyingTo, replyText, setReplyText, replyPosting,
  expandedReplies, setExpandedReplies, onLike, onReply, eliminarPost, fijarPost,
}: {
  post: ForoPost;
  posts: ForoPost[];
  socioCode: string;
  asAdmin: boolean;
  adminCodes: Set<string>;
  replyingTo: string | null; setReplyingTo: (v: string | null) => void;
  replyText: string; setReplyText: (v: string) => void;
  replyPosting: boolean;
  expandedReplies: Set<string>; setExpandedReplies: (fn: (prev: Set<string>) => Set<string>) => void;
  onLike: (postId: string, tipo: string, authorCode: string) => void;
  onReply: (parentId: string, authorCode: string) => void;
  eliminarPost: (id: string) => void;
  fijarPost: (id: string, fijado: boolean) => void;
}) {
  const myReaction = post.reactions.find(r => r.socio_code === socioCode)?.tipo ?? null;
  const isOwn = post.socio_code === socioCode;
  const isPostAdmin = adminCodes.has(post.socio_code);
  const replies = posts.filter(p => p.parent_id === post.id).sort((a, b) => new Date(a.creado_en).getTime() - new Date(b.creado_en).getTime());
  const isReplying = replyingTo === post.id;
  const isExpanded = expandedReplies.has(post.id);

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ background: S.navy2, border: `1px solid ${post.fijado ? 'rgba(245,158,11,0.4)' : isPostAdmin ? 'rgba(34,197,94,0.4)' : S.border}`, borderRadius: 14, padding: '1rem 1.2rem' }}>
        {post.fijado && (
          <div style={{ fontSize: 10, color: S.amber, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>📌 Fijado</div>
        )}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: isPostAdmin ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#334155,#1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 15, flexShrink: 0, marginTop: 1 }}>
            {post.socio_nombre[0]?.toUpperCase() ?? '?'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 8px', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{post.socio_nombre}</span>
              {isPostAdmin && (
                <span style={{ fontSize: 9, fontWeight: 800, background: 'rgba(34,197,94,0.15)', color: S.green, border: '1px solid rgba(34,197,94,0.35)', borderRadius: 20, padding: '1px 7px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>ProLarva ✓</span>
              )}
              <span style={{ fontSize: 11, color: S.muted }}>@{post.socio_code}</span>
              <span style={{ fontSize: 11, color: '#475569', marginLeft: 'auto' }}>{timeAgo(post.creado_en)}</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: S.text, marginBottom: 10, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{post.contenido}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              {REACTIONS.map(emoji => {
                const count = post.reactions.filter(r => r.tipo === emoji).length;
                const active = myReaction === emoji;
                return (
                  <button key={emoji} onClick={() => onLike(post.id, emoji, post.socio_code)}
                    style={{ display: 'flex', alignItems: 'center', gap: 3, background: active ? 'rgba(34,197,94,0.1)' : 'none', border: active ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent', borderRadius: 6, padding: '3px 7px', cursor: 'pointer', fontSize: 12, color: active ? S.green2 : S.muted, fontFamily: 'Montserrat,sans-serif', fontWeight: 600 }}>
                    {emoji}{count > 0 && ` ${count}`}
                  </button>
                );
              })}
              <span style={{ width: 4 }} />
              <button
                onClick={() => { const next = !isReplying; setReplyingTo(next ? post.id : null); setReplyText(''); if (next) setExpandedReplies(prev => new Set([...prev, post.id])); }}
                style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: isReplying ? S.green : S.muted, fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6, fontFamily: 'Montserrat,sans-serif' }}>
                💬 Responder
              </button>
              {replies.length > 0 && (
                <button
                  onClick={() => setExpandedReplies(prev => { const next = new Set(prev); if (next.has(post.id)) next.delete(post.id); else next.add(post.id); return next; })}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: isExpanded ? S.green2 : S.muted, fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6, fontFamily: 'Montserrat,sans-serif' }}>
                  {isExpanded ? '▲' : '▼'} {replies.length} respuesta{replies.length > 1 ? 's' : ''}
                </button>
              )}
              {asAdmin && (
                <button onClick={() => fijarPost(post.id, !post.fijado)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: post.fijado ? S.amber : '#475569', fontSize: 12, padding: '3px', fontFamily: 'Montserrat,sans-serif', marginLeft: 'auto' }} title={post.fijado ? 'Quitar pin' : 'Fijar'}>📌</button>
              )}
              {(isOwn || asAdmin) && (
                <button onClick={() => { if (confirm('¿Eliminar este post y sus respuestas?')) eliminarPost(post.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: 12, padding: '3px', fontFamily: 'Montserrat,sans-serif', marginLeft: asAdmin ? 0 : 'auto' }}>🗑️</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {(isExpanded || isReplying) && (
        <div style={{ marginLeft: 20, borderLeft: `2px solid rgba(34,197,94,0.2)`, paddingLeft: 16, marginTop: 6 }}>
          {isExpanded && replies.map(reply => {
            const rOwn = reply.socio_code === socioCode;
            const rIsAdmin = adminCodes.has(reply.socio_code);
            const myR = reply.reactions.find(r => r.socio_code === socioCode)?.tipo ?? null;
            return (
              <div key={reply.id} style={{ background: S.navy, border: `1px solid ${rIsAdmin ? 'rgba(34,197,94,0.3)' : 'rgba(34,197,94,0.1)'}`, borderRadius: 10, padding: '10px 14px', marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: rIsAdmin ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#334155,#1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 11, flexShrink: 0, marginTop: 1 }}>
                    {reply.socio_nombre[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3px 8px', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{reply.socio_nombre}</span>
                      {rIsAdmin && <span style={{ fontSize: 8, fontWeight: 800, background: 'rgba(34,197,94,0.15)', color: S.green, border: '1px solid rgba(34,197,94,0.35)', borderRadius: 20, padding: '1px 6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>ProLarva ✓</span>}
                      <span style={{ fontSize: 10, color: S.muted }}>@{reply.socio_code}</span>
                      <span style={{ fontSize: 10, color: '#475569', marginLeft: 'auto' }}>{timeAgo(reply.creado_en)}</span>
                    </div>
                    <p style={{ fontSize: 12, lineHeight: 1.6, color: S.text, marginBottom: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{reply.contenido}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                      {REACTIONS.map(emoji => {
                        const cnt = reply.reactions.filter(r => r.tipo === emoji).length;
                        const act = myR === emoji;
                        return (
                          <button key={emoji} onClick={() => onLike(reply.id, emoji, reply.socio_code)}
                            style={{ display: 'flex', alignItems: 'center', gap: 2, background: act ? 'rgba(34,197,94,0.1)' : 'none', border: act ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent', borderRadius: 5, padding: '2px 5px', cursor: 'pointer', fontSize: 11, color: act ? S.green2 : S.muted, fontFamily: 'Montserrat,sans-serif', fontWeight: 600 }}>
                            {emoji}{cnt > 0 && ` ${cnt}`}
                          </button>
                        );
                      })}
                      <span style={{ width: 2 }} />
                      {(rOwn || asAdmin) && (
                        <button onClick={() => { if (confirm('¿Eliminar esta respuesta?')) eliminarPost(reply.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: 11, padding: '2px', fontFamily: 'Montserrat,sans-serif' }}>🗑️</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {isReplying && (
            <div style={{ background: S.navy, border: `1px solid rgba(34,197,94,0.2)`, borderRadius: 10, padding: '10px 14px', marginTop: 4 }}>
              <textarea
                autoFocus value={replyText}
                onChange={e => setReplyText(e.target.value.slice(0, 500))}
                placeholder={`Responder a ${post.socio_nombre}...`}
                style={{ ...inputStyle, resize: 'none', minHeight: 64, marginBottom: 8, fontSize: 12 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: replyText.length > 440 ? S.amber : S.muted }}>{replyText.length}/500</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ ...btnOutline, fontSize: 11, padding: '5px 12px' }} onClick={() => { setReplyingTo(null); setReplyText(''); }}>Cancelar</button>
                  <button style={{ ...btnPrimary, fontSize: 11, padding: '5px 14px', opacity: !replyText.trim() || replyPosting ? 0.5 : 1 }} disabled={!replyText.trim() || replyPosting} onClick={() => onReply(post.id, post.socio_code)}>
                    {replyPosting ? 'Enviando...' : 'Responder'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Card de pregunta ────────────────────────────────────────────────────────

function PreguntaCard({
  pregunta, socioCode, asAdmin, respDraft, setRespDraft, responder, eliminar,
}: {
  pregunta: Pregunta;
  socioCode: string;
  asAdmin: boolean;
  respDraft: string;
  setRespDraft: (v: string) => void;
  responder: (id: string, respuesta: string) => Promise<boolean>;
  eliminar: (id: string) => void;
}) {
  const q = pregunta;
  const mia = q.socio_code === socioCode;
  const [saving, setSaving] = useState(false);

  return (
    <div style={{ marginBottom: 12, background: S.navy2, border: `1px solid ${q.respondida ? S.border : 'rgba(245,158,11,0.35)'}`, borderRadius: 14, padding: '1rem 1.2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 8px', marginBottom: 8 }}>
        <span style={{ fontSize: 9, fontWeight: 800, background: 'rgba(245,158,11,0.14)', color: S.amber, border: '1px solid rgba(245,158,11,0.35)', borderRadius: 20, padding: '1px 8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>❓ Pregunta</span>
        <span style={{ fontSize: 10, color: S.muted, background: 'rgba(148,163,184,0.1)', padding: '2px 8px', borderRadius: 99 }}>{q.semana ? `Semana ${q.semana}` : 'General'}</span>
        <span style={{ fontSize: 12, fontWeight: 700 }}>{q.socio_nombre}</span>
        {mia && <span style={{ fontSize: 10, color: S.muted }}>(tú)</span>}
        <span style={{ fontSize: 10, color: '#475569' }}>{timeAgo(q.creado_en)}</span>
        {q.respondida
          ? <span style={{ fontSize: 10, fontWeight: 700, color: S.emerald, marginLeft: 'auto' }}>✅ Respondida</span>
          : <span style={{ fontSize: 10, fontWeight: 700, color: S.amber, marginLeft: 'auto' }}>⏳ Pendiente</span>}
      </div>

      <p style={{ fontSize: 13, color: S.text, lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{q.texto}</p>

      {q.respuesta && (
        <div style={{ marginTop: 10, borderLeft: `3px solid ${S.green}`, paddingLeft: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: S.green, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Respuesta ProLarva</div>
          <p style={{ fontSize: 13, color: S.text, lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>{q.respuesta}</p>
        </div>
      )}

      {asAdmin && (
        <div style={{ marginTop: 12 }}>
          <textarea
            value={respDraft}
            onChange={e => setRespDraft(e.target.value)}
            placeholder="Escribe la respuesta..."
            style={{ ...inputStyle, resize: 'vertical', minHeight: 60, marginBottom: 8, fontSize: 12 }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={{ ...btnPrimary, fontSize: 12, padding: '7px 16px', opacity: saving ? 0.6 : 1 }}
              disabled={saving}
              onClick={async () => { setSaving(true); await responder(q.id, respDraft); setSaving(false); }}
            >
              {saving ? 'Guardando...' : q.respondida ? 'Actualizar respuesta' : 'Responder'}
            </button>
            <button style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '5px 10px', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}
              onClick={() => { if (confirm('¿Eliminar esta pregunta?')) eliminar(q.id); }}>🗑️</button>
          </div>
        </div>
      )}

      {!asAdmin && mia && !q.respondida && (
        <button style={{ ...btnOutline, fontSize: 11, padding: '4px 10px', marginTop: 10 }} onClick={() => { if (confirm('¿Eliminar tu pregunta?')) eliminar(q.id); }}>
          Eliminar mi pregunta
        </button>
      )}
    </div>
  );
}
