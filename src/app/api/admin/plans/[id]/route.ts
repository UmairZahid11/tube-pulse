import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: any) {
  const { id } = await params;
  const [rows] = await db.query('SELECT * FROM plans WHERE id = ?', [id]) as any;
  return NextResponse.json(rows[0]);
}

export async function PATCH(req: Request, { params }: any) {
  const planId = await params.id;

  if (!planId) {
    return NextResponse.json({ error: 'planId is required' }, { status: 400 });
  }

  const body = await req.json();
  const { 
    name,
    price,
    description,
    tokens,
    thumbnailCost,
    thumbnailSearchCost,
    careerCost,
    contentCost
  } = body;

  await db.query(
    `UPDATE plans 
     SET name = ?, price = ?, description = ?, tokens = ?, thumbnail_cost = ?, thumbnail_search_cost = ?, ai_career_cost = ?, content_generation_cost = ? 
     WHERE id = ?`,
    [name, price, description, tokens, thumbnailCost, thumbnailSearchCost, careerCost , contentCost ,planId]
  );

  return NextResponse.json({ message: 'Plan updated' });
}