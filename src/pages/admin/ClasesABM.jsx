import { useState } from 'react'
import { useData } from '../../context/DataContext'
import Container from '../../components/Container'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function ClasesABM() {
  const { state, admin } = useData()

  const [nuevaClase, setNuevaClase] = useState({
    disciplina: '',
    diaSemana: '',
    hora: '',
    cupo: ''
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setNuevaClase(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (!nuevaClase.disciplina || !nuevaClase.diaSemana || !nuevaClase.hora || !nuevaClase.cupo) {
      setError('Todos los campos son obligatorios')
      setLoading(false)
      return
    }

    try {
      await admin.crearClase({
        disciplina: nuevaClase.disciplina,
        diaSemana: nuevaClase.diaSemana,
        hora: nuevaClase.hora,
        cupo: parseInt(nuevaClase.cupo)
      })

      setNuevaClase({ disciplina: '', diaSemana: '', hora: '', cupo: '' })
      setSuccess('Clase creada con éxito ✅')
    } catch (err) {
      setError(err.message || 'Error al crear clase')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <PageHeader title="Gestión de Clases" />

      {/* Formulario para crear nuevas clases */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-4 rounded-xl mb-6 shadow-md grid md:grid-cols-5 gap-3"
      >
        {error && (
          <div className="col-span-5 p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="col-span-5 p-3 bg-green-900/50 border border-green-700 rounded text-green-200 text-sm">
            {success}
          </div>
        )}
        <Input
          label="Disciplina"
          name="disciplina"
          value={nuevaClase.disciplina}
          onChange={handleChange}
          placeholder="Ej: Yoga, Crossfit..."
        />
        <Input
          label="Día de la semana"
          name="diaSemana"
          value={nuevaClase.diaSemana}
          onChange={handleChange}
          placeholder="Ej: Lunes, Martes..."
        />
        <Input
          label="Horario"
          name="hora"
          value={nuevaClase.hora}
          onChange={handleChange}
          placeholder="Ej: 18:00 hs"
        />
        <Input
          label="Cupo disponible"
          name="cupo"
          type="number"
          min="1"
          value={nuevaClase.cupo}
          onChange={handleChange}
          placeholder="Ej: 20"
        />
        <div className="flex flex-col justify-end">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Creando...' : 'Crear clase'}
          </Button>
        </div>
      </form>

      {/* Listado de clases */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.clases.length === 0 ? (
          <p className="text-gray-400">No hay clases registradas.</p>
        ) : (
          state.clases.map(c => {
            const inscriptosCount = (c.Usuarios || []).length;
            const cupoDisponible = c.cupo - inscriptosCount
            return (
              <Card key={c.id}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">{c.disciplina}</h3>
                  <Badge variant={cupoDisponible === 0 ? 'error' : 'success'}>
                    {(c.Usuarios || []).length}/{c.cupo}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-400">
                  {c.diaSemana} • {c.hora}
                </p>
              </Card>
            )
          })
        )}
      </div>
    </Container>
  )
}
