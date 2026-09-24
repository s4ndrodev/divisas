import { redis, RATES_KEY } from "@/lib/redis";
import { KEY_ALIASES } from "@/lib/constants";
import type {
  HistorialMap,
  RateMap,
  RatesData,
  Snapshot,
} from "@/types/rates";

const TZ_CUBA = "America/Havana";

/** Fecha de hoy en la zona horaria de Cuba, como YYYY-MM-DD (equivalente al zoneinfo del script Python). */
function fechaHoyCuba(): string {
  // en-CA produce el formato YYYY-MM-DD directamente.
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ_CUBA }).format(
    new Date(),
  );
}

function timestampCuba(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ_CUBA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
}

/** Aplica KEY_ALIASES igual que el frontend/script original. */
function normalizar(tasas: Record<string, unknown>): RateMap {
  const resultado: RateMap = {};
  for (const [rawKey, rawVal] of Object.entries(tasas ?? {})) {
    const key = KEY_ALIASES[rawKey] ?? rawKey;
    const val = typeof rawVal === "number" ? rawVal : parseFloat(String(rawVal));
    if (Number.isFinite(val)) resultado[key] = val;
  }
  return resultado;
}

async function fetchElToque(): Promise<RateMap> {
  const token = process.env.ELTOQUE_API_TOKEN;
  if (!token) throw new Error("Falta ELTOQUE_API_TOKEN");

  const res = await fetch("https://tasas.eltoque.com/v1/trmi", {
    headers: { Accept: "*/*", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`ElToque respondió ${res.status}`);

  const data = (await res.json()) as { tasas?: Record<string, unknown> };
  return normalizar(data.tasas ?? {});
}

async function fetchBcc(): Promise<RateMap> {
  const res = await fetch("https://api.bc.gob.cu/v1/tasas-de-cambio/activas", {
    headers: { Accept: "*/*" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`BCC respondió ${res.status}`);

  const data = (await res.json()) as {
    tasas?: Array<{ codigoMoneda?: string; tasaEspecial?: number }>;
  };

  const resultado: RateMap = {};
  for (const tasa of data.tasas ?? []) {
    if (tasa.codigoMoneda && tasa.tasaEspecial != null) {
      resultado[tasa.codigoMoneda] = tasa.tasaEspecial;
    }
  }
  return resultado;
}

function calcularHistorial(
  nuevas: RateMap,
  fuenteSnapshot: RateMap,
): HistorialMap {
  const historial: HistorialMap = {};
  for (const [moneda, hoy] of Object.entries(nuevas)) {
    const ayerRaw = fuenteSnapshot[moneda];
    const ayer = ayerRaw != null && ayerRaw > 0 ? ayerRaw : hoy;
    const variacion = ayerRaw != null && ayerRaw > 0 ? Number((hoy - ayer).toFixed(4)) : 0;
    const pct = ayerRaw != null && ayerRaw > 0 ? Number(((variacion / ayer) * 100).toFixed(2)) : 0;
    historial[moneda] = { hoy, ayer, variacion, pct };
  }
  return historial;
}

/** Lee el documento actual de Redis (o null si nunca se ha corrido el cron). */
export async function getRates(): Promise<RatesData | null> {
  return (await redis.get<RatesData>(RATES_KEY)) ?? null;
}

/**
 * Reemplaza al workflow de GitHub Actions: obtiene ElToque + BCC, calcula
 * historial/snapshot igual que el script Python original, y persiste en Redis.
 */
export async function updateRates(): Promise<RatesData> {
  const [eltoqueTasas, bccTasas] = await Promise.all([
    fetchElToque(),
    fetchBcc(),
  ]);

  const anterior = await getRates();
  const fechaHoy = fechaHoyCuba();

  const snapshotActual = anterior?.snapshot;
  let snapshotNuevo: Snapshot;

  if (!snapshotActual || snapshotActual.fecha !== fechaHoy) {
    const fechaAnterior = anterior?.fecha ?? fechaHoy;
    snapshotNuevo = {
      fecha: fechaAnterior,
      eltoque: normalizar(anterior?.eltoque ?? eltoqueTasas),
      bcc: anterior?.bcc ?? bccTasas,
    };
  } else {
    snapshotNuevo = snapshotActual;
  }

  const resultado: RatesData = {
    fecha: fechaHoy,
    actualizadoEn: timestampCuba(),
    eltoque: eltoqueTasas,
    bcc: bccTasas,
    historial: {
      eltoque: calcularHistorial(eltoqueTasas, snapshotNuevo.eltoque),
      bcc: calcularHistorial(bccTasas, snapshotNuevo.bcc),
    },
    snapshot: snapshotNuevo,
  };

  await redis.set(RATES_KEY, resultado);
  return resultado;
}
