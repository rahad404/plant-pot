import { NextResponse } from "next/server";
import { db } from "@/lib/mongodb";

export async function GET() {
  try {
    const categories = await db
      .collection("categories")
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
