import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Container from '../components/Container'
import NewsCard from '../components/NewsCard'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="relative h-[calc(100vh-56px)] w-full overflow-hidden">
      {/* Fondo full-bleed */}
      <img
        src="/images/bg-aj.jpg"
        alt="Canchita la sede"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
      {/* Overlay para contraste */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10" />

      {/* Contenido: 55% hero / 45% noticias */}
      <div className="relative h-full grid grid-rows-[55%_45%]">
        {/* HERO */}
        <div className="flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white">
              La Sede <span className="text-red-500">APP</span>
            </h1>
            <h2 className="text-4xl sm:text-2xl font-extrabold tracking-tight text-white pt-5 pb-5">
              Aca respiramos <span className="text-red-500">FUTBOL</span>
            </h2>

            {!user ? (
              <>
                <p className="mt-3 text-neutral-300 font-semibold">
                  Portal del socio. Iniciá sesión para continuar.
                </p>
                <Link
                  to="/login"
                  className="mt-5 inline-block px-6 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition shadow-lg"
                >
                  Iniciar sesión
                </Link>
              </>
            ) : (
              <p className="mt-4 text-neutral-300 text-lg font-semibold">
                ¡Qué gusto volver a verte por aquí,{' '}
                <span className="text-red-500">{user.nombre || 'socio'}</span>!
              </p>
            )}
          </div>
        </div>

        {/* NOTICIAS */}
        <div className="flex items-center">
          <Container>
            <h2 className="text-lg font-semibold text-neutral-200 mb-3">
              Noticias del Club
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <NewsCard
                title="Venta de entradas vs. Racing"
                date="15 nov 2025"
                excerpt="Socios con cuota al día tienen prioridad."
              />
              <NewsCard
                title="Nueva pileta climatizada"
                date="12 nov 2025"
                excerpt="Turnos ya disponibles."
              />
              <NewsCard
                title="Canchas renovadas"
                date="10 nov 2025"
                excerpt="Nuevo césped sintético profesional."
              />
            </div>
          </Container>
        </div>
      </div>
    </div>
  )
}
