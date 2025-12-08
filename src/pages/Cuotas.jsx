import { useMemo, useState } from "react";
import Container from "../components/Container";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

const MONTO_CUOTA = 15000;

const formatARS = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

export default function Cuotas() {
  const { user } = useAuth();
  const { state, pagarCuota } = useData(); // Usar la action real

  // Si por alguna razón no hay user (edge), evitá romper:
  const socio = useMemo(
    () => state.usuarios.find((u) => u.id === user?.id),
    [state.usuarios, user?.id]
  );

  const hoy = new Date();
  const periodoActual = `${String(hoy.getMonth() + 1).padStart(2, "0")}/${hoy.getFullYear()}`;

  // Mapear campos planos del backend a objeto cuota
  const cuota = socio ? {
    mes: socio.cuota_mes,
    anio: socio.cuota_anio,
    estado: socio.cuota_estado,
    medio: socio.cuota_medio
  } : null;

  const estaPaga = cuota?.estado === "paga";
  const periodoShown = cuota?.mes && cuota?.anio
    ? `${String(cuota.mes).padStart(2, "0")}/${cuota.anio}`
    : periodoActual;

  // UI state
  const [medio, setMedio] = useState(cuota?.medio || "mercadopago");
  const [showTicket, setShowTicket] = useState(false);
  const [loading, setLoading] = useState(false);

  const pagarAhora = async () => {
    const m = hoy.getMonth() + 1;
    const y = hoy.getFullYear();

    try {
      setLoading(true);
      await pagarCuota({
        mes: m,
        anio: y,
        medio
      });
      setShowTicket(true);
    } catch (error) {
      console.error(error);
      alert("Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100svh] pt-14 overflow-hidden">
      {/* Fondo igual que en Home/Perfil */}
      <img
        src="/images/bg-aj.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />

      <div className="relative">
        <Container className="py-8">
          <h1 className="text-2xl font-extrabold mb-4">Cuotas del socio</h1>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Estado de la cuota */}
            <section className="neon-card bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold">Estado actual</h2>
              <p className="mt-2 text-neutral-400">
                Periodo: <span className="text-neutral-200">{periodoShown}</span>
              </p>
              <p
                className={`mt-2 text-sm font-semibold ${estaPaga ? "text-emerald-400" : "text-amber-400"
                  }`}
              >
                {estaPaga ? "PAGA" : "PENDIENTE"}
              </p>

              <div className="mt-4 text-sm text-neutral-400">
                <p>
                  Socio:{" "}
                  <span className="text-neutral-200">
                    {socio?.nombre} {socio?.apellido}
                  </span>
                </p>
                <p>
                  DNI: <span className="text-neutral-200">{socio?.dni || "-"}</span>
                </p>
                <p>
                  Email: <span className="text-neutral-200">{socio?.email}</span>
                </p>
              </div>
            </section>

            {/* Pago */}
            <section className="neon-card lg:col-span-2 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold">Realizar pago</h2>

              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                {/* Medio de pago */}
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Medio de pago</label>
                  <div className="grid grid-cols-1 gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        className="accent-red-600"
                        name="medio"
                        value="mercadopago"
                        checked={medio === "mercadopago"}
                        onChange={(e) => setMedio(e.target.value)}
                      />
                      <span>MercadoPago</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        className="accent-red-600"
                        name="medio"
                        value="debito"
                        checked={medio === "debito"}
                        onChange={(e) => setMedio(e.target.value)}
                      />
                      <span>Tarjeta de débito</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        className="accent-red-600"
                        name="medio"
                        value="efectivo"
                        checked={medio === "efectivo"}
                        onChange={(e) => setMedio(e.target.value)}
                      />
                      <span>Efectivo (caja)</span>
                    </label>
                  </div>
                </div>

                {/* Monto fijo */}
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Monto</label>
                  <div className="flex items-center justify-between rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2">
                    <span className="text-neutral-200 font-semibold">
                      {formatARS(MONTO_CUOTA)}
                    </span>
                    <span className="text-xs text-neutral-500">Cuota mensual</span>
                  </div>

                  {!estaPaga ? (
                    <button
                      onClick={pagarAhora}
                      disabled={loading}
                      className={`mt-4 w-full sm:w-auto px-5 py-2.5 rounded-md font-medium text-white transition
                        ${loading ? 'bg-neutral-600 cursor-wait' : 'bg-red-600 hover:bg-red-700'}
                      `}
                    >
                      {loading ? "Procesando..." : "Pagar ahora"}
                    </button>
                  ) : (
                    <button
                      className="mt-4 w-full sm:w-auto px-5 py-2.5 rounded-md bg-neutral-800 text-neutral-300 cursor-default border border-neutral-700"
                      disabled
                    >
                      Cuota al día
                    </button>
                  )}

                  <p className="text-xs text-neutral-500 mt-2">
                    * Simulación de pago. Cuando conectemos la API/DB, registraremos el movimiento.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </Container>
      </div>

      {/* Modal Comprobante */}
      {showTicket && (
        <TicketModal
          onClose={() => setShowTicket(false)}
          socio={socio}
          medio={medio}
          monto={MONTO_CUOTA}
          fecha={hoy}
        />
      )}
    </div>
  );
}

/** Modal Comprobante */
function TicketModal({ onClose, socio, medio, monto, fecha }) {
  const medioLabel =
    medio === "debito" ? "Tarjeta de débito" : medio === "efectivo" ? "Efectivo" : "MercadoPago";

  const fechaStr = new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(fecha);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="neon-card relative bg-neutral-950/90 border border-neutral-800 rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-center">Comprobante de pago</h3>
        <p className="text-neutral-400 text-center mt-1">La Sede APP</p>

        <div className="mt-4 text-sm space-y-2">
          <Row label="Socio" value={`${socio?.nombre} ${socio?.apellido}`} />
          <Row label="DNI" value={socio?.dni || "-"} />
          <Row label="Email" value={socio?.email} />
          <Row label="Fecha" value={fechaStr} />
          <Row label="Medio" value={medioLabel} />
          <Row label="Monto" value={formatARS(monto)} />
          <Row
            label="N° Operación"
            value={`AJ-${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, "0")}${String(
              fecha.getDate()
            ).padStart(2, "0")}-${String(fecha.getTime()).slice(-6)}`}
          />
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-md bg-neutral-800 text-neutral-200 border border-neutral-700 hover:bg-neutral-700 transition"
          >
            Imprimir
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-neutral-400">{label}</span>
      <span className="text-neutral-200 font-medium">{value}</span>
    </div>
  );
}
