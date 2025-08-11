// /app/api/tokens/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const { amount } = await req.json(); // amount can be + or -
    if (typeof amount !== 'number') {
      return new NextResponse('Invalid amount', { status: 400 });
    }

    // Update tokens
    await db.query(
      'UPDATE users SET tokens = tokens + ? WHERE id = ?',
      [amount, session.user.id]
    );

    // Return updated token balance
    const [rows] = await db.query(
      'SELECT tokens FROM users WHERE id = ?',
      [session.user.id]
    ) as [any[], any];

    return NextResponse.json({ tokens: rows[0]?.tokens || 0 });

  } catch (err) {
    console.error('Error updating tokens:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
