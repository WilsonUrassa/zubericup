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

  const { data: scorer, error: scorerErr } = await db
    .from('scorers')
    .insert({ match_id, team_side, player_name, minute })
    .select()
    .single();

  if (scorerErr) {
    return NextResponse.json({ error: scorerErr.message }, { status: 500 });
  }

  const { data: match, error: matchErr } = await db
    .from('matches')
    .select('score_a, score_b')
    .eq('id', match_id)
    .single();

  if (matchErr) {
    return NextResponse.json({ error: matchErr.message }, { status: 500 });
  }

  if (team_side === 'A') {
    await db
      .from('matches')
      .update({ score_a: (match?.score_a ?? 0) + 1 })
      .eq('id', match_id);
  } else {
    await db
      .from('matches')
      .update({ score_b: (match?.score_b ?? 0) + 1 })
      .eq('id', match_id);
  }

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

  const { data: scorer, error: scorerErr } = await db
    .from('scorers')
    .select('*')
    .eq('id', id)
    .single();

  if (scorerErr || !scorer) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { error: deleteErr } = await db.from('scorers').delete().eq('id', id);

  if (deleteErr) {
    return NextResponse.json({ error: deleteErr.message }, { status: 500 });
  }

  const { data: match, error: matchErr } = await db
    .from('matches')
    .select('score_a, score_b')
    .eq('id', scorer.match_id)
    .single();

  if (matchErr) {
    return NextResponse.json({ error: matchErr.message }, { status: 500 });
  }

  if (scorer.team_side === 'A') {
    await db
      .from('matches')
      .update({ score_a: Math.max(0, (match?.score_a ?? 1) - 1) })
      .eq('id', scorer.match_id);
  } else {
    await db
      .from('matches')
      .update({ score_b: Math.max(0, (match?.score_b ?? 1) - 1) })
      .eq('id', scorer.match_id);
  }

  return NextResponse.json({ ok: true });
}