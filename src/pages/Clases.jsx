import { useState } from "react";
import Container from "../components/Container";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Badge from "../components/ui/Badge";
import PageHeader from "../components/layout/PageHeader";

export default function Clases() {
  const { user } = useAuth();
  const { state, inscribirClase, bajaClase } = useData();
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  const lanzarMensaje = (texto, tipo = "success") => {
    setMsg(texto);
    setMsgType(tipo);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleInscribir = (claseId) => {
    try {
      inscribirClase(claseId);
      lanzarMensaje("Inscripción exitosa ✅", "success");
    } catch (e) {
      lanzarMensaje(e.message, "error");
    }
  };

  const handleBaja = (claseId) => {
    try {
      bajaClase(claseId);
      lanzarMensaje("Baja realizada correctamente ❌", "success");
    } catch (e) {
      lanzarMensaje(e.message, "error");
    }
  };

  return (
    <div className="relative min-h-[100svh] pt-14 overflow-hidden">
      {/* FONDO */}
      <img
        src="/images/bg-aj.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />

      {/* CONTENIDO */}
      <div className="relative">
        <Container className="py-8">
          <PageHeader title="Clases Disponibles" />

          {msg && (
            <div className="mb-4">
              <Alert type={msgType} message={msg} />
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.clases.map((c) => {
              // Adaptación: Backend ahora devuelve 'Usuarios'
              const listaInscriptos = c.Usuarios || [];
              const cupoDisponible = c.cupo - listaInscriptos.length;
              const isCompleto = cupoDisponible === 0;
              const estoyInscripto = listaInscriptos.some(u => u.id === user.id);

              return (
                <Card
                  key={c.id}
                  className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 neon-card"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      {c.disciplina.toUpperCase()}
                    </h3>
                    <Badge variant={isCompleto ? "error" : "success"}>
                      {cupoDisponible} cupos
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-neutral-300">
                      <span className="font-medium">Día:</span> {c.diaSemana}
                    </p>
                    <p className="text-sm text-neutral-300">
                      <span className="font-medium">Hora:</span> {c.hora}
                    </p>
                    <p className="text-sm text-neutral-300">
                      <span className="font-medium">Cupo:</span>{" "}
                      {(c.Usuarios || []).length}/{c.cupo}
                    </p>
                  </div>

                  {/* BOTÓNES */}
                  {!estoyInscripto ? (
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={isCompleto}
                      onClick={() => handleInscribir(c.id)}
                      className="w-full"
                    >
                      {isCompleto ? "Cupo completo" : "Inscribirme"}
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleBaja(c.id)}
                      className="w-full bg-red-700 hover:bg-red-800"
                    >
                      Darme de baja
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
        </Container>
      </div>
    </div>
  );
}
