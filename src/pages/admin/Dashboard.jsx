import { useData } from '../../context/DataContext'
import Container from '../../components/Container'
import Card from '../../components/ui/Card'

export default function Dashboard() {
  const { state } = useData()
  /* 
     Backend devuelve campos planos: cuota_estado, cuota_mes, etc.
     El monto de la cuota definimos que es 15000 en Cuotas.jsx
  */
  const ingresosCuotas = state.usuarios.filter(u => u.cuota_estado === 'paga').length * 15000
  const entradasVendidas = state.entradas.reduce((acc, e) => acc + e.cantidad, 0)
  const totalUsuarios = state.usuarios.length
  const usuariosActivos = state.usuarios.filter(
    u => u.cuota_estado === 'paga'
  ).length

  return (
    <Container>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <h3 className="text-sm font-medium text-neutral-400 mb-2">Ingresos por cuotas</h3>
          <p className="text-2xl font-bold text-white">${ingresosCuotas.toLocaleString()}</p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-neutral-400 mb-2">Entradas vendidas</h3>
          <p className="text-2xl font-bold text-white">{entradasVendidas}</p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-neutral-400 mb-2">Total usuarios</h3>
          <p className="text-2xl font-bold text-white">{totalUsuarios}</p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-neutral-400 mb-2">Usuarios activos</h3>
          <p className="text-2xl font-bold text-white">{usuariosActivos}</p>
        </Card>
      </div>
    </Container>
  )
}