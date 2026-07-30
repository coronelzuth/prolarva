export const metadata = {
  title: 'Política de Privacidad — ProLarva',
  description: 'Cómo ProLarva recopila, usa y protege tu información personal.',
}

export default function PrivacidadPage() {
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px', color: '#e2e8f0', fontFamily: 'Montserrat, sans-serif', lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#f1f5f9' }}>
        Política de Privacidad
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: 40, fontSize: 14 }}>
        Última actualización: 30 de julio de 2026
      </p>

      <Section title="1. Quiénes somos">
        <p>
          <strong>ProLarva</strong> es una plataforma educativa y comercial sobre el cultivo de la Larva Soldado Negra (<em>Hermetia illucens</em>), operada por Juliana Coronel, con sede en Cúcuta, Colombia.
        </p>
        <p>Contacto: <a href="mailto:juliana10zuli@gmail.com" style={{ color: '#22c55e' }}>juliana10zuli@gmail.com</a> | WhatsApp: +57 322 321 2293</p>
      </Section>

      <Section title="2. Qué información recopilamos">
        <Subsection title="Usuarios generales (sin registro)">
          <ul>
            <li>Un identificador de dispositivo anónimo generado automáticamente (<code>device_id</code>) para guardar tu progreso en los módulos educativos.</li>
            <li>Módulos visitados, etapas vistas y respuestas al quiz de diagnóstico (almacenados localmente y en nuestros servidores).</li>
            <li>Especie de animal, número de animales y datos de producción ingresados en la Calculadora BSF, si decides compartirlos vía WhatsApp.</li>
          </ul>
        </Subsection>
        <Subsection title="Usuarios registrados (Zona de Socios)">
          <ul>
            <li>Nombre completo, correo electrónico y contraseña (almacenada con cifrado bcrypt).</li>
            <li>Código de socio y datos de producción: lotes, registros de alimentación, cosechas y ventas.</li>
            <li>Foto de perfil (almacenada localmente en tu dispositivo).</li>
            <li>Suscripción a notificaciones push (identificador de dispositivo).</li>
          </ul>
        </Subsection>
        <Subsection title="Leads de la Calculadora">
          <ul>
            <li>Si ingresas tu nombre o número de WhatsApp al usar la calculadora, guardamos esa información para poder contactarte con información sobre el Kit ProLarva.</li>
          </ul>
        </Subsection>
        <Subsection title="Estadísticas de uso">
          <ul>
            <li>Páginas visitadas y tiempo de navegación, a través de Vercel Analytics (datos agregados y anónimos).</li>
            <li>Visitas al blog por artículo (sin datos personales).</li>
          </ul>
        </Subsection>
      </Section>

      <Section title="3. Para qué usamos tu información">
        <ul>
          <li>Guardar y mostrar tu progreso en los módulos educativos.</li>
          <li>Personalizar recomendaciones según tus respuestas al diagnóstico.</li>
          <li>Gestionar tu cuenta en la Zona de Socios y tus registros de producción.</li>
          <li>Enviarte notificaciones push sobre tus lotes BSF (solo si las activas).</li>
          <li>Contactarte si solicitaste información sobre el Kit ProLarva.</li>
          <li>Mejorar el contenido y la experiencia de la plataforma.</li>
        </ul>
      </Section>

      <Section title="4. Con quién compartimos tu información">
        <p>No vendemos ni cedemos tu información personal a terceros. Solo la compartimos con los proveedores de infraestructura necesarios para operar la plataforma:</p>
        <ul>
          <li><strong>Supabase</strong> — base de datos en la nube (servidores en Estados Unidos).</li>
          <li><strong>Vercel</strong> — hosting y análisis de tráfico.</li>
          <li><strong>Resend</strong> — envío de correos transaccionales (recuperación de contraseña).</li>
          <li><strong>Google Firebase Cloud Messaging</strong> — entrega de notificaciones push.</li>
        </ul>
        <p>Todos estos proveedores operan bajo sus propias políticas de privacidad y cuentan con medidas de seguridad adecuadas.</p>
      </Section>

      <Section title="5. Seguridad de tus datos">
        <ul>
          <li>Las contraseñas se almacenan cifradas con bcrypt (salt 10).</li>
          <li>La comunicación entre tu dispositivo y nuestros servidores se realiza mediante HTTPS.</li>
          <li>El acceso a la Zona de Socios requiere código de invitación generado por el administrador.</li>
          <li>Las operaciones administrativas están protegidas por verificación de rol en el servidor.</li>
        </ul>
      </Section>

      <Section title="6. Tus derechos">
        <p>En cualquier momento puedes:</p>
        <ul>
          <li><strong>Acceder</strong> a tus datos personales.</li>
          <li><strong>Corregir</strong> información incorrecta desde tu perfil.</li>
          <li><strong>Eliminar</strong> tu cuenta y todos tus datos usando el botón "Limpiar mis datos" en Perfil, o escribiéndonos directamente.</li>
          <li><strong>Desactivar</strong> las notificaciones push desde tu perfil en cualquier momento.</li>
          <li><strong>Revocar</strong> el consentimiento para recibir comunicaciones comerciales.</li>
        </ul>
        <p>Para ejercer cualquiera de estos derechos escríbenos a <a href="mailto:juliana10zuli@gmail.com" style={{ color: '#22c55e' }}>juliana10zuli@gmail.com</a>.</p>
      </Section>

      <Section title="7. Cookies y almacenamiento local">
        <p>Usamos <code>localStorage</code> del navegador para guardar tu progreso y sesión sin necesidad de cookies de rastreo. No utilizamos cookies publicitarias ni de seguimiento entre sitios.</p>
      </Section>

      <Section title="8. Menores de edad">
        <p>ProLarva no está dirigida a menores de 13 años y no recopilamos intencionalmente información de menores. Si crees que un menor ha proporcionado datos personales, contáctanos para eliminarlos.</p>
      </Section>

      <Section title="9. Cambios a esta política">
        <p>Podemos actualizar esta política ocasionalmente. Cuando lo hagamos, actualizaremos la fecha al inicio de esta página. Te recomendamos revisarla periódicamente.</p>
      </Section>

      <Section title="10. Contacto">
        <p>Si tienes preguntas sobre esta política o sobre el manejo de tus datos:</p>
        <ul>
          <li>Email: <a href="mailto:juliana10zuli@gmail.com" style={{ color: '#22c55e' }}>juliana10zuli@gmail.com</a></li>
          <li>WhatsApp: <a href="https://wa.me/573223212293" style={{ color: '#22c55e' }}>+57 322 321 2293</a></li>
        </ul>
      </Section>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#22c55e', marginBottom: 16, borderBottom: '1px solid #1e3050', paddingBottom: 8 }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </section>
  )
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>{title}</h3>
      {children}
    </div>
  )
}
