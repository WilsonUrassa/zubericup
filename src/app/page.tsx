import { fetchMatches, fetchNews } from '@/lib/supabase';
import HomeClient from '@/components/HomeClient';

export const revalidate = 0; // always fresh SSR

export default async function HomePage() {
  const [matches, news] = await Promise.all([
    fetchMatches().catch(() => []),
    fetchNews().catch(() => []),
  ]);

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

  return <HomeClient initialMatches={matches} initialNews={currentNews} />;
}
