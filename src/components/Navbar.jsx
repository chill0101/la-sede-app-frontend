import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Les dejo algunas notas para que vean los cambios teammates
  // 1. Usamos el handleResize para que el menu se cierre al hacer resize a desktop Y NO Aparezca la hamburguesita
  // 2. Hay un componente de NavLinks que se encarga de renderizar los enlaces de navegación para ambos tipos de pantalla, si hay que agregar o sacar un link se cambia desde ahí
  // 3. Hay dos componentes de enlaces de navegación, uno para desktop y otro para mobile - los enlaces se renderizan con <NavLinks />
  // 4. Puse algunas cositas de accesibilidad como aria-label y aria-expanded
  // 5. Agregué lucidIcons y si bien voy a dejar en el readme, sepan que tienen que instalar el paquete con npm install lucide-react

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setIsOpen(false) // Cerrar menú al hacer resize a desktop
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const linkBase = "text-sm font-medium text-neutral-300 hover:text-white transition"
  const active = "text-white"

  // NavLinks Component para los enlaces de navegación
  const NavLinks = ({ isMobile = false }) => (
    <>
      <NavLink 
        to="/perfil" 
        className={({isActive}) => 
          `
          ${isMobile ? 'block py-2 px-4 hover:bg-neutral-800 rounded' : ''} 
          ${linkBase} 
          ${isActive ? active : ''}
          `
        }
        onClick={() => isMobile && setIsOpen(false)}
      >
        Perfil
      </NavLink>
      <NavLink 
        to="/cuotas" 
        className={({isActive}) => 
          `
          ${isMobile ? 'block py-2 px-4 hover:bg-neutral-800 rounded' : ''} 
          ${linkBase} 
          ${isActive ? active : ''}
          `
        }
        onClick={() => isMobile && setIsOpen(false)}
      >
        Cuotas
      </NavLink>
      <NavLink 
        to="/canchas" 
        className={({isActive}) => 
          `
          ${isMobile ? 'block py-2 px-4 hover:bg-neutral-800 rounded' : ''} 
          ${linkBase} 
          ${isActive ? active : ''}
          `
        }
        onClick={() => isMobile && setIsOpen(false)}
      >
        Canchas
      </NavLink>
      <NavLink 
        to="/clases" 
        className={({isActive}) => 
          `
          ${isMobile ? 'block py-2 px-4 hover:bg-neutral-800 rounded' : ''} 
          ${linkBase} 
          ${isActive ? active : ''}
          `
        }
        onClick={() => isMobile && setIsOpen(false)}
      >
        Clases
      </NavLink>
      <NavLink 
        to="/entradas" 
        className={({isActive}) => 
          `
          ${isMobile ? 'block py-2 px-4 hover:bg-neutral-800 rounded' : ''} 
          ${linkBase} 
          ${isActive ? active : ''}
          `
        }
        onClick={() => isMobile && setIsOpen(false)}
      >
        Entradas
      </NavLink>
      <NavLink 
        to="/mis-actividades" 
        className={({isActive}) => 
          `
          ${isMobile ? 'block py-2 px-4 hover:bg-neutral-800 rounded' : ''} 
          ${linkBase} 
          ${isActive ? active : ''}
          `
        }
        onClick={() => isMobile && setIsOpen(false)}
      >
        Mis actividades
      </NavLink>
      {user?.rol === 'admin' && (
        <NavLink 
          to="/admin" 
          className={({isActive}) => 
            `
            ${isMobile ? 'block py-2 px-4 hover:bg-neutral-800 rounded' : ''} 
            ${linkBase} 
            ${isActive ? 'text-amber-400' : 'text-amber-500'}
            `
          }
          onClick={() => isMobile && setIsOpen(false)}
        >
          Admin
        </NavLink>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-900/95 backdrop-blur">
      <nav className="max-w-6xl mx-auto px-4">
        <div className="h-14 flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="font-extrabold tracking-wide text-red-500 text-lg"
            onClick={() => isMobile && setIsOpen(false)}
          >
            LA SEDE APP
          </Link>

          {/* Desktop menu */}
          {user && (
            <div className="hidden md:flex items-center gap-4">
              <NavLinks />
            </div>
          )}

          {/* Mobile button */}
          {user && isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-neutral-300 hover:text-white p-2"
              aria-label="Menú"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}

          {/* Login/Logout */}
          <div className="ml-4">
            {!user ? (
              <Link
                to="/login"
                className=" px-3 py-1.5 rounded-md bg-red-600 text-white text-sm font-medium 
                          hover:bg-red-700 hover:text-white transition"
                onClick={() => isMobile && setIsOpen(false)}
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  logout()
                  if (isMobile) setIsOpen(false)
                }}
                className=" px-3 py-1.5 rounded-md bg-neutral-800 text-neutral-300 
                          hover:text-white hover:bg-neutral-700 text-sm font-medium transition"
              >
                Salir
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {user && isMobile && (
          <div 
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? 'max-h-96 py-2' : 'max-h-0 py-0'
            }`}
          >
            <div className="flex flex-col space-y-1">
              <NavLinks isMobile />
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}