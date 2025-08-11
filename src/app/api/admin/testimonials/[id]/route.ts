import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_: NextRequest, { params }: any) {
    const {id} = await params
    const [rows] = await db.query('SELECT * FROM testimonials WHERE id = ?', [id]) as any;
    return NextResponse.json(rows[0]);
}

export async function PATCH(req: NextRequest, { params }: any) {
    const {id} = await params
    const { image, name, position, description, rating } = await req.json();
    await db.query(
        'UPDATE testimonials SET image = ?, name = ?, position = ?, description = ?, rating = ? WHERE id = ?',
        [image, name, position, description, rating, id]
    );
    return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: any) {
    const {id} = await params
    await db.query('DELETE FROM testimonials WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
}