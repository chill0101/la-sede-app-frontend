import { useState, useMemo } from "react";
import Container from "../components/Container";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import PageHeader from "../components/layout/PageHeader";

export default function Entradas() {
  const { user } = useAuth();
  const { state, comprarEntradas } = useData();

  const [partidoId, setPartidoId] = useState(
    state.partidos[0]?.id ?? null
  );
  const [cantidad, setCantidad] = useState(1);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  const partidos = state.partidos;

  const partidoSeleccionado = partidos.find((p) => p.id === partidoId);

  const entradasUser = useMemo(
    () =>
      (state.entradas || []).filter((e) => e.userId === user.id),
    [state.entradas, user.id]
  );

  const lanzarMensaje = (texto, tipo = "success") => {
    setMsg(texto);
    setMsgType(tipo);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleComprar = (e) => {
    e.preventDefault();
    if (!partidoSeleccionado) {
      lanzarMensaje("Seleccioná un partido válido", "error");
      return;
    }

    if (cantidad < 1 || cantidad > 4) {
      lanzarMensaje(
        "Solo podés comprar entre 1 y 4 entradas por operación",
        "error"
      );
      return;
    }

    try {
      comprarEntradas({ partidoId, cantidad });
      lanzarMensaje("Compra realizada correctamente ✅", "success");
      setCantidad(1);
    } catch (err) {
      lanzarMensaje(err.message, "error");
    }
  };

  const fondoSrc = "/images/bg-aj.jpg";

  return (
    <div className="relative min-h-[100svh] pt-14 overflow-hidden">
      {/* FONDO */}
      <img
        src={fondoSrc}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />

      {/* CONTENIDO */}
      <div className="relative">
        <Container className="py-8">
          <PageHeader title="Entradas para partidos" />

          {msg && (
            <div className="mb-4">
              <Alert type={msgType} message={msg} />
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* FORMULARIO DE COMPRA */}
            <Card className="lg:col-span-2 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 neon-card">
              <h2 className="text-lg font-semibold mb-4">
                Comprar entradas
              </h2>

              {partidos.length === 0 ? (
                <p className="text-neutral-400 text-sm">
                  No hay partidos cargados.
                </p>
              ) : (
                <form onSubmit={handleComprar} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-200 mb-1">
                      Partido
                    </label>
                    <select
                      value={partidoId ?? ""}
                      onChange={(e) => setPartidoId(Number(e.target.value))}
                      className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                      {partidos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.torneo} vs {p.rival} –{" "}
                          {formatFechaCorta(p.fechaHora)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {partidoSeleccionado && (
                    <p className="text-xs text-neutral-400">
                      Estadio:{" "}
                      <span className="text-neutral-200">
                        {partidoSeleccionado.estadio}
                      </span>{" "}
                      · Stock:{" "}
                      <span className="text-neutral-200">
                        {partidoSeleccionado.stockEntradas}
                      </span>
                    </p>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-neutral-200 mb-1">
                      Cantidad (máx. 4)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={4}
                      value={cantidad}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (Number.isNaN(val)) return;
                        if (val < 1) setCantidad(1);
                        else if (val > 4) setCantidad(4);
                        else setCantidad(val);
                      }}
                      className="w-full sm:w-32 rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      Por operación podés comprar hasta 4 entradas.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="mt-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                  >
                    Comprar
                  </Button>
                </form>
              )}
            </Card>

            {/* RESUMEN DE MIS ENTRADAS */}
            <Card className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800">
              <h2 className="text-lg font-semibold mb-4">
                Mis entradas
              </h2>

              {entradasUser.length === 0 ? (
                <p className="text-neutral-400 text-sm">
                  Todavía no compraste entradas.
                </p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {entradasUser.map((e) => {
                    const partido = partidos.find(
                      (p) => p.id === e.partidoId
                    );
                    if (!partido) return null;
                    return (
                      <div
                        key={e.id}
                        className="p-3 rounded-lg border border-neutral-700 bg-neutral-950/70"
                      >
                        <p className="text-sm font-semibold text-neutral-100">
                          {partido.torneo} vs {partido.rival}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {formatFechaCorta(partido.fechaHora)} · Estadio{" "}
                          {partido.estadio}
                        </p>
                        <p className="text-sm text-neutral-200 mt-1">
                          Entradas:{" "}
                          <span className="font-semibold">
                            {e.cantidad}
                          </span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </Container>
      </div>
    </div>
  );
}

function formatFechaCorta(iso) {
  try {
    return new Date(iso).toLocaleString("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}
