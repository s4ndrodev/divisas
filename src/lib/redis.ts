import { Redis } from "@upstash/redis";

// El SDK REST de Upstash no mantiene una conexión TCP abierta, así que es
// seguro para funciones serverless (a diferencia de un cliente Redis clásico).
export const redis = Redis.fromEnv();

/** Única clave donde vive el documento completo de tasas. */
export const RATES_KEY = "divisas:tasas:v1";
