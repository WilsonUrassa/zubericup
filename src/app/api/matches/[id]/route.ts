import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { verifyToken } from '../../admin/route';

function auth(req: NextRequest): boolean {
  return verifyToken(req.headers.get('x-admin-token') || '');
}

// PATCH /api/matches/[id] — update match fields
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);
  const body = await req.json();
  const db = createServiceClient();
  const { data, error } = await db.from('matches').update(body).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE /api/matches/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);
  const db = createServiceClient();
  await db.from('scorers').delete().eq('match_id', id);
  const { error } = await db.from('matches').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
