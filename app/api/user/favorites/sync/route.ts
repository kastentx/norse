import { auth } from "@/auth";
import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

/**
 * GET /api/user/favorites/sync
 * Get the current user's favorites from remote for syncing to local
 */
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("user_favorites")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows, which is fine for new users
      throw error;
    }

    return NextResponse.json({
      favoriteGods: data?.favorite_gods || [],
      favoriteRealms: data?.favorite_realms || [],
      updatedAt: data?.updated_at || null,
    });
  } catch (error) {
    console.error("Error fetching favorites for sync:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/favorites/sync
 * Push local favorites state to remote
 * Body: { favoriteGods: string[], favoriteRealms: string[] }
 */
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { favoriteGods, favoriteRealms } = body;

    if (!Array.isArray(favoriteGods) || !Array.isArray(favoriteRealms)) {
      return NextResponse.json(
        { error: "Invalid body. Expected favoriteGods and favoriteRealms arrays" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("user_favorites").upsert(
      {
        user_id: session.user.id,
        favorite_gods: favoriteGods,
        favorite_realms: favoriteRealms,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error syncing favorites:", error);
    return NextResponse.json(
      { error: "Failed to sync favorites" },
      { status: 500 }
    );
  }
}
