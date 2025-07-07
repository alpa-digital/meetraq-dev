import { useState, useRef, useEffect } from 'react'

const useVideoCapture = (externalVideoRef) => {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState(null)
  const [streamType, setStreamType] = useState('') // 'screen' or 'camera'
  
  // Usar la referencia externa si se proporciona, sino crear una propia
  const videoRef = externalVideoRef || useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [])

  const startScreenShare = async () => {
    try {
      setError(null)
      console.log('📺 useVideoCapture: Starting screen share...')
      
      // Detener stream anterior si existe
      if (streamRef.current) {
        stopStream()
      }

      // Solicitar captura de pantalla/ventana
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: true // Incluir audio para meetings
      })
      
      console.log('📺 useVideoCapture: Stream obtained, assigning to video element...')
      
      // Asignar stream al video element
      if (videoRef.current) {
        console.log('✅ useVideoCapture: Video element found, assigning stream...')
        videoRef.current.srcObject = stream
        
        // Forzar reproducción
        try {
          await videoRef.current.play()
          console.log('▶️ useVideoCapture: Video playing successfully')
        } catch (playError) {
          console.warn('⚠️ useVideoCapture: Play failed:', playError)
          // Continuar de todas formas, puede reproducirse automáticamente
        }
      } else {
        console.warn('⚠️ useVideoCapture: videoRef.current is null - video element not ready')
        // No lanzar error, el stream se puede asignar más tarde
      }
      
      streamRef.current = stream
      setIsStreaming(true)
      setStreamType('screen')
      
      // Detectar cuando el usuario para el screen share
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        console.log('🛑 useVideoCapture: Screen share ended by user')
        stopStream()
      })
      
      console.log('✅ useVideoCapture: Screen sharing started successfully')
      
      // Log información del stream
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        const settings = videoTrack.getSettings()
        console.log('📊 useVideoCapture: Video track settings:', settings)
      }
      
      return stream
    } catch (err) {
      console.error('❌ useVideoCapture: Error starting screen share:', err)
      setError('Could not start screen sharing. Please allow screen capture permissions.')
      setIsStreaming(false)
      throw err
    }
  }

  const startCameraStream = async () => {
    try {
      setError(null)
      console.log('📷 useVideoCapture: Starting camera stream...')
      
      // Detener stream anterior si existe
      if (streamRef.current) {
        stopStream()
      }

      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: false
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      console.log('📷 useVideoCapture: Camera stream obtained, assigning to video element...')
      
      if (videoRef.current) {
        console.log('✅ useVideoCapture: Video element found, assigning camera stream...')
        videoRef.current.srcObject = stream
        
        try {
          await videoRef.current.play()
          console.log('▶️ useVideoCapture: Camera video playing successfully')
        } catch (playError) {
          console.warn('⚠️ useVideoCapture: Camera play failed:', playError)
        }
      } else {
        console.warn('⚠️ useVideoCapture: videoRef.current is null - camera stream will be assigned later')
      }
      
      streamRef.current = stream
      setIsStreaming(true)
      setStreamType('camera')
      
      console.log('✅ useVideoCapture: Camera stream started successfully')
      return stream
    } catch (err) {
      console.error('❌ useVideoCapture: Error starting camera stream:', err)
      setError('Could not start camera. Please check permissions.')
      setIsStreaming(false)
      throw err
    }
  }

  const stopStream = () => {
    console.log('🛑 useVideoCapture: Stopping stream...')
    
    if (streamRef.current) {
      // Detener todas las pistas del stream
      streamRef.current.getTracks().forEach(track => {
        track.stop()
        console.log(`🛑 useVideoCapture: Stopped track: ${track.kind}`)
      })
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
      console.log('🧹 useVideoCapture: Cleared video srcObject')
    }

    setIsStreaming(false)
    setStreamType('')
    setError(null)
    
    console.log('✅ useVideoCapture: Stream stopped successfully')
  }

  // Función para asignar el stream a un video element después de crearlo
  const assignStreamToVideo = () => {
    if (streamRef.current && videoRef.current && !videoRef.current.srcObject) {
      console.log('🔄 useVideoCapture: Assigning existing stream to video element...')
      videoRef.current.srcObject = streamRef.current
      
      videoRef.current.play().catch(error => {
        console.warn('⚠️ useVideoCapture: Error playing video after assignment:', error)
      })
      
      return true
    }
    return false
  }

  // Función para obtener información del stream actual
  const getStreamInfo = () => {
    if (!streamRef.current) return null
    
    const videoTrack = streamRef.current.getVideoTracks()[0]
    if (!videoTrack) return null
    
    return {
      settings: videoTrack.getSettings(),
      capabilities: videoTrack.getCapabilities(),
      readyState: videoRef.current?.readyState || 0,
      dimensions: {
        width: videoRef.current?.videoWidth || 0,
        height: videoRef.current?.videoHeight || 0
      }
    }
  }

  // Debug function
  const debugVideoState = () => {
    console.log('🔧 useVideoCapture Debug Info:')
    console.log('  - isStreaming:', isStreaming)
    console.log('  - streamType:', streamType)
    console.log('  - error:', error)
    console.log('  - videoRef.current:', !!videoRef.current)
    console.log('  - streamRef.current:', !!streamRef.current)
    
    if (videoRef.current) {
      console.log('  - video readyState:', videoRef.current.readyState)
      console.log('  - video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight)
      console.log('  - video srcObject:', !!videoRef.current.srcObject)
      console.log('  - video currentTime:', videoRef.current.currentTime)
      console.log('  - video paused:', videoRef.current.paused)
    }
    
    if (streamRef.current) {
      console.log('  - stream tracks:', streamRef.current.getTracks().length)
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        console.log('  - video track state:', videoTrack.readyState)
        console.log('  - video track settings:', videoTrack.getSettings())
      }
    }
  }

  // Effect para asignar stream cuando el video element esté disponible
  useEffect(() => {
    if (isStreaming && streamRef.current && videoRef.current && !videoRef.current.srcObject) {
      console.log('🔄 useVideoCapture: Auto-assigning stream to newly available video element')
      assignStreamToVideo()
    }
  }, [isStreaming, videoRef.current])

  return {
    // Estado
    isStreaming,
    error,
    streamType,
    
    // Funciones principales
    startScreenShare,
    startCameraStream,
    stopStream,
    
    // Utilidades
    assignStreamToVideo,
    getStreamInfo,
    debugVideoState,
    
    // Referencias (para compatibilidad)
    currentStream: streamRef.current
  }
}

export default useVideoCapture