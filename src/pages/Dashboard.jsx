// pages/Dashboard.jsx - ACTUALIZADO COMPLETO
import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import SubscriptionGate from '../components/SubscriptionGate'
import SubscriptionStatus from '../components/SubscriptionStatus'
import EngagementAnalyzer from '../components/EngagementAnalyzer'
import { 
  BarChart3,
  Users,
  Clock,
  Activity,
  Play,
  Settings,
  TrendingUp,
  AlertTriangle,
  Download
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const { 
    subscription, 
    hasProAccess, 
    trialDaysLeft, 
    isTrialExpired,
    planLimits,
    loading: subscriptionLoading
  } = useSubscription()
  
  const [activeTab, setActiveTab] = useState('live')
  const [recentSessions, setRecentSessions] = useState([])
  const [stats, setStats] = useState([
    {
      title: 'Sessions This Month',
      value: '12',
      change: '+2.1%',
      icon: Play,
      color: 'blue'
    },
    {
      title: 'Avg Engagement',
      value: '78%',
      change: '+5.2%',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Total Participants',
      value: '156',
      change: '+12.3%',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Analysis Time',
      value: '24.5h',
      change: '+1.8%',
      icon: Clock,
      color: 'orange'
    }
  ])

  useEffect(() => {
    // Simular carga de datos
    setRecentSessions([
      {
        id: 1,
        name: 'Sprint Planning Meeting',
        date: '2025-01-15',
        duration: '45m',
        participants: 8,
        engagement: 85
      },
      {
        id: 2,
        name: 'Q4 Results Presentation',
        date: '2025-01-14',
        duration: '1h 20m',
        participants: 12,
        engagement: 72
      },
      {
        id: 3,
        name: 'Team Retrospective',
        date: '2025-01-13',
        duration: '30m',
        participants: 6,
        engagement: 91
      }
    ])
  }, [])

  const getStatColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    }
    return colors[color] || 'bg-gray-100 text-gray-600'
  }

  const WelcomeBanner = () => {
    if (subscriptionLoading) return null

    // Banner de bienvenida para trial
    if (subscription?.plan_type === 'free_trial' && !isTrialExpired) {
      return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">
                ¡Bienvenido a tu prueba gratuita de Meetraq PRO! 🚀
              </h2>
              <p className="text-blue-100">
                Te quedan {trialDaysLeft} días para explorar todas las funcionalidades avanzadas.
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/pricing'}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Actualizar a PRO
            </button>
          </div>
        </div>
      )
    }

    // Banner para trial expirado
    if (isTrialExpired) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-red-800 mb-2">
                Tu prueba gratuita ha expirado
              </h2>
              <p className="text-red-600">
                Actualiza a PRO para seguir disfrutando de todas las funcionalidades avanzadas.
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/pricing'}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Actualizar Ahora
            </button>
          </div>
        </div>
      )
    }

    // Banner para PRO activo
    if (hasProAccess && subscription?.plan_type === 'pro') {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
            <p className="text-green-800 font-medium">
              Suscripción PRO activa - Acceso completo a todas las funcionalidades
            </p>
          </div>
        </div>
      )
    }

    return null
  }

  const QuickStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <p className="text-sm text-green-600 mt-1">{stat.change}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatColor(stat.color)}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const UsageLimits = () => {
    if (!planLimits || planLimits.maxSessions === -1) return null

    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-yellow-800">
              Límites del plan actual
            </h3>
            <p className="text-sm text-yellow-700">
              Sesiones: {recentSessions.length} / {planLimits.maxSessions}
            </p>
          </div>
          <div className="w-32 bg-yellow-200 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full"
              style={{ width: `${Math.min(100, (recentSessions.length / planLimits.maxSessions) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Banner de bienvenida */}
        <WelcomeBanner />

        {/* Límites de uso */}
        <UsageLimits />

        {/* Estadísticas rápidas */}
        <QuickStats />

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('live')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'live'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Análisis en Vivo
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Reportes
                {!hasProAccess && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-1">
                    PRO
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configuración
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'live' && (
          <div>
            <EngagementAnalyzer />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Recent Sessions */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Sesiones Recientes</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sesión
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duración
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Participantes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Engagement
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{session.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(session.date).toLocaleDateString('es-ES')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{session.duration}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{session.participants}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                              <div 
                                className={`h-2 rounded-full ${
                                  session.engagement >= 80 ? 'bg-green-500' :
                                  session.engagement >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${session.engagement}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {session.engagement}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {recentSessions.length === 0 && (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No tienes sesiones recientes</p>
                  <p className="text-sm text-gray-400">Inicia tu primera sesión de análisis</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <SubscriptionGate requiredPlan="pro">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Reportes Avanzados
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Reporte Semanal</h3>
                    <p className="text-sm text-blue-700 mb-4">
                      Análisis detallado de todas las sesiones de esta semana
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                      Generar Reporte
                    </button>
                  </div>
                  
                  <div className="p-6 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-900 mb-2">Tendencias Mensuales</h3>
                    <p className="text-sm text-green-700 mb-4">
                      Evolución del engagement a lo largo del mes
                    </p>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
                      Ver Tendencias
                    </button>
                  </div>
                  
                  <div className="p-6 bg-purple-50 rounded-lg">
                    <h3 className="font-medium text-purple-900 mb-2">Exportar Datos</h3>
                    <p className="text-sm text-purple-700 mb-4">
                      Descarga todos tus datos en formato CSV o Excel
                    </p>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700">
                      Exportar
                    </button>
                  </div>
                  
                  <div className="p-6 bg-orange-50 rounded-lg">
                    <h3 className="font-medium text-orange-900 mb-2">Dashboard Ejecutivo</h3>
                    <p className="text-sm text-orange-700 mb-4">
                      Vista resumen para presentaciones ejecutivas
                    </p>
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700">
                      Abrir Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </SubscriptionGate>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información de la Cuenta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plan
                    </label>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        hasProAccess ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {hasProAccess ? 'PRO' : 'Gratis'}
                      </span>
                      {!hasProAccess && (
                        <button 
                          onClick={() => window.location.href = '/pricing'}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Actualizar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Preferencias de Análisis</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        Alertas en Tiempo Real
                      </label>
                      <p className="text-sm text-gray-500">
                        Recibe notificaciones cuando el engagement baje del umbral
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        Guardar Sesiones Automáticamente
                      </label>
                      <p className="text-sm text-gray-500">
                        Guarda automáticamente los datos de análisis después de cada sesión
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estado de suscripción */}
        <div className="mt-8">
          <SubscriptionStatus />
        </div>
      </div>
    </div>
  )
}

export default Dashboard