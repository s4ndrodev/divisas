export type RateMap = Record<string, number>;

export interface HistorialEntry {
  hoy: number;
  ayer: number;
  variacion: number;
  pct: number;
}

export type HistorialMap = Record<string, HistorialEntry>;

export interface Snapshot {
  fecha: string;
  eltoque: RateMap;
  bcc: RateMap;
}

/** Forma exacta del JSON que antes generaba el workflow de GitHub Actions. */
export interface RatesData {
  fecha: string;
  actualizadoEn: string;
  eltoque: RateMap;
  bcc: RateMap;
  historial: {
    eltoque: HistorialMap;
    bcc: HistorialMap;
  };
  snapshot: Snapshot;
}

export type Source = "eltoque" | "bcc";
