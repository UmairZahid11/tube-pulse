import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: any
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const awaitedParams = await params

    const [rows]: any = await db.query(
      'SELECT * FROM roadmaps WHERE id = ? AND userId = ?',
      [awaitedParams.id, session.user.id]
    )

    if (!rows || rows.length === 0) {
      return new NextResponse('Roadmap not found', { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (err) {
    console.error('[ROADMAP_DETAIL_ERROR]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
