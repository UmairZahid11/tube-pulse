import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import pdf from 'pdf-parse';

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLICKEY!,
  privateKey: process.env.IMAGEKIT_PRIVATEKEY!,
  urlEndpoint: process.env.IMAGEKIT_URLENDPOINT!
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const filename = formData.get('filename') as string;

    if (!file || !filename) {
      return new NextResponse('Missing file or filename', { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const pdfData = await pdf(buffer);
    const resumeText = pdfData.text;

    // Upload file to ImageKit
    const uploadResponse = await imageKit.upload({
      file: buffer,
      fileName: `resume-${Date.now()}.pdf`,
      isPublished: true,
      useUniqueFileName: false,
    });

    // Insert into DB with status=processing
    const result: any = await db.query(
      'INSERT INTO resumes (userId, filename, fileUrl, resume_text, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [session.user.id, filename, uploadResponse.url, resumeText, 'processing']
    );

    const createdRecordId = result[0].insertId;

    return NextResponse.json({
      success: true,
      id: createdRecordId,
      resumeUrl: uploadResponse.url,
      filename,
    });
  } catch (err) {
    console.error('[RESUME_UPLOAD_ERROR]', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const [resumes]: any = await db.query(
      'SELECT id, filename, fileUrl, status, created_at FROM resumes WHERE userId = ? ORDER BY created_at DESC',
      [session.user.id]
    );

    return NextResponse.json({ success: true, resumes });
  } catch (err) {
    console.error('[RESUME_FETCH_ERROR]', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}