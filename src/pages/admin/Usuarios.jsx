import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import Container from '../../components/Container'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'

export default function Usuarios() {
  const { user } = useAuth()
  const { state, setState } = useData()
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', rol: '', activo: true })

  // --- FUNCIONES ---

  const toggleActivo = (id) => {
    setState(prev => ({
      ...prev,
      usuarios: prev.usuarios.map(u =>
        u.id === id ? { ...u, activo: !u.activo } : u
      ),
    }))
  }

  const eliminarUsuario = (id) => {
    const target = state.usuarios.find(u => u.id === id)
    // 🔒 No permitir eliminarse a sí mismo
    if (target?.email === user.email) {
      alert('No podés eliminarte a vos mismo.')
      return
    }

    if (window.confirm(`¿Seguro que deseas eliminar a ${target?.nombre}?`)) {
      setState(prev => ({
        ...prev,
        usuarios: prev.usuarios.filter(u => u.id !== id),
      }))
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

  const guardarEdicion = (id) => {
    setState(prev => ({
      ...prev,
      usuarios: prev.usuarios.map(u =>
        u.id === id ? { ...u, ...form } : u
      ),
    }))
    setEditando(null)
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
      <Table headers={headers} rows={rows} />
    </Container>
  )
}

