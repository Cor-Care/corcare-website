import type { MetadataRoute } from 'next';
import { clinic } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${clinic.siteUrl}/sitemap.xml`,
  };
}
