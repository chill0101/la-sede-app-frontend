import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Perfil from './pages/Perfil'
import Cuotas from './pages/Cuotas'
import Canchas from './pages/Canchas'
import Clases from './pages/Clases'
import Entradas from './pages/Entradas'
import MisActividades from './pages/MisActividades'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Usuarios from './pages/admin/Usuarios'
import CanchasABM from './pages/admin/CanchasABM'
import ClasesABM from './pages/admin/ClasesABM'
import PartidosABM from './pages/admin/PartidosABM'
import ProtectedRoute from './routes/ProtectedRoute'


export default function App() {
return (
<div className="min-h-screen bg-neutral-950 text-neutral-100">
<Navbar />
<main className="p-0 m-0">
<Routes>
<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />


{/* Rutas protegidas (user logueado) */}
<Route element={<ProtectedRoute roles={["user", "admin"]} />}>
<Route path="/perfil" element={<Perfil />} />
<Route path="/cuotas" element={<Cuotas />} />
<Route path="/canchas" element={<Canchas />} />
<Route path="/clases" element={<Clases />} />
<Route path="/entradas" element={<Entradas />} />
<Route path="/mis-actividades" element={<MisActividades />} />
</Route>


{/* Rutas Admin */}
<Route element={<ProtectedRoute roles={["admin"]} />}>
<Route path="/admin" element={<AdminLayout />}>
<Route index element={<Dashboard />} />
<Route path="usuarios" element={<Usuarios />} />
<Route path="canchas" element={<CanchasABM />} />
<Route path="clases" element={<ClasesABM />} />
<Route path="partidos" element={<PartidosABM />} />
</Route>
</Route>


<Route path="*" element={<Navigate to="/" />} />
</Routes>
</main>
</div>
)
}