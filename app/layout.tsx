import type { Metadata } from 'next';
import './globals.css';
import './extra.css';
import './mobile.css';
export const metadata: Metadata = {
  title: 'Orbit — Find a direction worth exploring',
  description: 'AI-guided career and skill discovery by ADITYAX. Explore paths before committing to one.',
  openGraph: { title: 'Orbit by ADITYAX', description: 'A more human way to explore your future.' },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
