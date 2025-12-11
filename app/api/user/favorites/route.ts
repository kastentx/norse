import { auth } from "@/auth";
import {
  getUserFavorites,
  toggleFavoriteGod,
  toggleFavoriteRealm,
} from "@/lib/data/favorites";
import { NextResponse } from "next/server";

/**
 * GET /api/user/favorites
 * Get the current user's favorites
 */
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const favorites = await getUserFavorites(session.user.id);
    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/favorites
 * Toggle a favorite god or realm
 * Body: { type: "god" | "realm", id: string }
 */
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { type, id } = body;

    if (!type || !id) {
      return NextResponse.json(
        { error: "Missing type or id" },
        { status: 400 }
      );
    }

    if (type === "god") {
      const result = await toggleFavoriteGod(session.user.id, id);
      return NextResponse.json(result);
    }

    if (type === "realm") {
      const result = await toggleFavoriteRealm(session.user.id, id);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: "Invalid type. Must be 'god' or 'realm'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return NextResponse.json(
      { error: "Failed to update favorite" },
      { status: 500 }
    );
  }
}
