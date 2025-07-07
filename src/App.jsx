// App.jsx - ACTUALIZADO
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import PricingPage from './components/Pricing'
import SubscriptionSuccess from './pages/SubscriptionSuccess'
import Header from './components/layout/Header'
import Loading from './components/ui/Loading'

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Loading
        title="Cargando Meetraq"
        description="Inicializando plataforma de análisis de reuniones..."
        fullScreen={true}
      />
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header connectionStatus="connected" />
      <main className="pb-8">
        {children}
      </main>
    </div>
  )
}

// Componente para rutas públicas
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Loading
        title="Cargando Meetraq"
        description="Inicializando plataforma de análisis de reuniones..."
        fullScreen={true}
      />
    )
  }

  // Si el usuario ya está autenticado, redirigir al dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// Componente para rutas híbridas (funcionan con y sin autenticación)
const HybridRoute = ({ children, showHeaderWhenAuthenticated = true }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Loading
        title="Cargando Meetraq"
        description="Inicializando plataforma de análisis de reuniones..."
        fullScreen={true}
      />
    )
  }

  // Si el usuario está autenticado y queremos mostrar header
  if (user && showHeaderWhenAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header connectionStatus="connected" />
        <main className="pb-8">
          {children}
        </main>
      </div>
    )
  }

  // Si no hay usuario o no queremos header, mostrar solo el contenido
  return children
}

// Componente principal de la aplicación
const AppContent = () => {
  return (
    <Router>
      <div className="meetraq-app">
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />

          {/* Página de precios (híbrida - funciona con y sin autenticación) */}
          <Route
            path="/pricing"
            element={
              <HybridRoute>
                <PricingPage />
              </HybridRoute>
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/subscription-success"
            element={
              <ProtectedRoute>
                <SubscriptionSuccess />
              </ProtectedRoute>
            }
          />

          {/* Rutas adicionales protegidas */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div className="max-w-4xl mx-auto px-4 py-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600">Configuración de perfil próximamente...</p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <div className="max-w-4xl mx-auto px-4 py-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuración</h1>
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600">Configuración de la aplicación próximamente...</p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Página 404 */}
          <Route
            path="/404"
            element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Volver al inicio
                  </button>
                </div>
              </div>
            }
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>

        {/* Preload de recursos críticos */}
        <div style={{ display: 'none' }}>
          <img src="/meetraq.png" alt="Meetraq preload" />
          <link rel="preload" href="/meetraq.png" as="image" />
        </div>


      </div>
    </Router>
  )
}

// Componente raíz de la aplicación
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App