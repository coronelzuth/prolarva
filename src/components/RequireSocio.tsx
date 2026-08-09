'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function RequireSocio({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('prl-session');
    if (!raw) {
      router.replace('/socios');
    } else {
      setOk(true);
    }
  }, [router]);

  if (!ok) return null;
  return <>{children}</>;
}
