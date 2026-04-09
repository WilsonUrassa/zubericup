import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { verifyToken } from '../admin/route';

function auth(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token') || '';
  return verifyToken(token);
}

// GET /api/matches — public
export async function GET() {
  const db = createServiceClient();
  const { data: matchData } = await db.from('matches').select('*').order('created_at');
  const { data: scorerData } = await db.from('scorers').select('*').order('minute');
  const matches = (matchData || []).map((m) => ({
    ...m,
    scorers: (scorerData || []).filter((s: { match_id: number }) => s.match_id === m.id),
  }));
  return NextResponse.json(matches);
}

// POST /api/matches — create new match (admin)
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const db = createServiceClient();
  const { data, error } = await db
    .from('matches')
    .insert({
      team_a: body.team_a,
      team_b: body.team_b,
      score_a: body.score_a ?? 0,
      score_b: body.score_b ?? 0,
      minute: body.minute ?? 0,
      status: body.status ?? 'upcoming',
      venue: body.venue ?? 'Uwanja wa Railway',
      match_date: body.match_date ?? new Date().toISOString().slice(0, 10),
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
