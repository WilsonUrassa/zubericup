import { fetchMatches, fetchNews } from '@/lib/supabase';
import HomeClient from '@/components/HomeClient';

export const revalidate = 0; // always fresh SSR

export default async function HomePage() {
  const [matches, news] = await Promise.all([
    fetchMatches().catch(() => []),
    fetchNews().catch(() => []),
  ]);

  // 2026 championship winner is core-coded so the live homepage
  // does not depend on stale historical Supabase featured-news data.
  const championshipNews = {
    id: -2026,
    title: 'Kili Wonders SC Wachukua Ubingwa wa Zuberi Cup 2026',
    description: 'Kili Wonders SC ndio Mabingwa wa Zuberi Cup 2026.',
    image_url: 'https://zubericup.com/washindi.jpg',
    tag: 'Mabingwa 2026',
    news_date: '2026-08-26',
    featured: true,
  };

  const currentNews = [
    championshipNews,
    ...news.filter((item) => !/Afro Boys FC.*Ubingwa|Ubingwa.*Afro Boys FC/i.test(item.title)),
  ];

  return (
    <>
      <style>{`
        /* Current 2026 champion is displayed here even if the legacy
           champion banner inside HomeClient contains historical text. */
        .champion-banner .champion-eyebrow {
          font-size: 0 !important;
        }
        .champion-banner .champion-eyebrow::after {
          content: '🏆 Mabingwa wa Zuberi Cup 2026';
          font-size: 10px;
          letter-spacing: 0.2em;
        }
        .champion-banner .champion-name {
          font-size: 0 !important;
        }
        .champion-banner .champion-name::after {
          content: 'KILI WONDERS SC';
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 8vw, 96px);
          font-weight: 900;
          line-height: 1;
          color: #fff;
          letter-spacing: 0.01em;
        }
        .champion-banner .champion-sub {
          font-size: 0 !important;
        }
        .champion-banner .champion-sub::after {
          content: 'MABINGWA WA 2026 · MSIMU WA SITA · ZUBERI CUP 2026';
          font-size: 12px;
          letter-spacing: 0.2em;
        }
      `}</style>
      <HomeClient initialMatches={matches} initialNews={currentNews} />
    </>
  );
}
