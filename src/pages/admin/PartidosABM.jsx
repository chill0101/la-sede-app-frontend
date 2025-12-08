import { useState } from 'react'
import { useData } from '../../context/DataContext'
import Container from '../../components/Container'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'

export default function PartidosABM() {
  const { state, setState } = useData()
  const [rival, setRival] = useState('')
  const [fechaHora, setFechaHora] = useState('')
  const [stockEntradas, setStockEntradas] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const rivalesDisponibles = [
    'Boca Juniors',
    'River Plate',
    'San Lorenzo',
    'Racing Club',
    'Independiente',
    'Estudiantes LP',
    'Gimnasia LP',
    'Rosario Central',
    'Newell’s Old Boys',
    'Vélez Sarsfield',
  ]

  const handleAgregar = (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!rival || !fechaHora || !stockEntradas) {
      setError('Todos los campos son obligatorios')
      return
    }

    const nuevoPartido = {
      id: Date.now(),
      rival,
      fechaHora,
      stockEntradas: parseInt(stockEntradas),
    }

    setState((prev) => ({
      ...prev,
      partidos: [...prev.partidos, nuevoPartido],
    }))

    setRival('')
    setFechaHora('')
    setStockEntradas('')
    setSuccess('Partido agregado con éxito ✅')
  }

  const headers = ['Rival', 'Fecha y Hora', 'Stock de Entradas']

  const rows = state.partidos.map((p) => [
    <span className="font-medium">{p.rival}</span>,
    new Date(p.fechaHora).toLocaleString(),
    <Badge variant={p.stockEntradas > 0 ? 'success' : 'error'}>
      {p.stockEntradas}
    </Badge>,
  ])

  return (
    <Container>
      <PageHeader title="Gestión de Partidos" subtitle="Creación y administración de los partidos del club" />

      <form onSubmit={handleAgregar} className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 mb-6 space-y-4">
        <h2 className="text-lg font-semibold">Agregar nuevo partido</h2>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Rival</label>
            <select
              value={rival}
              onChange={(e) => setRival(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="">Seleccionar rival...</option>
              {rivalesDisponibles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-neutral-300 mb-1">Fecha y Hora</label>
            <input
              type="datetime-local"
              value={fechaHora}
              onChange={(e) => setFechaHora(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-300 mb-1">Stock de Entradas</label>
            <input
              type="number"
              min="0"
              value={stockEntradas}
              onChange={(e) => setStockEntradas(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Ej: 500"
            />
          </div>
        </div>

        <Button type="submit" className="mt-3">
          Agregar Partido
        </Button>
      </form>

      <Table headers={headers} rows={rows} />
    </Container>
  )
}
