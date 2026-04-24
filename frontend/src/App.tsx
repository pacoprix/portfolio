import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import HomePage       from './pages/HomePage'
import AdminLogin     from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import './styles/global.css'

function RequireAuth({ children }: { children: React.ReactNode }) {
  return localStorage.getItem('jwt') ? <>{children}</> : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/portfolio">
        <Routes>
          <Route path="/*"           element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin"       element={<RequireAuth><AdminDashboard /></RequireAuth>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
