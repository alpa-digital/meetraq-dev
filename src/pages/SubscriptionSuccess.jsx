// pages/SubscriptionSuccess.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSubscription } from '../hooks/useSubscription'
import { useAuth } from '../contexts/AuthContext'
import { 
  CheckCircleIcon, 
  SparklesIcon,
  RocketLaunchIcon,
  GiftIcon,
  HeartIcon
} from '@heroicons/react/24/solid'

const SubscriptionSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { refreshSubscription, subscription } = useSubscription()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [confetti, setConfetti] = useState(false)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (sessionId) {
      // Esperar un poco para que el webhook procese la suscripción
      setTimeout(() => {
        refreshSubscription()
        setLoading(false)
        setConfetti(true)
        
        // Quitar confetti después de 3 segundos
        setTimeout(() => setConfetti(false), 3000)
      }, 3000)
    } else {
      setLoading(false)
    }
  }, [searchParams, refreshSubscription])

  const handleContinue = () => {
    navigate('/dashboard')
  }

  const handleViewPricing = () => {
    navigate('/pricing')
  }

  const features = [
    {
      icon: RocketLaunchIcon,
      title: 'Análisis Ilimitado',
      description: 'Analiza tantas reuniones como necesites sin restricciones'
    },
    {
      icon: SparklesIcon,
      title: 'IA Avanzada',
      description: 'Detección de emociones y engagement con la última tecnología'
    },
    {
      icon: GiftIcon,
      title: 'Reportes Premium',
      description: 'Exporta datos y genera reportes ejecutivos detallados'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Procesando tu suscripción...
          </h2>
          <p className="text-gray-600 mb-4">
            Estamos configurando tu cuenta PRO
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-150"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-300"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Confetti effect */}
      {confetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="confetti">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full opacity-20 animate-pulse animation-delay-1000"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Main success card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center transform transition-all duration-500 hover:scale-105">
            <div className="relative mb-8">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-green-400 to-blue-500 mb-6 animate-bounce">
                <CheckCircleIcon className="h-10 w-10 text-white" />
              </div>
              
              <div className="absolute -top-2 -right-2 animate-ping">
                <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ¡Bienvenido a Meetraq PRO! 🎉
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Tu suscripción se ha activado correctamente. Ya puedes acceder a todas las 
              funcionalidades avanzadas de nuestra plataforma de análisis de reuniones.
            </p>

            {/* Subscription details */}
            {subscription && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <HeartIcon className="h-6 w-6 text-red-500 mr-2" />
                  <h3 className="font-semibold text-gray-900">
                    Detalles de tu suscripción
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-gray-600">Plan</p>
                    <p className="font-semibold text-gray-900">Meetraq PRO</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-gray-600">Precio</p>
                    <p className="font-semibold text-gray-900">€12.99/mes</p>
                  </div>
                  {subscription.current_period_end && (
                    <>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-600">Próxima facturación</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(subscription.current_period_end).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-600">Estado</p>
                        <p className="font-semibold text-green-600">✓ Activo</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Features unlocked */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Funcionalidades desbloqueadas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mb-4 mx-auto">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-4">
              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105"
              >
                Ir al Dashboard
              </button>
              
              <button
                onClick={handleViewPricing}
                className="w-full bg-white text-gray-700 py-3 px-6 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 transition-colors"
              >
                Ver Detalles del Plan
              </button>
            </div>

            {/* Welcome message */}
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">
                ¡Gracias por confiar en Meetraq! 🚀
              </h4>
              <p className="text-sm text-gray-600">
                Estamos emocionados de ayudarte a llevar tus reuniones al siguiente nivel. 
                Nuestro equipo está aquí para apoyarte en todo momento.
              </p>
            </div>
          </div>

          {/* Additional info cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                💡 Comienza ahora
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Inicia tu primera sesión de análisis y descubre insights valiosos sobre tus reuniones.
              </p>
              <button
                onClick={handleContinue}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Empezar análisis →
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                🎯 Soporte Premium
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Como usuario PRO, tienes acceso a nuestro soporte prioritario para resolver cualquier duda.
              </p>
              <a
                href="mailto:support@meetraq.com"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Contactar soporte →
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              ¿Tienes alguna pregunta? Estamos aquí para ayudarte.
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="mailto:support@meetraq.com" className="text-blue-600 hover:text-blue-700 text-sm">
                📧 Email
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">
                📚 Documentación
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">
                💬 Chat en vivo
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CSS para el confetti y animaciones */}
      <style jsx>{`
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #3B82F6;
          animation: confetti-fall 3s linear infinite;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  )
}

export default SubscriptionSuccess