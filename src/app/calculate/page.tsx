import BottomNav from "@/components/BottomNav";

export default function CalculatePage() {
  return (
    <>
      <div className="wrapper">
        <div className="header">
          <div className="header-label">Conversor de divisas</div>
          <h1>Calculadora</h1>
        </div>
        <p style={{ color: "var(--text-dim)", fontSize: 14 }}>
          Pendiente de portar desde calculate.html — la lógica del conversor ya
          vive en <code>src/components/Converter.tsx</code> y se puede
          reutilizar aquí en pantalla completa.
        </p>
      </div>
      <BottomNav />
    </>
  );
}
