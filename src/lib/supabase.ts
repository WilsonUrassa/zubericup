import { createClient } from '@supabase/supabase-js';

export type MatchStatus = 'upcoming' | 'live' | 'ft';

export interface Scorer {
  id: number;
  match_id: number;
  team_side: 'A' | 'B';
  player_name: string;
  minute: number;
}

export interface Match {
  id: number;
  team_a: string;
  team_b: string;
  score_a: number;
  score_b: number;
  minute: number;
  status: MatchStatus;
  venue: string;
  match_date: string;
  scorers?: Scorer[];
}

export interface NewsItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  tag: string;
  news_date: string;
  featured: boolean;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public client (read-only data)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fetch all matches with their scorers
export async function fetchMatches(): Promise<Match[]> {
  const { data: matchData, error: matchError } = await supabase
    .from('matches')
    .select('*')
    .order('created_at', { ascending: true });

  if (matchError) throw matchError;

  const { data: scorerData, error: scorerError } = await supabase
    .from('scorers')
    .select('*')
    .order('minute', { ascending: true });

  if (scorerError) throw scorerError;

  return (matchData || []).map((m) => ({
    ...m,
    scorers: (scorerData || []).filter((s) => s.match_id === m.id),
  }));
}

export async function fetchNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('news_date', { ascending: false });
  if (error) throw error;
  return data || [];
}
