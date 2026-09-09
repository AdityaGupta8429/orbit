import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap { return ['', '/discover', '/login', '/signup'].map(path => ({ url: `https://orbit.adityax.com${path}`, lastModified: new Date() })); }
