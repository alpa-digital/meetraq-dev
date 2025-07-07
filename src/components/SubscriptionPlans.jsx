// components/SubscriptionPlans.jsx
import React from 'react'
import { CheckIcon, StarIcon } from '@heroicons/react/24/solid'
import { useSubscription } from '../hooks/useSubscription'

const SubscriptionPlans = ({ onSelectPlan }) => {
  const { 
    subscription, 
    hasProAccess, 
    trialDaysLeft, 
    isTrialExpired,
    startFreeTrial, 
    createProCheckout,
    loading 
  } = useSubscription()

  const plans = [
    {
      id: 'free_trial',
      name: 'Prueba Gratuita',
      price: 'Gratis',
      duration: '7 días',
      description: 'Perfecto para probar Meetraq',
      features: [
        'Análisis de hasta 10 reuniones',
        'Detección de engagement avanzada',
        'Reportes detallados',
        'Soporte por email',
        'Todas las funcionalidades PRO'
      ],
      popular: false,
      disabled: !!subscription,
      buttonText: subscription ? 'Ya tienes una suscripción' : 'Iniciar Prueba Gratuita',
      bgColor: 'bg-white',
      borderColor: 'border-gray-200'
    },
    {
      id: 'pro',
      name: 'Meetraq PRO',
      price: '12,99€',
      duration: '/mes',
      description: 'Para equipos que quieren el máximo rendimiento',
      features: [
        'Análisis ilimitado de reuniones',
        'IA avanzada de engagement',
        'Reportes detallados y exportables',
        'Análisis de tendencias',
        'Integraciones con calendario',
        'Soporte prioritario',
        'Análisis de emociones',
        'Dashboard ejecutivo',
        'Exportación de datos',
        'API access'
      ],
      popular: true,
      disabled: hasProAccess,
      buttonText: hasProAccess ? 'Plan Activo' : 'Suscribirse Ahora',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500'
    }
  ]

  const handleSelectPlan = async (planId) => {
    if (loading) return

    try {
      if (planId === 'free_trial') {
        const result = await startFreeTrial()
        if (result.success) {
          onSelectPlan?.('free_trial')
        } else {
          alert('Error al iniciar la prueba gratuita: ' + result.error)
        }
      } else if (planId === 'pro') {
        await createProCheckout()
      }
    } catch (error) {
      console.error('Error selecting plan:', error)
      alert('Error al procesar la suscripción. Inténtalo de nuevo.')
    }
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Elige tu plan
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Comienza con 7 días gratis o accede directamente a todas las funciones PRO
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-8 shadow-lg transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? `${plan.bgColor} ${plan.borderColor}`
                  : `${plan.bgColor} ${plan.borderColor}`
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-1 rounded-full bg-blue-500 px-4 py-1 text-sm font-medium text-white shadow-lg">
                    <StarIcon className="h-4 w-4" />
                    <span>Más Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-gray-600">{plan.description}</p>
                
                <div className="mt-6 flex items-center justify-center">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  {plan.duration && (
                    <span className="ml-2 text-xl text-gray-600">{plan.duration}</span>
                  )}
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={plan.disabled || loading}
                  className={`mt-8 w-full rounded-lg px-6 py-4 text-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                    plan.disabled || loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:scale-100'
                      : plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                      : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </div>
                  ) : (
                    plan.buttonText
                  )}
                </button>

                {plan.id === 'pro' && !hasProAccess && (
                  <p className="mt-3 text-sm text-gray-500">
                    Sin permanencia • Cancela cuando quieras
                  </p>
                )}
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPlans