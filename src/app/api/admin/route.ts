import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password || password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'Nywila si sahihi' },
      { status: 401 }
    );
  }

  const token = signToken({
    role: 'admin',
    exp: Date.now() + TOKEN_TTL_MS,
  });

  return NextResponse.json({ token });
}