import { useMemo } from "react";
import Container from "../components/Container";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import PageHeader from "../components/layout/PageHeader";

export default function MisActividades() {
  const { user } = useAuth();
  const { state } = useData();

  const fondoSrc = "/images/bg-aj.jpg";

  // ------------------------------
  // RESERVAS DEL SOCIO
  // ------------------------------
  const reservasUser = useMemo(() => {
    return (state.reservas || [])
      .filter((r) => r.userId === user.id)
      .map((r) => ({
        tipo: "reserva",
        fechaSort: new Date(`${r.fecha}T${r.horaInicio}`),
        fecha: r.fecha,
        cancha: state.canchas.find((c) => c.id === r.canchaId)?.nombre,
        horaInicio: r.horaInicio,
        horaFin: r.horaFin,
      }));
  }, [state.reservas, state.canchas, user.id]);

  // ------------------------------
  // CLASES DEL SOCIO
  // ------------------------------
  const clasesUser = useMemo(() => {
    const clases = state.clases || [];
    return clases
      .filter((c) => Array.isArray(c.Usuarios) && c.Usuarios.some(u => u.id === user.id))
      .map((c) => ({
        tipo: "clase",
        fechaSort: new Date(), // No tienen fecha exacta → quedan abajo del todo
        disciplina: c.disciplina,
        diaSemana: c.diaSemana,
        hora: c.hora,
      }));
  }, [state.clases, user.id]);

  // ------------------------------
  // ENTRADAS DEL SOCIO
  // ------------------------------
  const entradasUser = useMemo(() => {
    return (state.entradas || [])
      .filter((e) => e.userId === user.id)
      .map((e) => {
        const partido = state.partidos.find((p) => p.id === e.partidoId);
        return {
          tipo: "entrada",
          fechaSort: partido ? new Date(partido.fechaHora) : new Date(),
          torneo: partido?.torneo,
          rival: partido?.rival,
          estadio: partido?.estadio,
          fecha: partido ? new Date(partido.fechaHora).toLocaleString("es-AR") : "",
          cantidad: e.cantidad,
        };
      });
  }, [state.entradas, state.partidos, user.id]);

  // Combinar todo
  const actividades = useMemo(() => {
    return [...reservasUser, ...clasesUser, ...entradasUser].sort(
      (a, b) => a.fechaSort - b.fechaSort
    );
  }, [reservasUser, clasesUser, entradasUser]);

  return (
    <div className="relative min-h-[100svh] pt-14 overflow-hidden">
      {/* Fondo */}
      <img
        src={fondoSrc}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />

      {/* Contenido */}
      <div className="relative">
        <Container className="py-8">
          <PageHeader title="Mis Actividades" />

          <Card className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 neon-card">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Actividades del socio
            </h2>

            {actividades.length === 0 ? (
              <p className="text-neutral-400 text-sm">
                No tenés actividades registradas todavía.
              </p>
            ) : (
              <div className="space-y-3">
                {actividades.map((a, idx) => {
                  if (a.tipo === "reserva") {
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-lg border border-neutral-700 bg-neutral-950/70"
                      >
                        <p className="text-sm text-neutral-400 mb-1">Reserva de cancha</p>
                        <p className="text-neutral-200 text-sm">
                          Cancha: <span className="font-semibold">{a.cancha}</span>
                        </p>
                        <p className="text-neutral-300 text-xs">
                          Fecha: {a.fecha} — {a.horaInicio} a {a.horaFin}
                        </p>
                      </div>
                    );
                  }

                  if (a.tipo === "clase") {
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-lg border border-neutral-700 bg-neutral-950/70"
                      >
                        <p className="text-sm text-neutral-400 mb-1">Clase</p>
                        <p className="text-neutral-200 text-sm">
                          {a.disciplina.toUpperCase()}
                        </p>
                        <p className="text-neutral-300 text-xs">
                          {a.diaSemana} — {a.hora}
                        </p>
                      </div>
                    );
                  }

                  if (a.tipo === "entrada") {
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-lg border border-neutral-700 bg-neutral-950/70"
                      >
                        <p className="text-sm text-neutral-400 mb-1">Entrada de partido</p>
                        <p className="text-neutral-200 text-sm font-semibold">
                          {a.torneo} vs {a.rival}
                        </p>
                        <p className="text-neutral-300 text-xs">
                          {a.fecha} · Estadio {a.estadio}
                        </p>
                        <p className="text-neutral-200 text-sm mt-1">
                          Entradas: <span className="font-semibold">{a.cantidad}</span>
                        </p>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            )}
          </Card>
        </Container>
      </div>
    </div>
  );
}
