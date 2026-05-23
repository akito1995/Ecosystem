import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ticker = searchParams.get("ticker");

    if (!ticker) {
      return NextResponse.json({ error: "Ticker is required" }, { status: 400 });
    }

    // Get timestamp for 60 days ago and now to have enough data points
    const to = Math.floor(Date.now() / 1000);
    const from = to - (60 * 24 * 60 * 60);

    const ssiUrl = `https://iboard.ssi.com.vn/dchart/api/history?resolution=D&symbol=${ticker}&from=${from}&to=${to}`;
    
    const response = await fetch(ssiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    const data = await response.json();

    if (data.s !== "ok" || !data.c || data.c.length === 0) {
      return NextResponse.json({ prices: [] });
    }

    // Return the last 20 trading days' closing prices
    const prices = data.c.slice(-20);
    
    return NextResponse.json({ prices });
  } catch (error: any) {
    console.error("Finance API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
