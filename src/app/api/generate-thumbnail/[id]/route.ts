import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: any
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const [rows] = await db.query(
      `SELECT * FROM thumbnails WHERE userId = ? ORDER BY updated_at DESC`,
      [id]
    );

    return NextResponse.json({ success: true, thumbnails: rows });
  } catch (error) {
    console.error("Error fetching thumbnails:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
