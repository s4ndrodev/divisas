export const ALLOWED_SOURCES = ["eltoque", "bcc"] as const;

/** Alias de claves que llegan de las APIs origen pero se muestran con otro código. */
export const KEY_ALIASES: Record<string, string> = {
  ECU: "EUR",
};

export const CURRENCY_NAMES: Record<string, string> = {
  USD: "Dólar EE.UU.",
  EUR: "Euro",
  GBP: "Libra",
  CAD: "Dólar Canadiense",
  AUD: "Dólar Aust.",
  CHF: "Franco Suizo",
  CNY: "Yuan",
  JPY: "Yen",
  MXN: "Peso Mexicano",
  NOK: "Corona Noruega",
  SEK: "Corona Sueca",
  DKK: "Corona Danesa",
  RUB: "Rublo Ruso",
  BTC: "Bitcoin",
  USDT_TRC20: "USDT",
  TRX: "TRON",
  MLC: "MLC",
};

export const CURRENCY_ICONS: Record<string, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  CAD: "🇨🇦",
  AUD: "🇦🇺",
  CHF: "🇨🇭",
  CNY: "🇨🇳",
  JPY: "🇯🇵",
  MXN: "🇲🇽",
  NOK: "🇳🇴",
  SEK: "🇸🇪",
  DKK: "🇩🇰",
  RUB: "🇷🇺",
  BTC: "₿",
  USDT_TRC20: "💲",
  TRX: "⚡",
  MLC: "💳",
};
