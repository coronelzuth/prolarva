'use client';
import type { ForoPost } from '@/hooks/useEscuela';
import { S, timeAgo, inputStyle, btnPrimary, btnOutline } from './_escuela_shared';

const REACTIONS = ['❤️', '🔥', '💡', '🙌'] as const;

interface EscuelaForoProps {
  posts: ForoPost[];
  socioCode: string;
  socioNombre: string;
  asAdmin: boolean;
  adminCodes: Set<string>;
  // Estado del foro
  foroText: string;
  setForoText: (t: string) => void;
  posting: boolean;
  setPosting: (v: boolean) => void;
  foroSuccess: boolean;
  setForoSuccess: (v: boolean) => void;
  foroSearch: string;
  setForoSearch: (v: string) => void;
  // Respuestas
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  replyText: string;
  setReplyText: (t: string) => void;
  replyPosting: boolean;
  setReplyPosting: (v: boolean) => void;
  expandedReplies: Set<string>;
  setExpandedReplies: (fn: (prev: Set<string>) => Set<string>) => void;
  // Métodos del hook
  publicarPost: (texto: string, nombre: string, parentId?: string) => Promise<boolean>;
  toggleLike: (postId: string, tipo: string) => Promise<void>;
  eliminarPost: (id: string) => void;
  fijarPost: (id: string, fijado: boolean) => void;
  handleLike: (postId: string, tipo: string, authorCode: string) => Promise<void>;
  handleReply: (parentId: string, authorCode: string) => Promise<void>;
  handlePublicar: () => Promise<void>;
}

