import Converter from "@/components/Converter";
import BottomNav from "@/components/BottomNav";
import MenuSheet from "@/components/MenuSheet";
import { getRates } from "@/lib/rates";
import type { RatesData } from "@/types/rates";

export const revalidate = 300;

const FALLBACK: RatesData = {
  fecha: "—",
  actualizadoEn: "",
  eltoque: { USD: 0, EUR: 0, MLC: 0 },
  bcc: { USD: 0, EUR: 0 },
  historial: { eltoque: {}, bcc: {} },
  snapshot: { fecha: "—", eltoque: {}, bcc: {} },
};

export default async function Home() {
  const data = (await getRates()) ?? FALLBACK;
  const isLive = data.fecha !== "—";

  return (
    <>
      <MenuSheet />

      <div className="wrapper">
        <div className="header">
          <div className="header-label">Conversor de divisas</div>
          <h1>Divisas</h1>
        </div>

        <Converter data={data} />

        <div className="footer">
          <div>
            {isLive
              ? `Datos del ${data.fecha} · actualizado cada 6h`
              : "Esperando la primera actualización…"}
          </div>
          <div className="footer-copy">© 2025-2026 Divisas</div>

          <div className="footer-links">
            <a href="https://github.com/alessan2ro" target="_blank" rel="noopener" title="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
            <a href="https://t.me/appservicel" target="_blank" rel="noopener" title="Telegram">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8-1.7 8.02c-.12.55-.46.68-.93.42l-2.58-1.9-1.24 1.2c-.14.13-.26.25-.53.25l.19-2.66 4.84-4.37c.21-.19-.05-.29-.32-.1L8.17 14.17l-2.55-.8c-.55-.17-.56-.55.12-.82l9.96-3.84c.46-.17.86.11.94.29z" />
              </svg>
            </a>
            <a href="https://x.com/alessan2roo" target="_blank" rel="noopener" title="X">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  );
}
