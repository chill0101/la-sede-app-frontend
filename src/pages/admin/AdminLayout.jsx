import { Outlet, NavLink } from 'react-router-dom'
import Container from '../../components/Container'
import Button from '../../components/ui/Button'

export default function AdminLayout() {
  const linkBase = "px-3 py-2 rounded-md text-sm font-medium transition-colors"
  const active = "bg-red-600 text-white"
  const inactive = "text-neutral-300 hover:bg-neutral-800 hover:text-white"

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      <nav className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-neutral-800">
        <NavLink 
          to="." 
          end
          className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="usuarios"
          className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}
        >
          Usuarios
        </NavLink>
        <NavLink 
          to="canchas"
          className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}
        >
          Canchas
        </NavLink>
        <NavLink 
          to="clases"
          className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}
        >
          Clases
        </NavLink>
        <NavLink 
          to="partidos"
          className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}
        >
          Partidos
        </NavLink>
      </nav>
      <Outlet />
    </Container>
  )
}