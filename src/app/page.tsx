import { fetchMatches, fetchNews } from '@/lib/supabase';
import HomeClient from '@/components/HomeClient';

export const revalidate = 0; // always fresh SSR

export default async function HomePage() {
  const [matches, news] = await Promise.all([
    fetchMatches().catch(() => []),
    fetchNews().catch(() => []),
  ]);

  return <HomeClient initialMatches={matches} initialNews={news} />;
}
