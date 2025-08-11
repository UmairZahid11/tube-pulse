import { inngest } from "@/ingest/clients";
import { authOptions } from "@/lib/authOptions";
import { openai } from "@/lib/openai";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const formData = await req.formData();
  const userId = session?.user.id;
  const userInput = formData.get('userInput');

  const inputData = {
      userInput: userInput,
      userId: userId,
  }

  const result = await inngest.send({
      name: 'generate-aicontent',
      data: inputData
  });

  return NextResponse.json({result})

}
