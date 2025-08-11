import { inngest } from "@/ingest/clients";
import { authOptions } from "@/lib/authOptions";
import { File } from "buffer";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const getFileBufferData = async(file:File)=>{
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return {
        name: file.name,
        type: file.type,
        size: file.size,
        buffer: buffer.toString('base64'),
    }
}

export async function POST(req:NextRequest) {
    const session = await getServerSession(authOptions)
    const formData = await req.formData();
    const userId = session?.user.id;

    const refImage = formData.get('refImage') as File | null;
    const faceImage = formData.get('faceImage') as File | null;
    const userInput = formData.get('userInput');

    const inputData = {
        userInput: userInput,
        refImage: refImage? await getFileBufferData(refImage) : null,
        faceImage: faceImage? await getFileBufferData(faceImage) : null,
        userId: userId,
    }

    const result = await inngest.send({
        name: 'ai/generate-thumbnail',
        data: inputData
    });

    return NextResponse.json({result})
}

