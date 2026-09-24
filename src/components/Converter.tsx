"use client";

import { useMemo, useState } from "react";
import { CURRENCY_ICONS, CURRENCY_NAMES } from "@/lib/constants";
import type { RatesData, Source } from "@/types/rates";

const UpArrow = () => (
  <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path
      d="M5 8V2M2 5l3-3 3 3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DownArrow = () => (
  <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path
      d="M5 2v6M2 5l3 3 3-3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Converter({ data }: { data: RatesData }) {
  const [source, setSource] = useState<Source>("eltoque");
  const [currency, setCurrency] = useState("USD");
  const [foreignValue, setForeignValue] = useState("1");
  const [cupValue, setCupValue] = useState("");
  const [pulseField, setPulseField] = useState<"foreign" | "cup" | null>(null);

  const rates = data[source];
  const rate = rates[currency];

  const codes = useMemo(() => Object.keys(rates), [rates]);

  function pulse(field: "foreign" | "cup") {
    setPulseField(field);
    requestAnimationFrame(() => setPulseField(null));
  }

  function handleSource(next: Source) {
    setSource(next);
    const nextRates = data[next];
    if (!nextRates[currency]) {
      setCurrency("USD");
      setForeignValue("1");
    }
  }

  function handleCurrency(code: string) {
    if (!rates[code]) return;
    setCurrency(code);
    setForeignValue("1");
    const r = rates[code];
    setCupValue(r ? (1 * r).toFixed(2) : "");
    pulse("cup");
  }

  function handleForeignChange(v: string) {
    setForeignValue(v);
    const val = parseFloat(v) || 0;
    if (!Number.isFinite(val) || val < 0) {
      setCupValue("");
      return;
    }
    setCupValue(val > 0 && rate ? (val * rate).toFixed(2) : "");
    pulse("cup");
  }

  function handleCupChange(v: string) {
    setCupValue(v);
    const val = parseFloat(v) || 0;
    if (!Number.isFinite(val) || val < 0) {
      setForeignValue("");
      return;
    }
    setForeignValue(val > 0 && rate ? (val / rate).toFixed(6) : "");
    pulse("foreign");
  }

  function handleSwap() {
    const tmp = foreignValue;
    setForeignValue(cupValue);
    setCupValue(tmp);
    const newForeign = parseFloat(cupValue) || 0;
    if (newForeign > 0) {
      handleForeignChange(cupValue);
    }
  }

  const hist = data.historial[source]?.[currency];
  const hasChange = !!hist && hist.variacion !== 0;
  const up = hasChange && hist.variacion > 0;
  const barWidth = hasChange ? Math.min((Math.abs(hist.pct) / 10) * 100, 100) : 0;
  const showAlert = hasChange && Math.abs(hist.variacion) > 5;

  return (
    <>
      <div className="toggle-wrap">
        <button
          type="button"
          className={`toggle-btn eltoque-btn${source === "eltoque" ? " active" : ""}`}
          onClick={() => handleSource("eltoque")}
        >
          <span className="toggle-dot" />
          elToque
        </button>
        <button
          type="button"
          className={`toggle-btn bcc-btn${source === "bcc" ? " active" : ""}`}
          onClick={() => handleSource("bcc")}
        >
          <span className="toggle-dot" />
          BCC Oficial
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Convertidor</span>
          <span className={`source-badge ${source}`}>
            {source === "eltoque" ? "eltoque" : "Segmento III"}
          </span>
        </div>

        <div className="field">
          <div className="field-icon foreign">{CURRENCY_ICONS[currency] ?? "🪙"}</div>
          <div className="field-inner">
            <div className="field-label">
              {currency} · {CURRENCY_NAMES[currency] ?? currency}
            </div>
            <input
              className={`field-input${pulseField === "foreign" ? " value-change" : ""}`}
              type="number"
              placeholder="0"
              min={0}
              value={foreignValue}
              onChange={(e) => handleForeignChange(e.target.value)}
            />
          </div>
          <div className="field-currency">{currency}</div>
        </div>

        <div className="swap-divider">
          <div className="swap-line" />
          <button type="button" className="swap-btn" title="Invertir" onClick={handleSwap}>
            ⇅
          </button>
          <div className="swap-line" />
        </div>

        <div className="field">
          <div className="field-icon cup">🇨🇺</div>
          <div className="field-inner">
            <div className="field-label">CUP · Peso Cubano</div>
            <input
              className={`field-input${pulseField === "cup" ? " value-change" : ""}`}
              type="number"
              placeholder="0"
              min={0}
              value={cupValue}
              onChange={(e) => handleCupChange(e.target.value)}
            />
          </div>
          <div className="field-currency">CUP</div>
        </div>

        <div className="rate-info">
          <span className="rate-value">
            1 {currency} ={" "}
            {rate
              ? rate.toLocaleString("es-CU", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "—"}{" "}
            CUP
          </span>

          <div
            className={`rate-trend visible${
              hasChange ? (up ? " up" : " down") : " flat"
            }`}
          >
            {hasChange ? (
              <span className="rate-trend-label">
                {up ? <UpArrow /> : <DownArrow />}{" "}
                {up ? "+" : ""}
                {hist.variacion.toLocaleString("es-CU", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}{" "}
                CUP
              </span>
            ) : (
              <span className="rate-trend-label">— Sin cambios</span>
            )}
            <div className="rate-trend-bar-track">
              <div className="rate-trend-bar-fill" style={{ width: `${barWidth}%` }} />
            </div>
          </div>
        </div>

        {showAlert && hist && (
          <div className="rate-alert">
            <span className="rate-alert-icon">⚠️</span>
            <span className="rate-alert-text">
              Se ha detectado una variación muy brusca del mercado: {currency}{" "}
              {up ? "subió" : "bajó"}{" "}
              {Math.abs(hist.variacion).toLocaleString("es-CU", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              CUP ({up ? "+" : ""}
              {hist.pct}%) respecto al día anterior.
            </span>
          </div>
        )}
      </div>

      <div className="currency-selector">
        <div className="selector-title">Seleccionar moneda</div>
        <div className="currency-grid">
          {codes.map((code) => (
            <button
              key={code}
              type="button"
              className={`currency-chip${code === currency ? " active" : ""}`}
              onClick={() => handleCurrency(code)}
            >
              {CURRENCY_ICONS[code] ?? "🪙"} {code}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
