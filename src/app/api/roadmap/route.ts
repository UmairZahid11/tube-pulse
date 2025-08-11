import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { db } from '@/lib/db';
import { aiRoadmap } from '../openai';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title } = await req.json();
    if (!title || typeof title !== 'string') {
      return new NextResponse('Invalid title', { status: 400 });
    }

    const aiResult = await aiRoadmap(title);
    // const stringifyResult =  JSON.stringify(aiResult)

    console.log(aiResult, 'ai roadmap resulr', 'type of res', typeof(aiResult))

    // Insert into DB
    const result: any = await db.query(
      'INSERT INTO roadmaps (userId, data, created_at) VALUES (?, ?, NOW())',
      [session.user.id, aiResult]
    );

    const createdId = result[0].insertId;

    return NextResponse.json({
      success: true,
      id: createdId,
      title,
    });
  } catch (err) {
    console.error('[AI_ROADMAP_CREATE_ERROR]', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const [rows] = await db.query(
      'SELECT id, data, created_at FROM roadmaps WHERE userId = ? ORDER BY created_at DESC',
      [session.user.id]
    );

    return NextResponse.json({
      success: true,
      roadmaps: rows,
    });
  } catch (err) {
    console.error('[AI_ROADMAP_FETCH_ERROR]', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}