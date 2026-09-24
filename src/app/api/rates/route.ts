import { NextResponse } from "next/server";
import { getRates } from "@/lib/rates";

export const revalidate = 300;

export async function GET() {
  const data = await getRates();

  if (!data) {
    return NextResponse.json(
      { error: "Aún no hay datos. El cron no se ha ejecutado todavía." },
      { status: 503 },
    );
  }

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
