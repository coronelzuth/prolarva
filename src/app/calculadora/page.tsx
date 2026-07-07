'use client';

export default function CalculadoraPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)' }}>
      <iframe
        src="https://prolarva-calculadora.vercel.app"
        style={{ flex: 1, border: 'none', width: '100%' }}
        title="Calculadora BSF ProLarva"
        allow="clipboard-write"
      />
    </div>
  );
}
