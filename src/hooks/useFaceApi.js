import { useState, useEffect, useRef } from 'react'
import MediaPipeFaceMesh from '../utils/MediaPipeFaceMesh'

const useFaceAPI = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const faceMeshRef = useRef(null)
  const initializationAttempts = useRef(0)
  const maxInitializationAttempts = 3

  useEffect(() => {
    initializeDetection()
    
    return () => {
      if (faceMeshRef.current) {
        try {
          faceMeshRef.current.cleanup()
        } catch (error) {
          console.error('❌ Error in cleanup:', error)
        }
        faceMeshRef.current = null
      }
    }
  }, [])

  const initializeDetection = async () => {
    if (initializationAttempts.current >= maxInitializationAttempts) {
      setError('Failed to initialize MediaPipe Face Mesh after multiple attempts. Check your internet connection.')
      return
    }

    setIsLoading(true)
    setError(null)
    initializationAttempts.current++

    try {
      console.log(`🚀 Initializing MediaPipe Face Mesh (attempt ${initializationAttempts.current})...`)
      
      // Crear nueva instancia del sistema MediaPipe Face Mesh
      faceMeshRef.current = new MediaPipeFaceMesh()
      
      // Inicializar MediaPipe Face Mesh (esto carga los scripts y modelos)
      const result = await faceMeshRef.current.initialize()
      
      if (result && result.isReady) {
        setIsLoaded(true)
        setError(null)
        console.log('✅ MediaPipe Face Mesh System ready:', result.engine)
        
        // Test simple después de que MediaPipe esté listo
        setTimeout(() => {
          testDetectionSystem()
        }, 2000)
        
      } else {
        throw new Error('MediaPipe Face Mesh initialization returned invalid result')
      }
      
    } catch (error) {
      console.error(`❌ MediaPipe Face Mesh initialization attempt ${initializationAttempts.current} failed:`, error)
      
      let errorMessage = `MediaPipe Face Mesh Error (attempt ${initializationAttempts.current}): ${error.message}`
      
      // Mensajes de error específicos
      if (error.message.includes('Failed to load')) {
        errorMessage = 'Cannot load MediaPipe Face Mesh. Check your internet connection.'
      } else if (error.message.includes('FaceMesh')) {
        errorMessage = 'MediaPipe Face Mesh not available. Browser may not support it.'
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error loading MediaPipe Face Mesh. Try refreshing the page.'
      }
      
      setError(errorMessage)
      
      // Retry después de un delay si no hemos alcanzado el máximo
      if (initializationAttempts.current < maxInitializationAttempts) {
        console.log(`⏰ Retrying MediaPipe Face Mesh initialization in 3 seconds...`)
        setTimeout(() => {
          initializeDetection()
        }, 3000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const reloadFaceAPI = () => {
    console.log('🔄 Reloading MediaPipe Face Mesh System...')
    
    // Reset state
    setIsLoaded(false)
    setIsLoading(false)
    setError(null)
    initializationAttempts.current = 0
    
    // Cleanup existing instance
    if (faceMeshRef.current) {
      try {
        faceMeshRef.current.cleanup()
      } catch (error) {
        console.warn('⚠️ Error during cleanup:', error)
      }
      faceMeshRef.current = null
    }
    
    // Reinitialize
    setTimeout(() => {
      initializeDetection()
    }, 1000)
  }

  const testDetectionSystem = async () => {
    if (!faceMeshRef.current) {
      console.log('⚠️ Cannot test - MediaPipe Face Mesh not ready')
      return
    }

    try {
      console.log('🧪 Testing MediaPipe Face Mesh detection system...')
      
      // Crear un canvas de prueba
      const testCanvas = document.createElement('canvas')
      testCanvas.width = 640
      testCanvas.height = 480
      const testCtx = testCanvas.getContext('2d')
      
      // Fondo neutro
      testCtx.fillStyle = '#f0f0f0'
      testCtx.fillRect(0, 0, testCanvas.width, testCanvas.height)
      
      // Simular un rostro simple (círculo)
      testCtx.fillStyle = '#ffdbac'
      testCtx.beginPath()
      testCtx.arc(320, 200, 80, 0, 2 * Math.PI)
      testCtx.fill()
      
      // Simular ojos
      testCtx.fillStyle = '#000'
      testCtx.beginPath()
      testCtx.arc(300, 180, 8, 0, 2 * Math.PI)
      testCtx.arc(340, 180, 8, 0, 2 * Math.PI)
      testCtx.fill()
      
      console.log('✅ MediaPipe Face Mesh test completed successfully')
      
    } catch (testError) {
      console.warn('⚠️ MediaPipe Face Mesh detection system test failed:', testError)
    }
  }

  const detectFaces = async (videoElement) => {
    // Verificaciones básicas
    if (!isLoaded) {
      console.log('🚫 Detection skipped - MediaPipe Face Mesh not loaded')
      return []
    }
    
    if (!faceMeshRef.current) {
      console.log('🚫 Detection skipped - no MediaPipe Face Mesh instance')
      return []
    }
    
    if (!videoElement) {
      console.log('🚫 Detection skipped - no video element')
      return []
    }

    if (videoElement.readyState !== 4) {
      console.log('⏳ Video not ready for detection, readyState:', videoElement.readyState)
      return []
    }

    if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      console.log('⚠️ Video has invalid dimensions:', videoElement.videoWidth, 'x', videoElement.videoHeight)
      return []
    }

    try {
      console.log('🔍 Starting MediaPipe Face Mesh detection...')

      // Extraer frame del video
      const frameData = faceMeshRef.current.extractFrameData(videoElement)
      if (!frameData) {
        console.log('❌ Failed to extract frame data from video')
        return []
      }

      console.log(`📊 Frame extracted: ${frameData.width}x${frameData.height} (original: ${frameData.originalWidth}x${frameData.originalHeight})`)

      // Detectar caras con MediaPipe Face Mesh
      const detections = await faceMeshRef.current.detectFaces(frameData)
      
      if (detections && detections.length > 0) {
        console.log(`🎯 MediaPipe Face Mesh detection successful: ${detections.length} faces found`)
        detections.forEach((face, i) => {
          const headPose = face.headPose || {}
          const gazeDir = face.gazeDirection || {}
          console.log(`  Face ${i+1}: confidence=${face.confidence.toFixed(2)}, box=${face.box.x},${face.box.y} ${face.box.width}x${face.box.height}`)
          console.log(`    Head Pose: yaw=${headPose.yaw?.toFixed(1)}°, pitch=${headPose.pitch?.toFixed(1)}°, roll=${headPose.roll?.toFixed(1)}°`)
          console.log(`    Gaze: ${gazeDir.direction}, score=${gazeDir.gazeScore?.toFixed(2)}, looking away=${gazeDir.isLookingAway}`)
        })
      } else {
        console.log('ℹ️ No faces detected in current frame')
      }

      return detections || []

    } catch (error) {
      console.error('❌ MediaPipe Face Mesh detection error:', error)
      
      // Si hay error en la detección, intentar reinicializar
      if (error.message.includes('detection') && initializationAttempts.current < maxInitializationAttempts) {
        console.log('🔄 Detection error, attempting to reinitialize MediaPipe Face Mesh...')
        setTimeout(() => {
          reloadFaceAPI()
        }, 1000)
      }
      
      return []
    }
  }

  const getDetectionStats = () => {
    if (!faceMeshRef.current) return null
    return faceMeshRef.current.getStats()
  }

  const getCurrentDetections = () => {
    if (!faceMeshRef.current) return []
    return faceMeshRef.current.getLastDetections()
  }

  const getHeadPoseData = () => {
    if (!faceMeshRef.current) return []
    const detections = faceMeshRef.current.getLastDetections()
    return detections.map(detection => ({
      id: detection.id,
      headPose: detection.headPose,
      gazeDirection: detection.gazeDirection,
      eyeState: detection.eyeState
    }))
  }

  const getGazeAnalysis = () => {
    if (!faceMeshRef.current) return null
    const detections = faceMeshRef.current.getLastDetections()
    
    if (detections.length === 0) return null
    
    const totalFaces = detections.length
    const lookingAway = detections.filter(d => d.gazeDirection?.isLookingAway).length
    const averageGazeScore = detections.reduce((sum, d) => sum + (d.gazeDirection?.gazeScore || 0), 0) / totalFaces
    
    return {
      totalFaces,
      facesLookingAway: lookingAway,
      facesLookingAtScreen: totalFaces - lookingAway,
      averageGazeScore,
      engagementLevel: averageGazeScore > 0.7 ? 'high' : averageGazeScore > 0.4 ? 'medium' : 'low'
    }
  }

  return {
    // Estado del sistema
    isLoaded: isLoaded,
    isLoading: isLoading,
    error: error,
    
    // Funciones principales
    detectFaces,
    reloadFaceAPI,
    
    // Utilidades
    getDetectionStats,
    getCurrentDetections,
    
    // Nuevas funciones específicas de Face Mesh
    getHeadPoseData,
    getGazeAnalysis,
    
    // Información del motor
    engineType: 'mediapipe-facemesh',
    isReady: isLoaded && !error,
    
    // Capacidades
    capabilities: {
      faceDetection: true,
      headPoseEstimation: true,
      gazeTracking: true,
      eyeStateDetection: true,
      facialLandmarks: true
    },
    
    // Debug
    testDetectionSystem: process.env.NODE_ENV === 'development' ? testDetectionSystem : null
  }
}

// Export como named export para mantener compatibilidad
export { useFaceAPI }

// También export como default
export default useFaceAPI