import { createHmac, timingSafeEqual } from 'crypto';

const SECRET = process.env.ADMIN_SESSION_SECRET || 'zuberi-secret-change-me';

export function signToken(payload: object): string {
  const data = JSON.stringify(payload);
  const sig = createHmac('sha256', SECRET).update(data).digest('hex');

  return Buffer.from(JSON.stringify({ data, sig })).toString('base64');
}

export function verifyToken(token: string | null): boolean {
  if (!token) return false;

  try {
    const { data, sig } = JSON.parse(
      Buffer.from(token, 'base64').toString()
    );

    const expected = createHmac('sha256', SECRET)
      .update(data)
      .digest('hex');

    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return false;
    }

    const payload = JSON.parse(data);
    return Date.now() < payload.exp;
  } catch {
    return false;
  }
}