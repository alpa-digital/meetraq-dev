// pages/LandingPage.jsx - Código Completo Final
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import AuthModal from '../components/AuthModal'
import { 
  Play, 
  BarChart3, 
  Users, 
  Brain, 
  Shield, 
  Zap,
  Check,
  ArrowRight,
  Star,
  Clock,
  CreditCard,
  CheckCircle,
  Sparkles
} from 'lucide-react'

const LandingPage = () => {
  const { user } = useAuth()
  const { startFreeTrial, createProCheckout, loading } = useSubscription()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('signin')

  const openAuthModal = (mode = 'signin') => {
    setAuthModalMode(mode)
    setShowAuthModal(true)
  }

  const handleStartTrial = async () => {
    if (!user) {
      openAuthModal('signup')
      return
    }
    
    try {
      const result = await startFreeTrial()
      if (result.success) {
        window.location.href = '/dashboard?welcome=trial'
      } else {
        alert('Error starting trial: ' + result.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error starting trial')
    }
  }

  const handleUpgradeToPro = async () => {
    if (!user) {
      openAuthModal('signup')
      return
    }
    
    try {
      await createProCheckout()
    } catch (error) {
      console.error('Error:', error)
      alert('Error processing payment')
    }
  }

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced facial recognition and emotion detection for real-time engagement insights.',
      highlight: 'AI Driven'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Monitor attention, engagement, and fatigue with live dashboard updates.',
      highlight: 'Live Data'
    },
    {
      icon: Users,
      title: 'Multi-Participant Tracking',
      description: 'Analyze multiple participants simultaneously with individual metrics.',
      highlight: 'Multi-User'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All analysis happens locally. Your data stays secure and private.',
      highlight: 'Secure'
    },
    {
      icon: Zap,
      title: 'Instant Alerts',
      description: 'Get notified when engagement drops or attention levels change.',
      highlight: 'Smart'
    },
    {
      icon: BarChart3,
      title: 'Detailed Reports',
      description: 'Export comprehensive analytics and historical data for deep insights.',
      highlight: 'Exportable'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'TechCorp',
      content: 'Meetraq transformed our team meetings. We can now see exactly when engagement drops and adjust accordingly.',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'HR Director',
      company: 'InnovateCo',
      content: 'The fatigue detection feature has been invaluable for our remote team wellness initiatives.',
      rating: 5
    },
    {
      name: 'Emily Johnson',
      role: 'Training Coordinator',
      company: 'EduTech',
      content: 'Our training sessions are now more effective thanks to real-time engagement feedback.',
      rating: 5
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Meetings Analyzed' },
    { number: '500+', label: 'Active Teams' },
    { number: '94%', label: 'Engagement Improvement' },
    { number: '4.9/5', label: 'Average Rating' }
  ]

  const pricingPlans = [
    {
      name: 'Free Trial',
      price: 'Free',
      duration: '7 days',
      description: 'Perfect for discovering Meetraq',
      features: [
        'Up to 10 meetings',
        'Complete engagement analysis',
        'Detailed reports',
        'All PRO features included'
      ],
      cta: 'Start Free Trial',
      popular: false,
      onClick: handleStartTrial
    },
    {
      name: 'Meetraq PRO',
      price: '$12.99',
      duration: '/month',
      description: 'For teams seeking maximum performance',
      features: [
        'Unlimited meetings',
        'Unlimited participants',
        'Advanced emotion AI',
        'Premium integrations',
        'Priority support',
        'Data export',
        'API access'
      ],
      cta: 'Subscribe to PRO',
      popular: true,
      onClick: handleUpgradeToPro
    }
  ]

  const comparisonFeatures = [
    { name: 'Monthly meetings', free: '10', pro: 'Unlimited' },
    { name: 'Participants', free: '5', pro: 'Unlimited' },
    { name: 'Basic analysis', free: true, pro: true },
    { name: 'Emotion analysis', free: false, pro: true },
    { name: 'Data export', free: false, pro: true },
    { name: 'Integrations', free: false, pro: true },
    { name: 'Priority support', free: false, pro: true }
  ]

  return (
    <div className="min-h-screen bg-white font-['Space_Grotesk',sans-serif]">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/meetraq.png" alt="Meetraq" className="h-8 w-auto" />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Features
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Pricing
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Testimonials
              </a>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <a
                  href="/dashboard"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Dashboard
                </a>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('signin')}
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Meeting Analytics
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Make your meetings
              <span className="text-blue-600"> smarter</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get valuable insights about your team's engagement with real-time AI-powered analysis. 
              Improve productivity and participation in every meeting.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={handleStartTrial}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Free 7-Day Trial
                  </>
                )}
              </button>
              
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2">
                <Users className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-green-500 mr-1" />
                <span>Privacy guaranteed</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-blue-500 mr-1" />
                <span>7 days free</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="w-4 h-4 text-purple-500 mr-1" />
                <span>No commitment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced Features
            </h2>
            <p className="text-xl text-gray-600">
              AI technology to analyze and improve your meetings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {feature.highlight}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade when you're ready. No commitments, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-2xl p-8 ${
                plan.popular 
                  ? 'border-2 border-blue-500 shadow-xl' 
                  : 'border border-gray-200 shadow-sm'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.duration && (
                      <span className="text-gray-600 ml-2">{plan.duration}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={plan.onClick}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {loading ? 'Processing...' : plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Feature Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold">Feature</th>
                    <th className="text-center py-4 px-6 font-semibold">Free Trial</th>
                    <th className="text-center py-4 px-6 font-semibold">PRO</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 px-6 font-medium text-gray-900">{feature.name}</td>
                      <td className="py-4 px-6 text-center">
                        {typeof feature.free === 'boolean' ? (
                          feature.free ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-400">✕</span>
                          )
                        ) : (
                          <span className="text-gray-700">{feature.free}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof feature.pro === 'boolean' ? (
                          feature.pro ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-400">✕</span>
                          )
                        ) : (
                          <span className="text-gray-700">{feature.pro}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What our users say
            </h2>
            <p className="text-xl text-gray-600">
              Over 500 teams already trust Meetraq to improve their meetings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to revolutionize your meetings?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teams already using Meetraq to make their meetings more productive
          </p>
          <button
            onClick={handleStartTrial}
            disabled={loading}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            ) : (
              <>
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img 
                src="/meetraq.png" 
                alt="Meetraq" 
                className="h-8 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-gray-400">
                AI-powered meeting analytics for better team engagement and productivity.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Meetraq. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultMode={authModalMode}
        />
      )}
    </div>
  )
}

export default LandingPage