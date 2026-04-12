import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zuberi Cup 2026 — Mashindano Makubwa ya Soka Mkoani Kilimanjaro',
  description: 'Mashindano Makubwa ya Soka Mkoani Kilimanjaro. yanayodhaminiwa na Mstahiki Meya Zuberi Abdallah Kidumo.',
  openGraph: {
    title: 'Zuberi Cup 2025',
    description: 'Mchuano wa Kilimanjaro',
    images: ['https://zubericup.com/logozuberi.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sw">
      <body>{children}</body>
    </html>
  );
}
