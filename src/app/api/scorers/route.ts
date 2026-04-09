import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { verifyToken } from '@/lib/auth';

function auth(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token');
  return verifyToken(token);
}

// POST /api/scorers — add a goal scorer
export async function POST(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { match_id, team_side, player_name, minute } = await req.json();
  const db = createServiceClient();

  // Insert scorer
  const { data: scorer, error: scorerErr } = await db
    .from('scorers')
    .insert({ match_id, team_side, player_name, minute })
    .select()
    .single();

  if (scorerErr) {
    return NextResponse.json({ error: scorerErr.message }, { status: 500 });
  }

  // Increment score
  const col = team_side === 'A' ? 'score_a' : 'score_b';

  const { data: match } = await db
    .from('matches')
    .select(col)
    .eq('id', match_id)
    .single();

  await db
    .from('matches')
    .update({ [col]: (match?.[col] ?? 0) + 1 })
    .eq('id', match_id);

  return NextResponse.json(scorer);
}

// DELETE /api/scorers?id=1 — remove a scorer
export async function DELETE(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const db = createServiceClient();

  // Get scorer before deleting
  const { data: scorer } = await db
    .from('scorers')
    .select('*')
    .eq('id', id)
    .single();

  if (!scorer) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await db.from('scorers').delete().eq('id', id);

  const col = scorer.team_side === 'A' ? 'score_a' : 'score_b';

  const { data: match } = await db
    .from('matches')
    .select(col)
    .eq('id', scorer.match_id)
    .single();

  await db
    .from('matches')
    .update({ [col]: Math.max(0, (match?.[col] ?? 1) - 1) })
    .eq('id', scorer.match_id);

  return NextResponse.json({ ok: true });
}