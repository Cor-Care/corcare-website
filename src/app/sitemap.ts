import type { MetadataRoute } from 'next';
import { clinic } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: clinic.siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    { url: `${clinic.siteUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${clinic.siteUrl}/delete-account`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
