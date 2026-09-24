# Divisas Cuba — Next.js + TypeScript

Migración del proyecto original (HTML/JS estático + GitHub Actions) a
Next.js 14 (App Router) con TypeScript. Reemplaza:

- El script Python del workflow → `src/lib/rates.ts` (`updateRates()`), invocado
  desde `src/app/api/cron/route.ts`.
- El commit del JSON al repo → un documento en **Upstash Redis** (`src/lib/redis.ts`).
- El cron de GitHub Actions → un servicio externo gratuito que golpea tu
  endpoint cada 6h (ver abajo). El plan Hobby de Vercel Cron solo permite
  1 ejecución/día, por eso no se usa aquí.

## 1. Instalar y correr en local

```bash
npm install
cp .env.example .env.local   # y rellena las variables
npm run dev
```

## 2. Crear la base de Redis (Upstash)

1. Entra a tu proyecto en el dashboard de Vercel → **Storage** → **Create Database**
   → elige el proveedor **Upstash** (Redis), plan gratis.
2. Al conectarlo al proyecto, Vercel añade automáticamente
   `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` a tus env vars.
   (También puedes crearla directo en console.upstash.com y pegar las dos
   variables a mano — funciona igual.)

## 3. Variables de entorno

| Variable | De dónde sale |
|---|---|
| `ELTOQUE_API_TOKEN` | El mismo token que ya usabas en el secret `API_TOKEN` de GitHub Actions |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Paso 2 |
| `CRON_SECRET` | Generas uno tú: `openssl rand -hex 32` |

Configúralas en Vercel → Project Settings → Environment Variables.

## 4. Desplegar

```bash
git push   # o vercel --prod
```

## 5. Configurar el cron externo (cron-job.org, gratis)

Vercel Hobby solo deja correr cron jobs **una vez al día**, así que la
actualización cada 6h se dispara desde afuera:

1. Crea una cuenta gratis en **https://cron-job.org**.
2. "Create cronjob" →
   - URL: `https://tu-dominio.vercel.app/api/cron`
   - Schedule: cada 6 horas (`0 */6 * * *`)
   - En "Advanced" → Headers, añade:
     `Authorization: Bearer <el mismo valor de CRON_SECRET>`
3. Guarda. cron-job.org te muestra el historial de ejecuciones y te avisa si
   alguna falla — mejor visibilidad que la que tenías con Actions.

Alternativas igual de gratuitas si prefieres: **Upstash QStash** (tiene un
scheduler propio) o **Cloudflare Workers Cron Triggers**.

## Endpoints

- `GET /api/cron` — protegido con `CRON_SECRET`, actualiza Redis. Lo llama
  cron-job.org.
- `GET /api/rates` — público, devuelve el mismo JSON que antes exponía
  `tasas/v1/tasas.json` (mismas claves: `fecha`, `eltoque`, `bcc`, `historial`,
  `snapshot`), para no romper a nadie que ya consuma tu API.

## Pendiente de portar

- `calculate.html` → `src/app/calculate/page.tsx` (placeholder por ahora, la
  lógica ya está en `src/components/Converter.tsx`).
- `api-docs.html`, `donate.html`, `changelog.html` — quedan como enlaces del
  menú; si quieres que los recree también como páginas de Next.js, dímelo.
- Assets (`favicon.ico`, `apple-touch-icon.png`, `og-image.png`) — cópialos a
  `public/assets/icons/` desde el proyecto original.
