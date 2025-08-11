import { NextRequest, NextResponse } from "next/server";
import {db} from "@/lib/db";
export async function GET(
  req: NextRequest,
  { params }: any
) {
  try {
    const id = await params.id;

    if (!id) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const [rows] = await db.query(
      "SELECT * FROM ai_content_generator WHERE userId = ? ORDER BY created_at DESC",
      [id]
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error("Error fetching AI content:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
