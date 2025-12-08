import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'

export default function Register() {
  const { state, setState } = useData()
  const nav = useNavigate()

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [apellido, setApellido] = useState('')
  const [dni, setDni] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const onSubmit = (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!nombre || !apellido || !dni || !email || !password) {
      setError('Todos los campos son obligatorios')
      return
    }

    // verificar que el email no esté registrado
    const existe = state.usuarios.some(u => u.email === email)
    if (existe) {
      setError('Este email ya está registrado')
      return
    }

    // verificar que el dni no esté registrado
    const existeDni = state.usuarios.some(u => String(u.dni) === String(dni))
    if (existeDni) {
      setError('Este DNI ya está registrado')
      return
    }


    const nuevoUsuario = {
      id: Date.now(),
      nombre,
      apellido,
      dni,
      email,
      password,
      rol: 'user',
      activo: true,
    }

    setState(prev => ({
      ...prev,
      usuarios: [...prev.usuarios, nuevoUsuario],
    }))

    setSuccess('Usuario registrado con éxito ✅')
    setTimeout(() => nav('/login'), 2000)
  }

  return (
    <div className="relative h-[100svh] w-full overflow-hidden">
      <img
        src="/images/bg-aj.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />

      <div className="relative h-full flex items-center justify-center px-4 pt-20">
        <div className="neon-card bg-neutral-950/70 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 sm:p-8 w-full max-w-md">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center">
            Crear cuenta
          </h1>
          <p className="mt-2 text-center text-neutral-400">
            Portal del socio · La Sede <span className="text-red-500 font-semibold">APP</span>
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-neutral-300 mb-1">Nombre</label>
              <input
                className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-1">Email</label>
              <input
                className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@correo.com"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-1">Apellido</label>
              <input
                className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Tu apellido"
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-300 mb-1">DNI</label>
              <input
                className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                value={dni}
                onChange={(e) =>
                  setDni(e.target.value.replace(/\D+/g, '').slice(0, 8))
                }
                placeholder="Ej: 40123456"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-1">Contraseña</label>
              <input
                type="password"
                className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && <p className="text-sm text-green-400">{success}</p>}

            <button
              className="w-full mt-2 rounded-md bg-red-600 text-white font-medium px-4 py-2.5 hover:bg-red-700 transition"
            >
              Registrarme
            </button>

            <p className="text-xs text-neutral-500 text-center mt-3">
              ¿Ya tenés una cuenta?{' '}
              <span
                onClick={() => nav('/login')}
                className="text-red-500 hover:underline cursor-pointer"
              >
                Iniciar sesión
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