export function EscuelaForo({
  posts, socioCode, socioNombre, asAdmin, adminCodes,
  foroText, setForoText, posting, foroSuccess,
  foroSearch, setForoSearch,
  replyingTo, setReplyingTo, replyText, setReplyText,
  replyPosting, expandedReplies, setExpandedReplies,
  eliminarPost, fijarPost,
  handleLike, handleReply, handlePublicar,
}: EscuelaForoProps) {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>💬 Foro del grupo</h2>
        <p style={{ fontSize: 13, color: S.muted }}>Comparte tu avance, pregunta lo que sea, conecta con el grupo.</p>
      </div>

      {/* Input publicar */}
      <div style={{ background: S.navy2, border: `1px solid ${S.border}`, borderRadius: 14, padding: '1.25rem', marginBottom: 24 }}>
        <textarea
          value={foroText}
          onChange={e => setForoText(e.target.value.slice(0, 500))}
          placeholder="¿Qué quieres compartir con el grupo?"
          style={{ ...inputStyle, resize: 'none', minHeight: 88, marginBottom: 10, background: S.navy }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: foroText.length > 440 ? S.amber : S.muted }}>
            {foroText.length}/500
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {foroSuccess && <span style={{ fontSize: 12, color: S.emerald, fontWeight: 700 }}>✅ Publicado</span>}
            <button
              style={{ ...btnPrimary, opacity: !foroText.trim() || posting ? 0.5 : 1 }}
              disabled={!foroText.trim() || posting}
              onClick={handlePublicar}
            >
              {posting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: S.muted, pointerEvents: 'none' }}>🔍</span>
        <input
          type="text"
          value={foroSearch}
          onChange={e => setForoSearch(e.target.value)}
          placeholder="Buscar en el foro..."
          style={{ ...inputStyle, paddingLeft: 34, fontSize: 13 }}
        />
        {foroSearch && (
          <button onClick={() => setForoSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: S.muted, fontSize: 14 }}>✕</button>
        )}
      </div>

      {/* Feed */}
      {(() => {
        const topPosts = posts.filter(p => !p.parent_id);
        const filtrados = foroSearch.trim()
          ? topPosts.filter(p =>
              p.contenido.toLowerCase().includes(foroSearch.toLowerCase()) ||
              p.socio_nombre.toLowerCase().includes(foroSearch.toLowerCase())
            )
          : topPosts;
        const ordenados = [...filtrados].sort((a, b) => {
          if (a.fijado && !b.fijado) return -1;
          if (!a.fijado && b.fijado) return 1;
          return 0;
        });

        if (ordenados.length === 0) {
          return (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: S.muted }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>💬</div>
              <p style={{ fontSize: 13 }}>{foroSearch ? 'Sin resultados para esa búsqueda.' : 'El foro está vacío. ¡Sé el primero en publicar!'}</p>
            </div>
          );
        }

        return (
          <div>
            {ordenados.map(post => {
              const myReaction = post.reactions.find(r => r.socio_code === socioCode)?.tipo ?? null;
              const isOwn      = post.socio_code === socioCode;
              const isPostAdmin = adminCodes.has(post.socio_code);
              const replies    = posts
                .filter(p => p.parent_id === post.id)
                .sort((a, b) => new Date(a.creado_en).getTime() - new Date(b.creado_en).getTime());
              const isReplying = replyingTo === post.id;
              const isExpanded = expandedReplies.has(post.id);
              const hasReplies = replies.length > 0;

              return (
                <div key={post.id} style={{ marginBottom: 12 }}>
                  {/* Post principal */}
                  <div style={{
                    background: S.navy2,
                    border: `1px solid ${post.fijado ? 'rgba(245,158,11,0.4)' : isPostAdmin ? 'rgba(34,197,94,0.4)' : S.border}`,
                    borderRadius: 14, padding: '1rem 1.25rem',
                  }}>
                    {post.fijado && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: S.amber, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        📌 Fijado
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: isPostAdmin ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#334155,#1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 15, flexShrink: 0, marginTop: 1 }}>
                        {post.socio_nombre[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 8px', marginBottom: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 700 }}>{post.socio_nombre}</span>
                          {isPostAdmin && (
                            <span style={{ fontSize: 9, fontWeight: 800, background: 'rgba(34,197,94,0.15)', color: S.green, border: '1px solid rgba(34,197,94,0.35)', borderRadius: 20, padding: '1px 7px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                              ProLarva ✓
                            </span>
                          )}
                          <span style={{ fontSize: 11, color: S.muted }}>@{post.socio_code}</span>
                          <span style={{ fontSize: 11, color: '#475569', marginLeft: 'auto' }}>{timeAgo(post.creado_en)}</span>
                        </div>
                        <p style={{ fontSize: 13, lineHeight: 1.65, color: S.text, marginBottom: 10, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {post.contenido}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                          {REACTIONS.map(emoji => {
                            const count = post.reactions.filter(r => r.tipo === emoji).length;
                            const active = myReaction === emoji;
                            return (
                              <button key={emoji} onClick={() => handleLike(post.id, emoji, post.socio_code)}
                                style={{ display: 'flex', alignItems: 'center', gap: 3, background: active ? 'rgba(34,197,94,0.1)' : 'none', border: active ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent', borderRadius: 6, padding: '3px 7px', cursor: 'pointer', fontSize: 12, color: active ? S.green2 : S.muted, fontFamily: 'Montserrat,sans-serif', fontWeight: 600, transition: 'all 0.1s' }}>
                                {emoji}{count > 0 && ` ${count}`}
                              </button>
                            );
                          })}
                          <span style={{ width: 4 }} />
                          <button
                            onClick={() => {
                              const next = !isReplying;
                              setReplyingTo(next ? post.id : null);
                              setReplyText('');
                              if (next) setExpandedReplies(prev => new Set([...prev, post.id]));
                            }}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: isReplying ? S.green : S.muted, fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6, fontFamily: 'Montserrat,sans-serif' }}
                          >
                            💬 Responder
                          </button>
                          {hasReplies && (
                            <button
                              onClick={() => setExpandedReplies(prev => {
                                const next = new Set(prev);
                                if (next.has(post.id)) next.delete(post.id); else next.add(post.id);
                                return next;
                              })}
                              style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: isExpanded ? S.green2 : S.muted, fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6, fontFamily: 'Montserrat,sans-serif' }}
                            >
                              {isExpanded ? '▲' : '▼'} {replies.length} respuesta{replies.length > 1 ? 's' : ''}
                            </button>
                          )}
                          {asAdmin && (
                            <button
                              onClick={() => fijarPost(post.id, !post.fijado)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: post.fijado ? S.amber : '#475569', fontSize: 12, padding: '3px', fontFamily: 'Montserrat,sans-serif', marginLeft: 'auto' }}
                              title={post.fijado ? 'Quitar pin' : 'Fijar post'}
                            >
                              📌
                            </button>
                          )}
                          {(isOwn || asAdmin) && (
                            <button
                              onClick={() => { if (confirm('¿Eliminar este post y sus respuestas?')) eliminarPost(post.id); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: 12, padding: '3px', fontFamily: 'Montserrat,sans-serif', marginLeft: asAdmin ? 0 : 'auto' }}
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hilo de respuestas */}
                  {(isExpanded || isReplying) && (
                    <div style={{ marginLeft: 20, borderLeft: `2px solid rgba(34,197,94,0.2)`, paddingLeft: 16, marginTop: 6 }}>
                      {isExpanded && replies.map(reply => {
                        const myRReaction = reply.reactions.find(r => r.socio_code === socioCode)?.tipo ?? null;
                        const rOwn      = reply.socio_code === socioCode;
                        const rIsAdmin  = adminCodes.has(reply.socio_code);
                        return (
                          <div key={reply.id} style={{ background: S.navy, border: `1px solid ${rIsAdmin ? 'rgba(34,197,94,0.3)' : 'rgba(34,197,94,0.1)'}`, borderRadius: 10, padding: '10px 14px', marginBottom: 8 }}>
                            <div style={{ display: 'flex', gap: 10 }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: rIsAdmin ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#334155,#1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 11, flexShrink: 0, marginTop: 1 }}>
                                {reply.socio_nombre[0]?.toUpperCase() ?? '?'}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3px 8px', marginBottom: 5 }}>
                                  <span style={{ fontSize: 12, fontWeight: 700 }}>{reply.socio_nombre}</span>
                                  {rIsAdmin && (
                                    <span style={{ fontSize: 8, fontWeight: 800, background: 'rgba(34,197,94,0.15)', color: S.green, border: '1px solid rgba(34,197,94,0.35)', borderRadius: 20, padding: '1px 6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                      ProLarva ✓
                                    </span>
                                  )}
                                  <span style={{ fontSize: 10, color: S.muted }}>@{reply.socio_code}</span>
                                  <span style={{ fontSize: 10, color: '#475569', marginLeft: 'auto' }}>{timeAgo(reply.creado_en)}</span>
                                </div>
                                <p style={{ fontSize: 12, lineHeight: 1.6, color: S.text, marginBottom: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                  {reply.contenido}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                                  {REACTIONS.map(emoji => {
                                    const cnt = reply.reactions.filter(r => r.tipo === emoji).length;
                                    const act = myRReaction === emoji;
                                    return (
                                      <button key={emoji} onClick={() => handleLike(reply.id, emoji, reply.socio_code)}
                                        style={{ display: 'flex', alignItems: 'center', gap: 2, background: act ? 'rgba(34,197,94,0.1)' : 'none', border: act ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent', borderRadius: 5, padding: '2px 5px', cursor: 'pointer', fontSize: 11, color: act ? S.green2 : S.muted, fontFamily: 'Montserrat,sans-serif', fontWeight: 600 }}>
                                        {emoji}{cnt > 0 && ` ${cnt}`}
                                      </button>
                                    );
                                  })}
                                  <span style={{ width: 2 }} />
                                  {(rOwn || asAdmin) && (
                                    <button
                                      onClick={() => { if (confirm('¿Eliminar esta respuesta?')) eliminarPost(reply.id); }}
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: 11, padding: '2px', fontFamily: 'Montserrat,sans-serif' }}
                                    >
                                      🗑️
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Input respuesta */}
                      {isReplying && (
                        <div style={{ background: S.navy, border: `1px solid rgba(34,197,94,0.2)`, borderRadius: 10, padding: '10px 14px', marginTop: 4 }}>
                          <textarea
                            autoFocus
                            value={replyText}
                            onChange={e => setReplyText(e.target.value.slice(0, 500))}
                            placeholder={`Responder a ${post.socio_nombre}...`}
                            style={{ ...inputStyle, resize: 'none', minHeight: 64, marginBottom: 8, fontSize: 12 }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 10, color: replyText.length > 440 ? S.amber : S.muted }}>{replyText.length}/500</span>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button style={{ ...btnOutline, fontSize: 11, padding: '5px 12px' }} onClick={() => { setReplyingTo(null); setReplyText(''); }}>
                                Cancelar
                              </button>
                              <button
                                style={{ ...btnPrimary, fontSize: 11, padding: '5px 14px', opacity: !replyText.trim() || replyPosting ? 0.5 : 1 }}
                                disabled={!replyText.trim() || replyPosting}
                                onClick={() => handleReply(post.id, post.socio_code)}
                              >
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
            })}
          </div>
        );
      })()}
    </div>
  );
}
