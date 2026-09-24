"use client";

import { useRef, useState } from "react";

const ITEMS = [
  {
    href: "/api-docs",
    icon: "📄",
    label: "API Documentación",
    desc: "Consulta y usa nuestros datos",
  },
  {
    href: "/donate",
    icon: "☕",
    label: "Donar",
    desc: "Apoya el proyecto",
  },
  {
    href: "/changelog",
    icon: "🕓",
    label: "Historial de cambios",
    desc: "Novedades y actualizaciones",
  },
];

export default function MenuSheet() {
  const [open, setOpen] = useState(false);
  const touchStartY = useRef(0);

  function handleTouchEnd(e: React.TouchEvent) {
    const touch = e.changedTouches[0];
    if (!touch) return;
    const diff = touch.clientY - touchStartY.current;
    if (diff > 60) setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="menu-btn"
        title="Opciones"
        onClick={() => setOpen(true)}
      >
        ···
      </button>

      <div
        className={`menu-overlay${open ? " open" : ""}`}
        onClick={() => setOpen(false)}
      />

      <div
        className={`menu-sheet${open ? " open" : ""}`}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          if (touch) touchStartY.current = touch.clientY;
        }}
        onTouchEnd={handleTouchEnd}
      >
        <div className="menu-handle" />
        <div className="menu-title">Opciones</div>
        <div className="menu-items">
          {ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="menu-item"
              target="_blank"
              rel="noopener"
            >
              <div className="menu-item-icon">{item.icon}</div>
              <div className="menu-item-text">
                <span className="menu-item-label">{item.label}</span>
                <span className="menu-item-desc">{item.desc}</span>
              </div>
              <div className="menu-item-arrow">›</div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
