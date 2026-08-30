import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://prolarva.co';
  const now = new Date();

  return [
    { url: base,                    lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/colonia`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/kit`,           lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/beneficios`,    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/conocimiento`,  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/metas`,         lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/cosecha`,       lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/calculadora`,   lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
  ];
}
