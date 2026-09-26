import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const placeId = request.nextUrl.searchParams.get("placeId");
  if (!placeId || !/^\d+$/.test(placeId)) {
    return NextResponse.json({ error: "Invalid placeId" }, { status: 400 });
  }

  try {
    const universeRes = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`, { cache: "no-store" });
    if (!universeRes.ok) return NextResponse.json({ error: "Could not resolve universe" }, { status: 502 });

    const { universeId } = await universeRes.json();
    if (!universeId) return NextResponse.json({ error: "Universe not found" }, { status: 404 });

    const gameRes = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`, { cache: "no-store" });
    if (!gameRes.ok) return NextResponse.json({ error: "Could not fetch game stats" }, { status: 502 });

    const data = await gameRes.json();
    const game = data.data?.[0];
    if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });

    return NextResponse.json({
      universeId: String(universeId),
      playing: game.playing ?? 0,
      visits: game.visits ?? 0,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to reach Roblox services" }, { status: 500 });
  }
}