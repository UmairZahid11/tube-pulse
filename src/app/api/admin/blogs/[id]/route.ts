import { NextRequest, NextResponse } from 'next/server';
import {db} from '@/lib/db';

export async function GET(_: Request, { params }: any) {
    const {id} = await params
    const [rows] = await db.query('SELECT * FROM blogs WHERE id = ?', [id]) as any;
    return NextResponse.json(rows[0]);
}

export async function PATCH(req: NextRequest, { params }: any) {
    const {id} = await params
    const { title, content, image } = await req.json();
    await db.query(
        'UPDATE blogs SET title = ?, content = ?, image = ? WHERE id = ?',
        [title, content, image || '', id]
    );
    return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: any) {
    const {id} = await params
    await db.query('DELETE FROM blogs WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
}