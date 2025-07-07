// components/SubscriptionStatus.jsx
import React, { useState } from 'react'
import { useSubscription } from '../hooks/useSubscription'
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  XCircleIcon,
  CreditCardIcon,
  CalendarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

const SubscriptionStatus = () => {
  const { 
    subscription, 
    trialDaysLeft, 
    isTrialExpired,
    hasProAccess,
    cancelSubscription,
    createProCheckout,
    loading,
    refreshSubscription
  } = useSubscription()

  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  if (!subscription) return null

  const getStatusIcon = () => {
    if (subscription.plan_type === 'pro' && subscription.status === 'active') {
      return <CheckCircleIcon className="h-6 w-6 text-green-500" />
    }
    if (subscription.plan_type === 'free_trial' && !isTrialExpired) {
      return <ClockIcon className="h-6 w-6 text-yellow-500" />
    }
    if (subscription.status === 'past_due') {
      return <CreditCardIcon className="h-6 w-6 text-orange-500" />
    }
    if (subscription.status === 'canceled') {
      return <XCircleIcon className="h-6 w-6 text-gray-500" />
    }
    return <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
  }

  const getStatusText = () => {
    if (subscription.plan_type === 'pro' && subscription.status === 'active') {
      return 'Suscripción PRO Activa'
    }
    if (subscription.plan_type === 'free_trial' && !isTrialExpired) {
      return `Prueba Gratuita - ${trialDaysLeft} día${trialDaysLeft !== 1 ? 's' : ''} restante${trialDaysLeft !== 1 ? 's' : ''}`
    }
    if (subscription.plan_type === 'free_trial' && isTrialExpired) {
      return 'Prueba Gratuita Expirada'
    }
    if (subscription.status === 'past_due') {
      return 'Pago Pendiente'
    }
    if (subscription.status === 'canceled') {
      return 'Suscripción Cancelada'
    }
    return 'Estado Desconocido'
  }

  const getStatusColor = () => {
    if (subscription.plan_type === 'pro' && subscription.status === 'active') {
      return 'bg-green-50 border-green-200'
    }
    if (subscription.plan_type === 'free_trial' && !isTrialExpired) {
      return trialDaysLeft <= 2 ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-200'
    }
    if (subscription.status === 'past_due') {
      return 'bg-orange-50 border-orange-200'
    }
    if (subscription.status === 'canceled') {
      return 'bg-gray-50 border-gray-200'
    }
    return 'bg-red-50 border-red-200'
  }

  const getStatusMessage = () => {
    if (subscription.plan_type === 'pro' && subscription.status === 'active') {
      return 'Tienes acceso completo a todas las funcionalidades avanzadas de Meetraq.'
    }
    if (subscription.plan_type === 'free_trial' && !isTrialExpired) {
      if (trialDaysLeft <= 1) {
        return 'Tu prueba gratuita termina muy pronto. Actualiza ahora para no perder acceso.'
      } else if (trialDaysLeft <= 3) {
        return 'Tu prueba gratuita está terminando. Considera actualizar a PRO.'
      }
      return 'Estás disfrutando de tu prueba gratuita con acceso completo.'
    }
    if (subscription.plan_type === 'free_trial' && isTrialExpired) {
      return 'Tu prueba gratuita ha terminado. Actualiza a PRO para continuar.'
    }
    if (subscription.status === 'past_due') {
      return 'Tu pago está pendiente. Actualiza tu método de pago para continuar.'
    }
    if (subscription.status === 'canceled') {
      const periodEnd = subscription.current_period_end
      if (periodEnd && new Date() < new Date(periodEnd)) {
        return `Mantendrás acceso hasta ${new Date(periodEnd).toLocaleDateString('es-ES')}.`
      }
      return 'Tu suscripción ha sido cancelada.'
    }
    return 'Contacta con soporte para resolver el estado de tu suscripción.'
  }

  const handleCancelSubscription = async () => {
    setCancelling(true)
    try {
      const result = await cancelSubscription()
      if (result.success) {
        setShowCancelModal(false)
        // Mostrar mensaje de éxito
        alert('Suscripción cancelada correctamente. Mantendrás acceso hasta el final del período actual.')
      } else {
        alert('Error al cancelar la suscripción: ' + result.error)
      }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      alert('Error al cancelar la suscripción. Inténtalo de nuevo.')
    } finally {
      setCancelling(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="mt-12">
      <div className={`rounded-xl border-2 p-6 ${getStatusColor()}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {getStatusIcon()}
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {getStatusText()}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {getStatusMessage()}
              </p>
              
              {/* Información adicional */}
              <div className="mt-4 space-y-2">
                {subscription.plan_type === 'pro' && subscription.current_period_end && (
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>
                      Próxima facturación: {formatDate(subscription.current_period_end)}
                    </span>
                  </div>
                )}
                
                {subscription.plan_type === 'free_trial' && subscription.trial_ends_at && (
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>
                      Trial expira: {formatDate(subscription.trial_ends_at)}
                    </span>
                  </div>
                )}

                {subscription.plan_type === 'pro' && subscription.status === 'active' && (
                  <div className="flex items-center text-sm text-gray-600">
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                    <span>€12.99/mes</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 ml-4">
            {/* Botón de refresh */}
            <button
              onClick={refreshSubscription}
              disabled={loading}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>

            {/* Botón principal de acción */}
            {subscription.plan_type === 'pro' && subscription.status === 'active' && (
              <button
                onClick={() => setShowCancelModal(true)}
                disabled={loading}
                className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
              >
                Cancelar Suscripción
              </button>
            )}
            
            {(subscription.plan_type === 'free_trial' || subscription.status === 'canceled' || isTrialExpired) && (
              <button
                onClick={createProCheckout}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Actualizar a PRO'}
              </button>
            )}

            {subscription.status === 'past_due' && (
              <button
                onClick={createProCheckout}
                disabled={loading}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Actualizar Pago'}
              </button>
            )}
          </div>
        </div>

        {/* Barra de progreso para trial */}
        {subscription.plan_type === 'free_trial' && !isTrialExpired && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progreso del trial</span>
              <span>{trialDaysLeft} de 7 días restantes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((7 - trialDaysLeft) / 7) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de cancelación */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Cancelar suscripción?
              </h3>
              
              <p className="text-gray-600 mb-6">
                Tu suscripción se cancelará, pero mantendrás acceso hasta el final del período actual 
                ({formatDate(subscription.current_period_end)}).
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelling}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {cancelling ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Cancelando...
                    </div>
                  ) : (
                    'Sí, cancelar suscripción'
                  )}
                </button>
                
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelling}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Mantener suscripción
                </button>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                <p>Si cambias de opinión, puedes reactivar tu suscripción en cualquier momento.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubscriptionStatus