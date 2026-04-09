import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { team_name, coach_name, phone, location, players_count, notes } = body;

  if (!team_name || !coach_name || !phone) {
    return NextResponse.json({ error: 'Tafadhali jaza sehemu zote zinazohitajika' }, { status: 400 });
  }

  const db = createServiceClient();
  const { data, error } = await db
    .from('registrations')
    .insert({ team_name, coach_name, phone, location, players_count: players_count || 11, notes })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
