// pages/PricingPage.jsx - COMPLETO
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import SubscriptionPlans from '../components/SubscriptionPlans'
import { 
  CheckIcon, 
  StarIcon, 
  XMarkIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
  CreditCardIcon,
  GlobeAltIcon
} from '@heroicons/react/24/solid'
import { 
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

const PricingPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { subscription, hasProAccess, trialDaysLeft, isTrialExpired } = useSubscription()
  
  const [showFAQ, setShowFAQ] = useState(false)
  const [openFAQ, setOpenFAQ] = useState(null)
  const [showYearlyPricing, setShowYearlyPricing] = useState(false)

  useEffect(() => {
    const status = searchParams.get('subscription')
    const canceled = searchParams.get('canceled')
    
    if (status === 'canceled' || canceled === 'true') {
      // Mostrar mensaje de cancelación
      console.log('Suscripción cancelada por el usuario')
      // Podrías mostrar un toast o banner aquí
    }
  }, [searchParams])

  const handlePlanSelected = (planType) => {
    if (planType === 'free_trial') {
      navigate('/dashboard?welcome=trial')
    } else if (planType === 'pro') {
      navigate('/dashboard?welcome=pro')
    }
  }

  const features = [
    {
      category: "Análisis de Reuniones",
      items: [
        { name: "Detección de caras en tiempo real", free: true, pro: true },
        { name: "Análisis de engagement básico", free: true, pro: true },
        { name: "Métricas de atención", free: true, pro: true },
        { name: "Análisis de emociones avanzado", free: false, pro: true },
        { name: "Detección de distracciones", free: false, pro: true },
        { name: "Análisis de gestos corporales", free: false, pro: true }
      ]
    },
    {
      category: "Límites de Uso",
      items: [
        { name: "Sesiones por mes", free: "10", pro: "Ilimitadas" },
        { name: "Participantes por sesión", free: "5", pro: "Ilimitados" },
        { name: "Duración máxima por sesión", free: "30 min", pro: "Ilimitada" },
        { name: "Almacenamiento de datos", free: "1 GB", pro: "100 GB" }
      ]
    },
    {
      category: "Reportes y Exportación",
      items: [
        { name: "Reportes básicos", free: true, pro: true },
        { name: "Exportación CSV", free: false, pro: true },
        { name: "Reportes ejecutivos", free: false, pro: true },
        { name: "Análisis de tendencias", free: false, pro: true },
        { name: "Dashboard personalizable", free: false, pro: true },
        { name: "Reportes programados", free: false, pro: true }
      ]
    },
    {
      category: "Integraciones",
      items: [
        { name: "Integración con Zoom", free: false, pro: true },
        { name: "Integración con Teams", free: false, pro: true },
        { name: "API REST", free: false, pro: true },
        { name: "Webhooks", free: false, pro: true },
        { name: "Integración con Slack", free: false, pro: true }
      ]
    },
    {
      category: "Soporte",
      items: [
        { name: "Soporte por email", free: true, pro: true },
        { name: "Base de conocimientos", free: true, pro: true },
        { name: "Soporte prioritario", free: false, pro: true },
        { name: "Chat en vivo", free: false, pro: true },
        { name: "Onboarding personalizado", free: false, pro: true },
        { name: "Llamadas de soporte", free: false, pro: true }
      ]
    }
  ]

  const faqs = [
    {
      question: "¿Puedo cancelar mi suscripción en cualquier momento?",
      answer: "Sí, puedes cancelar tu suscripción en cualquier momento desde tu dashboard. Mantendrás acceso a todas las funcionalidades hasta el final de tu período de facturación actual. No hay penalizaciones por cancelación."
    },
    {
      question: "¿Qué incluye exactamente la prueba gratuita?",
      answer: "La prueba gratuita de 7 días incluye acceso completo a todas las funcionalidades PRO sin restricciones. Puedes analizar hasta 10 reuniones, con todos los participantes que necesites, y acceder a reportes avanzados. No se requiere tarjeta de crédito para comenzar."
    },
    {
      question: "¿Cómo funciona el análisis de engagement?",
      answer: "Nuestro sistema utiliza IA avanzada para analizar expresiones faciales, movimientos oculares, postura corporal y patrones de atención. Procesamos estos datos en tiempo real para generar métricas de engagement precisas y accionables."
    },
    {
      question: "¿Los datos están seguros y son privados?",
      answer: "Absolutamente. Cumplimos con GDPR y otras regulaciones de privacidad. No almacenamos grabaciones de video, solo procesamos datos de análisis. Todos los datos se cifran en tránsito y en reposo. Tienes control total sobre tus datos."
    },
    {
      question: "¿Ofrecen descuentos para equipos grandes?",
      answer: "Sí, ofrecemos descuentos especiales para equipos de más de 10 usuarios. También tenemos planes empresariales con funcionalidades adicionales. Contacta con nuestro equipo de ventas para obtener una propuesta personalizada."
    },
    {
      question: "¿Qué pasa si necesito más participantes o sesiones?",
      answer: "El plan PRO incluye sesiones y participantes ilimitados. Si estás en el trial y necesitas más, puedes actualizar a PRO en cualquier momento. Para necesidades empresariales especiales, ofrecemos planes personalizados."
    },
    {
      question: "¿Funciona con todas las plataformas de videoconferencia?",
      answer: "Meetraq funciona con cualquier aplicación que use tu cámara web, incluyendo Zoom, Teams, Google Meet, y muchas más. También puedes usarlo para analizar reuniones presenciales."
    },
    {
      question: "¿Hay algún compromiso de permanencia?",
      answer: "No, no hay compromiso de permanencia. Puedes cancelar tu suscripción mensual en cualquier momento. Si eliges el plan anual, obtienes descuento pero también puedes cancelar cuando quieras."
    }
  ]

  const testimonials = [
    {
      name: "María García",
      role: "CEO, TechStart",
      content: "Meetraq ha transformado la forma en que conducimos nuestras reuniones. Ahora sabemos exactamente cuándo nuestro equipo está más comprometido.",
      rating: 5
    },
    {
      name: "Carlos Rodríguez",
      role: "Director de RRHH, InnovateCorp",
      content: "Los insights que obtenemos son invaluables para mejorar la comunicación interna. La prueba gratuita nos convenció inmediatamente.",
      rating: 5
    },
    {
      name: "Ana López",
      role: "Consultora, Strategic Solutions",
      content: "Perfecto para presentaciones con clientes. Me ayuda a ajustar mi mensaje en tiempo real según el engagement del público.",
      rating: 5
    }
  ]

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const FeatureIcon = ({ available, value }) => {
    if (typeof available === 'boolean') {
      return available ? (
        <CheckIcon className="h-5 w-5 text-green-500" />
      ) : (
        <XMarkIcon className="h-5 w-5 text-red-500" />
      )
    }
    return <span className="text-sm font-medium text-gray-900">{value}</span>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src="/meetraq.png" alt="Meetraq" className="h-8 w-auto" />
              {user && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Volver al Dashboard
                </button>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {user.email}
                  </span>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Dashboard
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
              Potencia tus reuniones
              <span className="text-blue-600"> con IA</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Meetraq te ayuda a obtener insights valiosos de cada reunión con análisis 
              avanzado de engagement, detección de emociones y reportes detallados.
            </p>
            
            {/* Trust indicators */}
            <div className="mt-8 flex justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-2" />
                <span>Seguro y privado</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span>7 días gratis</span>
              </div>
              <div className="flex items-center">
                <CreditCardIcon className="h-5 w-5 text-purple-500 mr-2" />
                <span>Sin permanencia</span>
              </div>
              <div className="flex items-center">
                <GlobeAltIcon className="h-5 w-5 text-orange-500 mr-2" />
                <span>Funciona con cualquier app</span>
              </div>
            </div>

            {/* Current subscription status */}
            {user && subscription && (
              <div className="mt-8 inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border">
                <div className="flex items-center space-x-2">
                  {subscription.plan_type === 'pro' && subscription.status === 'active' ? (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">
                        Suscripción PRO activa
                      </span>
                    </>
                  ) : subscription.plan_type === 'free_trial' && !isTrialExpired ? (
                    <>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-sm font-medium text-yellow-800">
                        Trial: {trialDaysLeft} días restantes
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-sm font-medium text-red-800">
                        Plan expirado
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Toggle */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setShowYearlyPricing(false)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  !showYearlyPricing
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => setShowYearlyPricing(true)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  showYearlyPricing
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Anual
                <span className="ml-1 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-12 bg-white">
        <SubscriptionPlans onSelectPlan={handlePlanSelected} />
      </section>

      {/* Detailed Feature Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comparación detallada de funcionalidades
            </h2>
            <p className="text-xl text-gray-600">
              Descubre qué incluye cada plan
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {/* Header */}
              <div className="bg-gray-50 p-6 lg:col-span-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="text-center lg:text-left">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Funcionalidad
                    </h3>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Prueba Gratuita
                    </h3>
                    <p className="text-sm text-gray-600">7 días gratis</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Meetraq PRO
                    </h3>
                    <p className="text-sm text-gray-600">
                      {showYearlyPricing ? '€10.39/mes' : '€12.99/mes'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              {features.map((category, categoryIndex) => (
                <div key={categoryIndex} className="lg:col-span-3">
                  <div className="bg-gray-100 px-6 py-3">
                    <h4 className="font-semibold text-gray-900">{category.category}</h4>
                  </div>
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-b border-gray-200 last:border-b-0">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900">{item.name}</span>
                        </div>
                        <div className="flex items-center justify-center lg:justify-center">
                          <FeatureIcon 
                            available={item.free} 
                            value={typeof item.free === 'string' ? item.free : null}
                          />
                        </div>
                        <div className="flex items-center justify-center lg:justify-center">
                          <FeatureIcon 
                            available={item.pro} 
                            value={typeof item.pro === 'string' ? item.pro : null}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-xl text-gray-600">
              Más de 1,000+ equipos confían en Meetraq
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Preguntas frecuentes
            </h2>
            <p className="text-xl text-gray-600">
              Resolvemos tus dudas más comunes
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              ¿No encuentras la respuesta que buscas?
            </p>
            <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
              <QuestionMarkCircleIcon className="h-5 w-5 mr-2" />
              Contacta con soporte
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para transformar tus reuniones?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Comienza tu prueba gratuita hoy mismo y descubre el poder del análisis de engagement
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Comenzar prueba gratuita
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Ver demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="/meetraq.png" alt="Meetraq" className="h-8 w-auto" />
              </div>
              <p className="text-gray-400">
                Análisis de reuniones con IA para equipos modernos
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Características</a></li>
                <li><a href="#" className="hover:text-white">Precios</a></li>
                <li><a href="#" className="hover:text-white">Integraciones</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Acerca de</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Carreras</a></li>
                <li><a href="#" className="hover:text-white">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Centro de ayuda</a></li>
                <li><a href="#" className="hover:text-white">Documentación</a></li>
                <li><a href="#" className="hover:text-white">Estado del servicio</a></li>
                <li><a href="#" className="hover:text-white">Términos y privacidad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 Meetraq. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PricingPage