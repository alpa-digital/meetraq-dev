import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { RefreshCw, AlertTriangle, LogOut } from 'lucide-react'

const Loading = ({ 
  title = "Loading Meetraq", 
  description = "Initializing AI components...",
  fullScreen = true 
}) => {
  const { signOut } = useAuth()
  const [showEmergencyOptions, setShowEmergencyOptions] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  // Pasos de carga con duraciones moderadas
  const loadingSteps = [
    { name: "Connecting to servers...", duration: 1500 },
    { name: "Authenticating user...", duration: 2000 },
    { name: "Loading user profile...", duration: 1200 },
    { name: "Initializing AI components...", duration: 2500 },
    { name: "Setting up dashboard...", duration: 1300 },
    { name: "Almost ready...", duration: 800 }
  ]

  // Manejo del progreso y pasos
  useEffect(() => {
    let stepTimer
    let progressTimer
    let timeTimer
    
    // Timer para contar segundos transcurridos
    timeTimer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    // Timer para mostrar opciones de emergencia
    const emergencyTimer = setTimeout(() => {
      setShowEmergencyOptions(true)
    }, 15000) // 15 segundos

    // Función para simular progreso de carga
    const simulateProgress = () => {
      let totalDuration = 0
      let currentStepIndex = 0
      
      const runStep = () => {
        if (currentStepIndex < loadingSteps.length) {
          const step = loadingSteps[currentStepIndex]
          setCurrentStep(currentStepIndex)
          
          // Progreso dentro del paso actual
          const stepProgress = (currentStepIndex / loadingSteps.length) * 100
          let internalProgress = 0
          
          const stepProgressTimer = setInterval(() => {
            internalProgress += 3 // Velocidad moderada
            const currentProgress = stepProgress + (internalProgress / 100) * (100 / loadingSteps.length)
            setProgress(Math.min(currentProgress, (currentStepIndex + 1) * (100 / loadingSteps.length)))
            
            if (internalProgress >= 100) {
              clearInterval(stepProgressTimer)
              currentStepIndex++
              if (currentStepIndex < loadingSteps.length) {
                setTimeout(runStep, 200) // Pausa moderada entre pasos
              } else {
                // Si llegamos al final, reiniciar el ciclo
                setTimeout(() => {
                  currentStepIndex = 0
                  setProgress(0)
                  runStep()
                }, 800) // Reinicio moderado
              }
            }
          }, step.duration / 35) // Frames moderados
        }
      }
      
      runStep()
    }

    simulateProgress()

    return () => {
      clearInterval(timeTimer)
      clearTimeout(emergencyTimer)
      clearTimeout(stepTimer)
      clearInterval(progressTimer)
    }
  }, [])

  const handleForceLogout = async () => {
    try {
      console.log('🚨 Emergency logout triggered')
      // Limpiar localStorage/sessionStorage si existe
      localStorage.clear()
      sessionStorage.clear()
      
      // Forzar logout
      await signOut()
      
      // Reload completo de la página como último recurso
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Error in emergency logout:', error)
      // Si todo falla, forzar reload
      window.location.reload()
    }
  }

  const handleForceRefresh = () => {
    console.log('🔄 Force refresh triggered')
    window.location.reload()
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
        <div className="text-center text-white p-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 max-w-md mx-4">
          <div className="relative mb-6">
            {/* Logo normal sin círculo */}
            <div className="flex items-center justify-center mx-auto mb-4">
              <img 
                src="/meetraq.png" 
                alt="Meetraq" 
                className="h-8 w-auto opacity-90 animate-pulse"
              />
            </div>
            </div>
          
          <h2 className="text-xl font-semibold mb-2 font-display">Initializing System</h2>
          
          {/* Paso actual */}
          <p className="text-sm opacity-80 mb-4">
            {loadingSteps[currentStep]?.name || description}
          </p>
          
          {/* Barra de progreso */}
          <div className="w-full bg-white/10 rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary-400 to-primary-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="w-full h-full bg-white/20 animate-pulse"></div>
            </div>
          </div>
          
          {/* Porcentaje y tiempo */}
          <div className="flex justify-between text-xs opacity-60 mb-4">
            <span>{Math.round(progress)}% complete</span>
            <span>{timeElapsed}s elapsed</span>
          </div>
          
          {/* Opciones de emergencia */}
          {showEmergencyOptions && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-300 mb-3">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Loading taking too long?</span>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleForceRefresh}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Page
                </button>
                
                <button
                  onClick={handleForceLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Force Logout
                </button>
              </div>
              
              <p className="text-xs text-red-300/80 mt-2">
                These options will help if the app is stuck loading
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}

export default Loading