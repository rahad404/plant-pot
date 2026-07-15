import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mongodb";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { plantId, plantName, price } = body;

    if (!plantId || !plantName || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const order = {
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      plantId,
      plantName,
      price: parseFloat(price),
      status: "paid",
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("orders").insertOne(order);

    await db.collection("care_schedules").insertOne({
      userId: session.user.id,
      plantId,
      plantName,
      orderId: result.insertedId.toString(),
      lastWatered: null,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { order: { ...order, _id: result.insertedId.toString() } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
