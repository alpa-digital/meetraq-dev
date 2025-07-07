// components/SubscriptionGate.jsx
import React, { useEffect, useState } from 'react'
import { useSubscription } from '../hooks/useSubscription'
import { LockClosedIcon, StarIcon } from '@heroicons/react/24/outline'

const SubscriptionGate = ({ children, requiredPlan = 'pro', showUpgrade = true }) => {
  const { hasProAccess, subscription, loading, trialDaysLeft, isTrialExpired, createProCheckout } = useSubscription()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    if (!loading && requiredPlan === 'pro' && !hasProAccess && showUpgrade) {
      setShowUpgradeModal(true)
    }
  }, [loading, requiredPlan, hasProAccess, showUpgrade])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Si tiene acceso, mostrar contenido
  if (hasProAccess) {
    return children
  }

  // Si no mostrar upgrade, mostrar contenido bloqueado
  if (!showUpgrade) {
    return (
      <div className="relative">
        <div className="filter blur-sm pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 rounded-lg">
          <div className="text-center">
            <LockClosedIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Funcionalidad PRO</p>
          </div>
        </div>
      </div>
    )
  }

  // Modal de upgrade
  if (showUpgradeModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <StarIcon className="h-6 w-6 text-blue-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Funcionalidad PRO
            </h3>
            
            <p className="text-gray-600 mb-6">
              Esta funcionalidad requiere una suscripción PRO para acceder a todas las características avanzadas de Meetraq.
            </p>

            {subscription?.plan_type === 'free_trial' && isTrialExpired && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-orange-700">
                  Tu prueba gratuita ha expirado. Actualiza a PRO para seguir disfrutando de todas las funcionalidades.
                </p>
              </div>
            )}

            {subscription?.plan_type === 'free_trial' && !isTrialExpired && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-700">
                  Te quedan {trialDaysLeft} días de prueba gratuita. Actualiza ahora para no perder acceso.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={createProCheckout}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Actualizar a PRO - €12.99/mes
              </button>
              
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default SubscriptionGate