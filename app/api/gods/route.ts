import { getAllGods } from "@/lib/data/gods";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const gods = await getAllGods();
    return NextResponse.json(gods);
  } catch (error) {
    console.error("Error fetching gods:", error);
    return NextResponse.json(
      { error: "Failed to fetch gods" },
      { status: 500 }
    );
  }
}
