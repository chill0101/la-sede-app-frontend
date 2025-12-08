import { useState, useMemo } from "react";
import Container from "../components/Container";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import Form from "../components/forms/Form";
import Select from "../components/ui/Select";
import Alert from "../components/ui/Alert";
import Card from "../components/ui/Card";
import PageHeader from "../components/layout/PageHeader";

// Genera slots de 1 hora entre 08:00 y 00:00
const HOUR_SLOTS = (() => {
  const slots = [];
  for (let h = 8; h <= 23; h++) {
    const startH = String(h).padStart(2, "0");
    const endH = String((h + 1) % 24).padStart(2, "0"); // 23 -> 00
    const start = `${startH}:00`;
    const end = `${endH}:00`;
    slots.push({
      value: `${start}-${end}`,
      label: `${start} - ${end}`,
      start,
      end,
    });
  }
  return slots;
})();

const DEFAULT_SLOT_VALUE =
  HOUR_SLOTS.find((s) => s.start === "18:00")?.value || HOUR_SLOTS[0].value;

export default function Canchas() {
  const { state, reservarCancha } = useData();

  const [canchaId, setCanchaId] = useState(1);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [slotValue, setSlotValue] = useState(DEFAULT_SLOT_VALUE);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  const canchaOptions = state.canchas.map((c) => ({
    value: c.id,
    label: `${c.nombre} - ${c.estado}`,
  }));

  /* Reservas del día (Movemos esto antes de slotOptions para evitar ReferenceError) */
  const reservasDelDia = useMemo(
    () =>
      state.reservas.filter(
        (r) => r.canchaId === Number(canchaId) && r.fecha === fecha
      ),
    [state.reservas, canchaId, fecha]
  );

  /* Slots con estado de ocupación */
  const slotOptions = useMemo(() => {
    return HOUR_SLOTS.map((s) => {
      // Verificar si hay alguna reserva que coincida con el horario de inicio
      // (Backend valida strings exactos)
      const isTaken = reservasDelDia.some((r) => r.horaInicio === s.start);
      return {
        value: s.value,
        label: s.label + (isTaken ? " (Reservado)" : ""),
        disabled: isTaken,
      };
    });
  }, [reservasDelDia]);

  const reservar = async (e) => {
    e.preventDefault();
    setMsg("");

    const cancha = state.canchas.find((c) => c.id === Number(canchaId));
    if (
      !cancha ||
      (cancha.estado !== "ok" && cancha.estado !== "disponible")
    ) {
      setMsg("Esta cancha no está disponible ❌");
      setMsgType("error");
      return;
    }

    const slot = HOUR_SLOTS.find((s) => s.value === slotValue);
    if (!slot) {
      setMsg("Seleccioná un horario válido ❌");
      setMsgType("error");
      return;
    }

    const { start: horaInicio, end: horaFin } = slot;

    // Validación extra en frontend
    const isTaken = reservasDelDia.some((r) => r.horaInicio === horaInicio);
    if (isTaken) {
      setMsg("Ese horario ya está ocupado ⚠️");
      setMsgType("error");
      return;
    }

    try {
      await reservarCancha({
        canchaId: Number(canchaId),
        fecha,
        horaInicio,
        horaFin,
      });
      setMsg("Reserva confirmada ✅");
      setMsgType("success");
    } catch (ex) {
      setMsg(ex.message || "Error al reservar");
      setMsgType("error");
    }
  };

  const fondoSrc = "/images/bg-aj.jpg";

  return (
    <div className="relative min-h-[100svh] pt-14 overflow-hidden">
      {/* Fondo tipo Home/Perfil */}
      <img
        src={fondoSrc}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />

      <div className="relative">
        <Container className="py-8">
          <PageHeader title="Reservar Cancha" />

          {msg && (
            <div className="mb-4">
              <Alert type={msgType} message={msg} />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Formulario de reserva */}
            <Card>
              <h2 className="text-lg font-semibold mb-4">Nueva Reserva</h2>
              <Form onSubmit={reservar}>
                <Select
                  label="Cancha"
                  value={canchaId}
                  onChange={(e) => setCanchaId(e.target.value)}
                  options={canchaOptions}
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-200 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    min={new Date().toISOString().slice(0, 10)}
                    className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <Select
                  label="Horario"
                  value={slotValue}
                  onChange={(e) => setSlotValue(e.target.value)}
                  options={slotOptions}
                />

                <button
                  type="submit"
                  className="mt-4 w-full sm:w-auto px-5 py-2.5 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition"
                >
                  Reservar
                </button>
              </Form>
            </Card>

            {/* Reservas del día */}
            <Card>
              <h2 className="text-lg font-semibold mb-4">
                Reservas del día ({fecha})
              </h2>
              {reservasDelDia.length === 0 ? (
                <p className="text-neutral-400">
                  No hay reservas para este día
                </p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {reservasDelDia.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 bg-neutral-900/80 rounded-lg border border-neutral-700 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm text-neutral-200 font-medium">
                          {r.horaInicio} - {r.horaFin}
                        </p>
                        {r.nombreSocio && (
                          <p className="text-xs text-neutral-400">
                            {r.nombreSocio}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </Container>
      </div>
    </div>
  );
}
