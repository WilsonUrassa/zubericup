import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const SECRET = process.env.ADMIN_SESSION_SECRET || 'zuberi-secret-change-me';
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function signToken(payload: object): string {
  const data = JSON.stringify(payload);
  const sig = createHmac('sha256', SECRET).update(data).digest('hex');
  return Buffer.from(JSON.stringify({ data, sig })).toString('base64');
}

function verifyToken(token: string): boolean {
  try {
    const { data, sig } = JSON.parse(Buffer.from(token, 'base64').toString());
    const expected = createHmac('sha256', SECRET).update(data).digest('hex');
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
    const payload = JSON.parse(data);
    return Date.now() < payload.exp;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (!password || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Nywila si sahihi' }, { status: 401 });
  }
  const token = signToken({ role: 'admin', exp: Date.now() + TOKEN_TTL_MS });
  return NextResponse.json({ token });
}
