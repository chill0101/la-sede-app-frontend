import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import Container from '../../components/Container'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'

export default function Usuarios() {
  const { user } = useAuth()
  const { state, admin } = useData()
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', rol: '', activo: true })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // --- FUNCIONES ---

  const toggleActivo = async (id) => {
    setError(null)
    setLoading(true)
    try {
      await admin.toggleActivo(id)
    } catch (err) {
      setError(err.message || 'Error al cambiar estado del usuario')
    } finally {
      setLoading(false)
    }
  }

  const eliminarUsuario = async (id) => {
    const target = state.usuarios.find(u => u.id === id)
    // 🔒 No permitir eliminarse a sí mismo
    if (target?.email === user.email) {
      alert('No podés eliminarte a vos mismo.')
      return
    }

    if (window.confirm(`¿Seguro que deseas eliminar a ${target?.nombre}?`)) {
      setError(null)
      setLoading(true)
      try {
        await admin.eliminarUsuario(id)
      } catch (err) {
        setError(err.message || 'Error al eliminar usuario')
        setLoading(false)
      }
    }
  }

  const comenzarEdicion = (u) => {
    // 🔒 No permitir editarse a sí mismo
    if (u.email === user.email) {
      alert('No podés editar tu propio usuario desde acá.')
      return
    }

    setEditando(u.id)
    setForm({
      nombre: u.nombre,
      apellido: u.apellido,
      email: u.email,
      rol: u.rol,
      activo: u.activo,
    })
  }

  const guardarEdicion = async (id) => {
    setError(null)
    setLoading(true)
    try {
      await admin.actualizarUsuario(id, form)
      setEditando(null)
    } catch (err) {
      setError(err.message || 'Error al actualizar usuario')
    } finally {
      setLoading(false)
    }
  }

  // --- TABLA ---

  const headers = ['Nombre', 'Email', 'Rol', 'Activo', 'Acciones']

  const rows = state.usuarios.map(u => {
    if (editando === u.id) {
      // Modo edición
      return [
        <div key={`nombre-${u.id}`} className="flex flex-col gap-1">
          <input
            className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <input
            className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white"
            value={form.apellido}
            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
          />
        </div>,
        <input
          className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />,
        <select
          className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white"
          value={form.rol}
          onChange={(e) => setForm({ ...form, rol: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>,
        <select
          className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white"
          value={form.activo ? 'Sí' : 'No'}
          onChange={(e) => setForm({ ...form, activo: e.target.value === 'Sí' })}
        >
          <option>Sí</option>
          <option>No</option>
        </select>,
        <div className="flex gap-2">
          <Button size="sm" variant="primary" onClick={() => guardarEdicion(u.id)}>
            Guardar
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setEditando(null)}>
            Cancelar
          </Button>
        </div>,
      ]
    }

    // Modo normal
    return [
      `${u.nombre} ${u.apellido}`,
      u.email,
      u.rol,
      u.activo ? 'Sí' : 'No',
      <div key={`actions-${u.id}`} className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => toggleActivo(u.id)}>
          {u.activo ? 'Desactivar' : 'Activar'}
        </Button>

        {u.email !== user.email && (
          <>
            <Button size="sm" variant="primary" onClick={() => comenzarEdicion(u)}>
              Editar
            </Button>
            <Button size="sm" variant="danger" onClick={() => eliminarUsuario(u.id)}>
              Eliminar
            </Button>
          </>
        )}
      </div>,
    ]
  })

  return (
    <Container>
      <h2 className="text-xl font-bold mb-4">Usuarios</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
          {error}
        </div>
      )}
      {loading && (
        <div className="mb-4 p-3 bg-blue-900/50 border border-blue-700 rounded text-blue-200 text-sm">
          Procesando...
        </div>
      )}
      <Table headers={headers} rows={rows} />
    </Container>
  )
}

