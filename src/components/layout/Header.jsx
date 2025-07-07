// components/layout/Header.jsx - ACTUALIZADO
import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useSubscription } from '../../hooks/useSubscription'
import { 
  UserCircleIcon, 
  CogIcon, 
  ChevronDownIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

const Header = ({ connectionStatus = 'connected' }) => {
  const { user, signOut } = useAuth()
  const { 
    subscription, 
    hasProAccess, 
    trialDaysLeft, 
    isTrialExpired,
    createProCheckout,
    loading: subscriptionLoading
  } = useSubscription()
  
  const [showUserMenu, setShowUserMenu] = useState(false)

  const getSubscriptionBadge = () => {
    if (!subscription) return null

    if (subscription.plan_type === 'pro' && subscription.status === 'active') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
          PRO
        </span>
      )
    }

    if (subscription.plan_type === 'free_trial' && !isTrialExpired) {
      const isUrgent = trialDaysLeft <= 2
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isUrgent 
            ? 'bg-red-100 text-red-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          <span className={`w-2 h-2 rounded-full mr-1 ${
            isUrgent ? 'bg-red-400' : 'bg-yellow-400'
          }`}></span>
          Trial: {trialDaysLeft}d
        </span>
      )
    }

    if (isTrialExpired) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
          Expirado
        </span>
      )
    }

    return null
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setShowUserMenu(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-500'
      case 'connecting':
        return 'bg-yellow-500'
      case 'disconnected':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Conectado'
      case 'connecting':
        return 'Conectando...'
      case 'disconnected':
        return 'Desconectado'
      default:
        return 'Estado desconocido'
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo y navegación */}
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0 flex items-center">
              <img 
                src="/meetraq.png" 
                alt="Meetraq" 
                className="h-8 w-auto"
              />
            </div>
            
            {/* Navegación principal (opcional) */}
            <nav className="hidden md:flex space-x-8">
              <a 
                href="/dashboard" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </a>
              <a 
                href="/pricing" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Planes
              </a>
            </nav>
          </div>

          {/* Centro - Estado de conexión */}
          <div className="flex items-center space-x-2">
            <span className={`h-2 w-2 rounded-full ${getConnectionStatusColor()}`}></span>
            <span className="text-sm text-gray-500">
              {getConnectionStatusText()}
            </span>
          </div>

          {/* Derecha - Controles de usuario */}
          <div className="flex items-center space-x-4">
            
            {/* Badge de suscripción */}
            {getSubscriptionBadge()}

            {/* Notificación de trial */}
            {subscription?.plan_type === 'free_trial' && trialDaysLeft <= 2 && !isTrialExpired && (
              <button
                onClick={() => window.location.href = '/pricing'}
                className="relative inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors"
              >
                <BellIcon className="h-4 w-4 mr-1" />
                Trial terminando
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full"></span>
              </button>
            )}

            {/* Botón de upgrade si no tiene PRO */}
            {!hasProAccess && (
              <button
                onClick={createProCheckout}
                disabled={subscriptionLoading}
                className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                {subscriptionLoading ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-1"></div>
                ) : (
                  <>⚡</>
                )}
                Actualizar a PRO
              </button>
            )}

            {/* Botón de ayuda */}
            <button className="text-gray-400 hover:text-gray-600 p-2 rounded-md">
              <QuestionMarkCircleIcon className="h-5 w-5" />
            </button>

            {/* Menú de usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 text-sm rounded-md p-2 hover:bg-gray-100 transition-colors"
              >
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.email}
                  </div>
                </div>
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              </button>

              {/* Dropdown del usuario */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    {/* Información del usuario */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center">
                        <UserCircleIcon className="h-10 w-10 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user?.user_metadata?.full_name || 'Usuario'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user?.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Estado de suscripción */}
                    <div className="px-4 py-2 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Plan actual</span>
                        {getSubscriptionBadge()}
                      </div>
                      {subscription?.plan_type === 'free_trial' && (
                        <div className="text-xs text-gray-500 mt-1">
                          {trialDaysLeft} días restantes
                        </div>
                      )}
                    </div>

                    {/* Opciones del menú */}
                    <a
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard
                    </a>
                    
                    <a
                      href="/pricing"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Planes y facturación
                    </a>
                    
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <CogIcon className="h-4 w-4 inline mr-2" />
                      Configuración
                    </button>
                    
                    <div className="border-t border-gray-200 my-1"></div>
                    
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 inline mr-2" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay para cerrar el menú */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </header>
  )
}

export default Header