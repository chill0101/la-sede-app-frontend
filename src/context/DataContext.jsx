import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const DataContext = createContext()

const API_URL = 'http://localhost:3000/api'

export function DataProvider({ children }) {
  const { user, token } = useAuth()

  // Estado local para la UI (cache)
  const [state, setState] = useState({
    usuarios: [],
    canchas: [],
    reservas: [],
    clases: [],
    partidos: [],
    entradas: [],
    pagos: []
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar datos iniciales
  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    setError(null)
    try {
      const res = await fetch(`${API_URL}/init`)
      if (res.ok) {
        const data = await res.json()
        setState(data)
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }))
        console.error('Error cargando datos:', errorData)
        setError(`Error al cargar datos: ${errorData.error || 'Error desconocido'}`)
        // Mantener estado vacío pero no fallar completamente
        setState({
          usuarios: [],
          canchas: [],
          reservas: [],
          clases: [],
          partidos: [],
          entradas: [],
          pagos: []
        })
      }
    } catch (error) {
      console.error('Error de conexión cargando datos:', error)
      setError('Error de conexión. Verifica que el servidor backend esté corriendo en http://localhost:3000')
      // Si hay error de conexión, mantener arrays vacíos
      setState({
        usuarios: [],
        canchas: [],
        reservas: [],
        clases: [],
        partidos: [],
        entradas: [],
        pagos: []
      })
    } finally {
      setLoading(false)
    }
  }

  // Helper para headers con token
  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  })

  // --- ACTIONS ---

  const pagarCuota = async ({ mes, anio, medio }) => {
    if (!user) throw new Error('No autenticado')

    const res = await fetch(`${API_URL}/pagos`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ mes, anio, medio })
    })

    if (!res.ok) throw new Error('Error al pagar cuota')

    // Actualizar estado local (Optimistic o refetch)
    // Aquí actualizamos el usuario en el array de usuarios para que el admin lo vea
    // Y idealmente deberíamos actualizar 'user' del AuthContext si queremos reflejarlo en el perfil
    await fetchInitialData() // Refetch simple
  }

  const reservarCancha = async ({ canchaId, fecha, horaInicio, horaFin }) => {
    if (!user) throw new Error('No autenticado')

    const res = await fetch(`${API_URL}/reservas`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ canchaId, fecha, horaInicio, horaFin })
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Error al reservar')

    setState(prev => ({
      ...prev,
      reservas: [...prev.reservas, data]
    }))
  }

  const inscribirClase = async (claseId) => {
    if (!user) throw new Error('No autenticado')

    const res = await fetch(`${API_URL}/clases/${claseId}/inscribir`, {
      method: 'POST',
      headers: authHeaders()
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Error al inscribir')

    await fetchInitialData() // Refetch para actualizar lista de inscriptos
  }

  const bajaClase = async (claseId) => {
    if (!user) throw new Error('No autenticado')

    const res = await fetch(`${API_URL}/clases/${claseId}/baja`, {
      method: 'DELETE',
      headers: authHeaders()
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Error al dar de baja')

    await fetchInitialData()
  }

  const comprarEntradas = async ({ partidoId, cantidad }) => {
    if (!user) throw new Error('No autenticado')

    const res = await fetch(`${API_URL}/entradas`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ partidoId, cantidad })
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Error compra entradas')

    await fetchInitialData() // Refetch para actualizar stock
  }

  // Admin Actions
  const admin = {
    actualizarUsuario: async (id, payload) => {
      if (!user) throw new Error('No autenticado')
      if (user.rol !== 'admin') throw new Error('Requiere rol de admin')

      try {
        const res = await fetch(`${API_URL}/usuarios/${id}/admin`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify(payload)
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Error al actualizar usuario' }))
          throw new Error(errorData.message || 'Error al actualizar usuario')
        }

        const data = await res.json()
        await fetchInitialData()
        return data
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error('Error de conexión. Verifica que el servidor esté corriendo.')
        }
        throw error
      }
    },

    eliminarUsuario: async (id) => {
      if (!user) throw new Error('No autenticado')
      if (user.rol !== 'admin') throw new Error('Requiere rol de admin')

      try {
        const res = await fetch(`${API_URL}/usuarios/${id}`, {
          method: 'DELETE',
          headers: authHeaders()
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Error al eliminar usuario' }))
          throw new Error(errorData.message || 'Error al eliminar usuario')
        }

        const data = await res.json()
        await fetchInitialData()
        return data
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error('Error de conexión. Verifica que el servidor esté corriendo.')
        }
        throw error
      }
    },

    toggleActivo: async (id) => {
      if (!user) throw new Error('No autenticado')
      if (user.rol !== 'admin') throw new Error('Requiere rol de admin')

      // Obtener el usuario actual para saber su estado
      const usuarioActual = state.usuarios.find(u => u.id === id)
      if (!usuarioActual) throw new Error('Usuario no encontrado')

      return await admin.actualizarUsuario(id, { activo: !usuarioActual.activo })
    },

    crearClase: async (payload) => {
      if (!user) throw new Error('No autenticado')
      if (user.rol !== 'admin') throw new Error('Requiere rol de admin')

      try {
        const res = await fetch(`${API_URL}/clases`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload)
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Error al crear clase' }))
          throw new Error(errorData.message || 'Error al crear clase')
        }

        const data = await res.json()
        await fetchInitialData()
        return data
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error('Error de conexión. Verifica que el servidor esté corriendo.')
        }
        throw error
      }
    },

    crearPartido: async (payload) => {
      if (!user) throw new Error('No autenticado')
      if (user.rol !== 'admin') throw new Error('Requiere rol de admin')

      try {
        const res = await fetch(`${API_URL}/partidos`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload)
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Error al crear partido' }))
          throw new Error(errorData.message || 'Error al crear partido')
        }

        const data = await res.json()
        await fetchInitialData()
        return data
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error('Error de conexión. Verifica que el servidor esté corriendo.')
        }
        throw error
      }
    },

    toggleEstadoCancha: async (id) => {
      const res = await fetch(`${API_URL}/canchas/${id}/toggle`, {
        method: 'PUT',
        headers: authHeaders()
      })
      if (res.ok) await fetchInitialData()
    }
  }

  const value = {
    state,
    loading,
    error,
    setState,
    fetchInitialData,
    pagarCuota,
    reservarCancha,
    inscribirClase,
    bajaClase,
    comprarEntradas,
    admin
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
