import { NextRequest, NextResponse } from "next/server";
import { updateRates } from "@/lib/rates";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const data = await updateRates();
    return NextResponse.json({ ok: true, fecha: data.fecha, actualizadoEn: data.actualizadoEn });
  } catch (err) {
    console.error("Error actualizando tasas:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Error desconocido" },
      { status: 500 },
    );
  }
}
