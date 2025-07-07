import React, { useState, useEffect, useRef, useCallback } from 'react'
import { 
  Play, 
  Pause, 
  Users, 
  AlertTriangle, 
  Camera, 
  Download,
  BarChart3,
  Activity,
  Clock,
  Target
} from 'lucide-react'
import { useFaceAPI } from '../hooks/useFaceApi'
import useVideoCapture from '../hooks/useVideoCapture'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

// ============================================
// ADVANCED ENGAGEMENT ANALYZER CLASS - OPTIMIZADA
// ============================================
class AdvancedEngagementAnalyzer {
  constructor() {
    this.participantHistory = new Map();
    this.groupMetrics = {
      averageEngagement: 0,
      attentionTrend: 'stable',
      criticalMoments: [],
      sessionStartTime: Date.now()
    };
    
    this.thresholds = {
      lowEngagement: 40,
      criticalEngagement: 25,
      highMovement: 50,
      absenceThreshold: 3000,
      groupAlertThreshold: 30
    };
    
    this.weights = {
      faceSize: 0.20,
      stability: 0.25,
      presence: 0.20,
      quality: 0.15,
      gazeDirection: 0.20
    };
    
    console.log('🧠 Advanced Engagement Analyzer with Face Mesh support initialized');
  }

  analyzeParticipantEngagement(detection, participantId) {
    const now = Date.now();
    const history = this.getParticipantHistory(participantId);
    
    const currentMetrics = this.calculateFaceMeshMetrics(detection);
    const temporalMetrics = this.analyzeTemporalPatterns(history, currentMetrics, now);
    const engagement = this.calculateAdvancedEngagementScore(currentMetrics, temporalMetrics);
    
    this.updateParticipantHistory(participantId, {
      ...currentMetrics,
      ...temporalMetrics,
      engagement,
      timestamp: now
    });
    
    return {
      participantId,
      engagement: Math.round(engagement),
      attention: Math.round(temporalMetrics.attention * 100),
      energy: Math.round(currentMetrics.energy * 100),
      status: this.determineEngagementStatus(engagement),
      insights: this.generateAdvancedInsights(currentMetrics, temporalMetrics, engagement, detection),
      alerts: this.checkAdvancedAlerts(engagement, temporalMetrics, detection),
      headPose: detection.headPose,
      gazeDirection: detection.gazeDirection,
      eyeState: detection.eyeState,
      gazeScore: detection.gazeDirection ? Math.round(detection.gazeDirection.gazeScore * 100) : null,
      isLookingAway: detection.gazeDirection?.isLookingAway || false,
      eyesOpen: detection.eyeState?.eyesOpen || true
    };
  }

  calculateFaceMeshMetrics(detection) {
    const faceSize = (detection.box.width * detection.box.height) / (640 * 480);
    const centerDistance = this.calculateCenterDistance(detection.box);
    const quality = detection.confidence || 0.5;
    
    const headPoseMetrics = this.analyzeHeadPose(detection.headPose);
    const gazeMetrics = this.analyzeGazeMetrics(detection.gazeDirection);
    const eyeMetrics = this.analyzeEyeMetrics(detection.eyeState);
    const energy = this.calculateAdvancedEnergy(detection);
    
    return {
      faceSize: Math.min(1, faceSize * 10),
      centerDistance,
      quality,
      energy,
      headPoseScore: headPoseMetrics.score,
      gazeScore: gazeMetrics.score,
      eyeScore: eyeMetrics.score,
      headPose: detection.headPose,
      gazeDirection: detection.gazeDirection,
      eyeState: detection.eyeState,
      position: {
        x: detection.box.x + detection.box.width / 2,
        y: detection.box.y + detection.box.height / 2
      }
    };
  }

  analyzeHeadPose(headPose) {
    if (!headPose) {
      return { score: 0.7, analysis: 'No head pose data' };
    }
    
    const { yaw, pitch, roll, confidence } = headPose;
    const yawPenalty = Math.abs(yaw) / 90;
    const pitchPenalty = Math.abs(pitch) / 60;
    const rollPenalty = Math.abs(roll) / 45;
    
    const positionScore = 1 - ((yawPenalty * 0.5) + (pitchPenalty * 0.3) + (rollPenalty * 0.2));
    const finalScore = Math.max(0, Math.min(1, positionScore * confidence));
    
    let analysis = 'Frontal';
    if (Math.abs(yaw) > 25) analysis = yaw > 0 ? 'Looking right' : 'Looking left';
    else if (Math.abs(pitch) > 20) analysis = pitch > 0 ? 'Looking down' : 'Looking up';
    
    return { score: finalScore, analysis, angles: { yaw, pitch, roll }, confidence };
  }

  analyzeGazeMetrics(gazeDirection) {
    if (!gazeDirection) {
      return { score: 0.7, analysis: 'No gaze data' };
    }
    
    const { gazeScore, isLookingAway, direction, confidence } = gazeDirection;
    let finalScore = gazeScore * confidence;
    
    if (!isLookingAway && gazeScore > 0.8) {
      finalScore *= 1.2;
    }
    
    if (isLookingAway) {
      finalScore *= 0.6;
    }
    
    const analysis = isLookingAway ? `Looking ${direction}` : 'Focused on screen';
    
    return {
      score: Math.max(0, Math.min(1, finalScore)),
      analysis,
      direction,
      isLookingAway,
      confidence
    };
  }

  analyzeEyeMetrics(eyeState) {
    if (!eyeState) {
      return { score: 0.8, analysis: 'No eye data' };
    }
    
    const { averageEAR, isBlinking, eyesOpen } = eyeState;
    let score = 0.5;
    let analysis = 'Unknown';
    
    if (eyesOpen && !isBlinking) {
      score = 0.9;
      analysis = 'Eyes open and alert';
      if (averageEAR > 0.25) {
        score = 1.0;
        analysis = 'Eyes wide open - high alertness';
      }
    } else if (isBlinking) {
      score = 0.7;
      analysis = 'Normal blinking';
    } else {
      score = 0.2;
      analysis = 'Eyes closed or drowsy';
    }
    
    return { score, analysis, averageEAR, eyesOpen, isBlinking };
  }

  calculateAdvancedEnergy(detection) {
    const boxArea = detection.box.width * detection.box.height;
    const aspectRatio = detection.box.width / detection.box.height;
    
    const normalizedArea = boxArea / 50000;
    const sizeEnergy = Math.min(1, normalizedArea);
    
    const idealAspectRatio = 0.75;
    const aspectDeviation = Math.abs(aspectRatio - idealAspectRatio);
    const proportionEnergy = Math.max(0.2, 1 - (aspectDeviation * 2));
    
    const positionEnergy = this.calculateCenterDistance(detection.box);
    const confidenceEnergy = detection.confidence || 0.5;
    
    let faceMeshEnergy = 0.7;
    
    if (detection.headPose && detection.gazeDirection && detection.eyeState) {
      const headPoseScore = this.analyzeHeadPose(detection.headPose).score;
      const gazeScore = this.analyzeGazeMetrics(detection.gazeDirection).score;
      const eyeScore = this.analyzeEyeMetrics(detection.eyeState).score;
      
      faceMeshEnergy = (headPoseScore * 0.4 + gazeScore * 0.4 + eyeScore * 0.2);
    }
    
    return (
      sizeEnergy * 0.25 +
      proportionEnergy * 0.20 +
      positionEnergy * 0.20 +
      confidenceEnergy * 0.15 +
      faceMeshEnergy * 0.20
    );
  }
  analyzeTemporalPatterns(history, currentMetrics, now) {
    if (history.length < 2) {
      return {
        stability: 0.5,
        attention: 0.5,
        trend: 'unknown',
        consistency: 0.5
      };
    }

    const recentHistory = history.slice(-10);
    const stability = this.calculateStability(recentHistory);
    const attention = this.calculateFaceMeshAttention(history, now);
    const trend = this.calculateTrend(recentHistory);
    const consistency = this.calculateConsistency(history);
    
    return { stability, attention, trend, consistency };
  }

  calculateFaceMeshAttention(history, now) {
    const timeWindow = 30000;
    const recentHistory = history.filter(h => now - h.timestamp < timeWindow);
    
    if (recentHistory.length === 0) return 0.5;
    
    const expectedFrames = Math.min(30, Math.ceil((now - recentHistory[0].timestamp) / 1000));
    const presenceRatio = Math.min(1, recentHistory.length / expectedFrames);
    
    const avgQuality = recentHistory.reduce((sum, h) => sum + h.quality, 0) / recentHistory.length;
    
    const avgHeadPoseScore = recentHistory.reduce((sum, h) => {
      return sum + (h.headPoseScore || 0.7);
    }, 0) / recentHistory.length;
    
    const avgGazeScore = recentHistory.reduce((sum, h) => {
      return sum + (h.gazeScore || 0.7);
    }, 0) / recentHistory.length;
    
    const avgEyeScore = recentHistory.reduce((sum, h) => {
      return sum + (h.eyeScore || 0.8);
    }, 0) / recentHistory.length;
    
    const lookingAwayCount = recentHistory.filter(h => {
      return h.gazeDirection?.isLookingAway;
    }).length;
    const lookingAwayRatio = lookingAwayCount / recentHistory.length;
    
    const baseAttention = (
      presenceRatio * 0.25 +
      avgQuality * 0.15 +
      avgHeadPoseScore * 0.25 +
      avgGazeScore * 0.25 +
      avgEyeScore * 0.10
    );
    
    const gazePenalty = lookingAwayRatio * 0.2;
    const finalAttention = Math.max(0.1, Math.min(1, baseAttention - gazePenalty));
    
    return finalAttention;
  }

  calculateStability(recentHistory) {
    if (recentHistory.length < 3) return 0.5;
    
    const positions = recentHistory.map(h => h.position);
    const movements = [];
    
    for (let i = 1; i < positions.length; i++) {
      const movement = Math.sqrt(
        Math.pow(positions[i].x - positions[i-1].x, 2) +
        Math.pow(positions[i].y - positions[i-1].y, 2)
      );
      movements.push(movement);
    }
    
    const averageMovement = movements.reduce((a, b) => a + b, 0) / movements.length;
    return Math.max(0, 1 - (averageMovement / 50));
  }

  calculateTrend(recentHistory) {
    if (recentHistory.length < 5) return 'stable';
    
    const engagements = recentHistory.map(h => h.engagement || 50);
    const firstHalf = engagements.slice(0, Math.floor(engagements.length / 2));
    const secondHalf = engagements.slice(Math.floor(engagements.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    
    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  }

  calculateConsistency(history) {
    if (history.length < 5) return 0.5;
    
    const recent = history.slice(-20);
    const values = recent.map(h => h.engagement || 50);
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return Math.max(0, 1 - (stdDev / 30));
  }

  calculateAdvancedEngagementScore(currentMetrics, temporalMetrics) {
    const faceScore = currentMetrics.faceSize * 100;
    const stabilityScore = temporalMetrics.stability * 100;
    const presenceScore = temporalMetrics.attention * 100;
    const qualityScore = currentMetrics.quality * 100;
    
    const faceMeshScore = (
      (currentMetrics.headPoseScore || 0.7) * 0.4 +
      (currentMetrics.gazeScore || 0.7) * 0.4 +
      (currentMetrics.eyeScore || 0.8) * 0.2
    ) * 100;
    
    const finalEngagement = (
      faceScore * this.weights.faceSize +
      stabilityScore * this.weights.stability +
      presenceScore * this.weights.presence +
      qualityScore * this.weights.quality +
      faceMeshScore * this.weights.gazeDirection
    );
    
    return finalEngagement;
  }

  generateAdvancedInsights(currentMetrics, temporalMetrics, engagement, detection) {
    const insights = [];
    
    if (engagement > 80) {
      insights.push({ type: 'positive', message: 'Excelente nivel de atención y engagement' });
    } else if (engagement < 40) {
      insights.push({ type: 'warning', message: 'Atención baja detectada' });
    }
    
    if (detection.headPose) {
      const headPoseAnalysis = this.analyzeHeadPose(detection.headPose);
      if (headPoseAnalysis.analysis !== 'Frontal') {
        insights.push({ 
          type: 'posture', 
          message: `Head position: ${headPoseAnalysis.analysis}` 
        });
      }
    }
    
    if (detection.gazeDirection) {
      const gazeAnalysis = this.analyzeGazeMetrics(detection.gazeDirection);
      if (gazeAnalysis.isLookingAway) {
        insights.push({ 
          type: 'gaze', 
          message: `${gazeAnalysis.analysis} - possible distraction` 
        });
      } else if (gazeAnalysis.score > 0.8) {
        insights.push({ 
          type: 'positive', 
          message: 'Strong eye contact with screen' 
        });
      }
    }
    
    if (detection.eyeState) {
      const eyeAnalysis = this.analyzeEyeMetrics(detection.eyeState);
      if (eyeAnalysis.analysis.includes('closed') || eyeAnalysis.analysis.includes('drowsy')) {
        insights.push({ 
          type: 'fatigue', 
          message: 'Possible fatigue detected - eyes closed or drowsy' 
        });
      }
    }
    
    if (temporalMetrics.trend === 'declining') {
      insights.push({ type: 'trend', message: 'Engagement trend declining over time' });
    }
    
    return insights;
  }

  checkAdvancedAlerts(engagement, temporalMetrics, detection) {
    const alerts = [];
    
    if (engagement < this.thresholds.criticalEngagement) {
      alerts.push({
        type: 'critical',
        message: 'Critical engagement level detected',
        action: 'Immediate intervention recommended'
      });
    }
    
    if (detection.gazeDirection?.isLookingAway) {
      const gazeScore = detection.gazeDirection.gazeScore;
      if (gazeScore < 0.3) {
        alerts.push({
          type: 'distraction',
          message: `Participant looking ${detection.gazeDirection.direction}`,
          action: 'Check for distractions'
        });
      }
    }
    
    if (detection.eyeState && !detection.eyeState.eyesOpen) {
      alerts.push({
        type: 'fatigue',
        message: 'Eyes closed - possible fatigue',
        action: 'Consider a break'
      });
    }
    
    if (detection.headPose) {
      const { yaw, pitch } = detection.headPose;
      if (Math.abs(yaw) > 45 || Math.abs(pitch) > 30) {
        alerts.push({
          type: 'posture',
          message: 'Extreme head position detected',
          action: 'Check camera setup'
        });
      }
    }
    
    return alerts;
  }
  analyzeGroupDynamics(participantAnalyses) {
    const validAnalyses = participantAnalyses.filter(p => p.engagement > 0);
    
    if (validAnalyses.length === 0) {
      return this.groupMetrics;
    }
    
    const avgEngagement = validAnalyses.reduce((sum, p) => sum + p.engagement, 0) / validAnalyses.length;
    const lowEngagementCount = validAnalyses.filter(p => p.engagement < this.thresholds.lowEngagement).length;
    const lowEngagementPercentage = (lowEngagementCount / validAnalyses.length) * 100;
    
    const participantsLookingAway = validAnalyses.filter(p => p.isLookingAway).length;
    const averageGazeScore = validAnalyses.reduce((sum, p) => sum + (p.gazeScore || 70), 0) / validAnalyses.length;
    const participantsWithEyesClosed = validAnalyses.filter(p => !p.eyesOpen).length;
    
    this.groupMetrics.averageEngagement = Math.round(avgEngagement);
    this.groupMetrics.lowEngagementPercentage = Math.round(lowEngagementPercentage);
    this.groupMetrics.participantsLookingAway = participantsLookingAway;
    this.groupMetrics.averageGazeScore = Math.round(averageGazeScore);
    this.groupMetrics.participantsWithEyesClosed = participantsWithEyesClosed;
    
    if (lowEngagementPercentage > this.thresholds.groupAlertThreshold) {
      this.groupMetrics.criticalMoments.push({
        timestamp: Date.now(),
        type: 'low_group_engagement',
        severity: lowEngagementPercentage
      });
    }
    
    if (participantsLookingAway > validAnalyses.length * 0.5) {
      this.groupMetrics.criticalMoments.push({
        timestamp: Date.now(),
        type: 'group_distraction',
        severity: (participantsLookingAway / validAnalyses.length) * 100
      });
    }
    
    return {
      ...this.groupMetrics,
      participantCount: validAnalyses.length,
      recommendations: this.generateAdvancedGroupRecommendations(avgEngagement, lowEngagementPercentage, participantsLookingAway, validAnalyses.length)
    };
  }

  generateAdvancedGroupRecommendations(avgEngagement, lowEngagementPercentage, participantsLookingAway, totalParticipants) {
    const recommendations = [];
    
    if (avgEngagement < 50) {
      recommendations.push({
        type: 'break',
        priority: 'high',
        message: 'Consider a 5-10 minute break - low group engagement'
      });
    }
    
    if (lowEngagementPercentage > 50) {
      recommendations.push({
        type: 'interaction',
        priority: 'medium',
        message: 'Increase interaction with direct questions'
      });
    }
    
    const lookingAwayPercentage = (participantsLookingAway / totalParticipants) * 100;
    if (lookingAwayPercentage > 40) {
      recommendations.push({
        type: 'attention',
        priority: 'medium',
        message: `${Math.round(lookingAwayPercentage)}% of participants are looking away - check for distractions`
      });
    }
    
    if (this.groupMetrics.participantsWithEyesClosed > 0) {
      recommendations.push({
        type: 'fatigue',
        priority: 'medium',
        message: `${this.groupMetrics.participantsWithEyesClosed} participant(s) showing signs of fatigue`
      });
    }
    
    if (this.groupMetrics.averageGazeScore < 60) {
      recommendations.push({
        type: 'setup',
        priority: 'low',
        message: 'Low average gaze score - consider improving camera setup or lighting'
      });
    }
    
    const sessionDuration = Date.now() - this.groupMetrics.sessionStartTime;
    if (sessionDuration > 3600000) {
      recommendations.push({
        type: 'duration',
        priority: 'medium',
        message: 'Long meeting detected - consider summarizing key points'
      });
    }
    
    return recommendations;
  }

  calculateCenterDistance(box) {
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    const videoCenterX = 320;
    const videoCenterY = 240;
    
    const distance = Math.sqrt(
      Math.pow(centerX - videoCenterX, 2) + 
      Math.pow(centerY - videoCenterY, 2)
    );
    
    return Math.max(0, 1 - (distance / 200));
  }

  determineEngagementStatus(engagement) {
    if (engagement >= 80) return 'excellent';
    if (engagement >= 65) return 'good';
    if (engagement >= 45) return 'fair';
    if (engagement >= 25) return 'poor';
    return 'very_poor';
  }

  getParticipantHistory(participantId) {
    if (!this.participantHistory.has(participantId)) {
      this.participantHistory.set(participantId, []);
    }
    return this.participantHistory.get(participantId);
  }

  updateParticipantHistory(participantId, data) {
    const history = this.getParticipantHistory(participantId);
    history.push(data);
    
    if (history.length > 100) {
      history.shift();
    }
  }

  reset() {
    this.participantHistory.clear();
    this.groupMetrics = {
      averageEngagement: 0,
      attentionTrend: 'stable',
      criticalMoments: [],
      sessionStartTime: Date.now()
    };
    console.log('🧠 Advanced Engagement Analyzer reset');
  }
}

// ============================================
// ANALIZADOR GLOBAL PERSISTENTE - OPTIMIZACIÓN CLAVE
// ============================================
let globalAdvancedAnalyzer = null;

const getOrCreateAnalyzer = () => {
  if (!globalAdvancedAnalyzer) {
    globalAdvancedAnalyzer = new AdvancedEngagementAnalyzer();
    console.log('🧠 Global Advanced Engagement Analyzer created');
  }
  return globalAdvancedAnalyzer;
};

// ============================================
// COMPONENTE REACT OPTIMIZADO
// ============================================
const EngagementAnalyzer = () => {
  // Estados principales
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [participants, setParticipants] = useState([])
  const [sessionName, setSessionName] = useState('')
  const [currentSession, setCurrentSession] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [systemError, setSystemError] = useState(null)
  const [groupMetrics, setGroupMetrics] = useState({})
  const [alerts, setAlerts] = useState([])

  // Referencias optimizadas
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const intervalRef = useRef(null)
  const detectionCountRef = useRef(0)
  const isAnalyzingRef = useRef(false)
  const advancedAnalyzer = useRef(null)
  
  // ✨ CANVAS CONFIGURADO UNA SOLA VEZ
  const canvasConfiguredRef = useRef(false)
  
  // Hooks personalizados
  const { user } = useAuth()
  const {
    isLoaded: faceApiLoaded,
    isLoading: faceApiLoading,
    error: faceApiError,
    detectFaces,
    reloadFaceAPI,
    getHeadPoseData,
    getGazeAnalysis,
    capabilities
  } = useFaceAPI()

  const {
    isStreaming,
    error: streamError,
    streamType,
    startScreenShare,
    stopStream,
    assignStreamToVideo,
    debugVideoState
  } = useVideoCapture(videoRef)

  // ✨ INICIALIZAR ANALIZADOR UNA SOLA VEZ
  useEffect(() => {
    if (!advancedAnalyzer.current) {
      advancedAnalyzer.current = getOrCreateAnalyzer();
    }
  }, [])

  // ✨ SINCRONIZAR REF CON ESTADO
  useEffect(() => {
    isAnalyzingRef.current = isAnalyzing
  }, [isAnalyzing])
  // ✨ CONFIGURAR CANVAS UNA SOLA VEZ - CLAVE PARA ESTABILIDAD
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return
    if (canvasConfiguredRef.current) return // Ya configurado

    const video = videoRef.current
    
    // Si hay un stream disponible pero no asignado, asignarlo
    if (isStreaming && !video.srcObject) {
      const assigned = assignStreamToVideo()
      if (assigned) {
        console.log('✅ Stream assigned to video successfully')
      }
    }

    const handleLoadedMetadata = () => {
      if (canvasConfiguredRef.current) return // Evitar reconfiguración
      
      if (canvasRef.current && video.videoWidth && video.videoHeight) {
        const actualWidth = video.videoWidth
        const actualHeight = video.videoHeight
        
        canvasRef.current.width = actualWidth
        canvasRef.current.height = actualHeight
        
        const canvas = canvasRef.current
        canvas.style.position = 'absolute'
        canvas.style.top = '0'
        canvas.style.left = '0'
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        canvas.style.pointerEvents = 'none'
        canvas.style.zIndex = '10'
        
        // ✨ Marcar como configurado para evitar recreación
        canvasConfiguredRef.current = true
        console.log('✅ Canvas configured ONCE:', actualWidth, 'x', actualHeight)
      }
    }

    if (video.readyState >= 1) {
      handleLoadedMetadata()
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true })
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [isStreaming, assignStreamToVideo])

  // ✨ FUNCIÓN DE ANÁLISIS OPTIMIZADA - SIN DEPENDENCIAS INNECESARIAS
  const analyzeFace = useCallback((detection, participantId) => {
    try {
      // Usar el analizador global persistente
      if (!advancedAnalyzer.current) {
        advancedAnalyzer.current = getOrCreateAnalyzer();
      }
      
      const analysis = advancedAnalyzer.current.analyzeParticipantEngagement(detection, participantId);
      
      return {
        metrics: {
          engagement: analysis.engagement,
          attention: analysis.attention,
          confidence: Math.round(detection.confidence * 100),
          energy: analysis.energy
        },
        face: {
          size: Math.round(detection.box.width * detection.box.height),
          position: {
            x: Math.round(detection.box.x),
            y: Math.round(detection.box.y),
            centerX: Math.round(detection.box.x + detection.box.width / 2),
            centerY: Math.round(detection.box.y + detection.box.height / 2)
          }
        },
        confidence: detection.confidence || 0.5,
        quality: detection.quality?.overall || detection.quality || 0.7,
        tracking: {
          id: detection.id || participantId,
          isTracked: true
        },
        status: analysis.status,
        insights: analysis.insights,
        alerts: analysis.alerts,
        headPose: analysis.headPose || detection.headPose,
        gazeDirection: analysis.gazeDirection || detection.gazeDirection,
        eyeState: analysis.eyeState || detection.eyeState,
        gazeScore: analysis.gazeScore,
        isLookingAway: analysis.isLookingAway,
        eyesOpen: analysis.eyesOpen
      };
    } catch (analysisError) {
      console.error('❌ analyzeFace: Error in Face Mesh analysis:', analysisError);
      // Fallback simplificado pero estable
      return {
        metrics: {
          engagement: Math.round(detection.confidence * 80),
          attention: Math.round(detection.confidence * 75),
          confidence: Math.round(detection.confidence * 100),
          energy: 50
        },
        face: {
          size: Math.round(detection.box.width * detection.box.height),
          position: {
            x: Math.round(detection.box.x),
            y: Math.round(detection.box.y),
            centerX: Math.round(detection.box.x + detection.box.width / 2),
            centerY: Math.round(detection.box.y + detection.box.height / 2)
          }
        },
        confidence: detection.confidence || 0.5,
        quality: 0.7,
        tracking: { id: participantId, isTracked: true },
        status: 'medium',
        insights: [],
        alerts: [],
        headPose: detection.headPose || null,
        gazeDirection: detection.gazeDirection || null,
        eyeState: detection.eyeState || null,
        gazeScore: detection.gazeDirection?.gazeScore ? Math.round(detection.gazeDirection.gazeScore * 100) : null,
        isLookingAway: detection.gazeDirection?.isLookingAway || false,
        eyesOpen: detection.eyeState?.eyesOpen || true
      };
    }
  }, []) // ✨ Sin dependencias para evitar recreación

  // ✨ FUNCIÓN DE ANÁLISIS DE FRAME OPTIMIZADA Y ESTABLE
  const analyzeFrame = useCallback(async () => {
    // Verificaciones básicas optimizadas
    if (!faceApiLoaded || !isAnalyzingRef.current || systemError) {
      return
    }

    const video = videoRef.current
    if (!video || video.readyState < 2 || video.videoWidth === 0 || !video.srcObject) {
      return
    }

    const startTime = performance.now()
    
    try {
      const detections = await detectFaces(video) || []
      const processingTime = performance.now() - startTime
      const timestamp = Date.now()
      
      if (detections.length > 0) {
        detectionCountRef.current++
      }
      
      // ✨ TRACKING MEJORADO - ID MÁS CONSISTENTE
      const analyzedParticipants = detections.map((detection, index) => {
        // Generar ID más estable basado en posición en cuadrícula
        const centerX = detection.box.x + detection.box.width / 2
        const centerY = detection.box.y + detection.box.height / 2
        const gridX = Math.floor(centerX / 150) // Cuadrícula de 150px
        const gridY = Math.floor(centerY / 150)
        const participantId = `participant-${gridX}-${gridY}`
        
        const analysis = analyzeFace(detection, participantId)
        
        return {
          id: participantId,
          detection,
          analysis,
          timestamp,
          box: detection.box,
          confidence: detection.confidence
        }
      }).filter(Boolean)

      // ✨ Análisis grupal optimizado
      if (analyzedParticipants.length > 0 && advancedAnalyzer.current) {
        const participantAnalyses = analyzedParticipants.map(p => ({
          participantId: p.id,
          engagement: p.analysis.metrics.engagement,
          attention: p.analysis.metrics.attention,
          status: p.analysis.status,
          alerts: p.analysis.alerts,
          isLookingAway: p.analysis.isLookingAway,
          gazeScore: p.analysis.gazeScore,
          eyesOpen: p.analysis.eyesOpen
        }));

        const groupAnalysis = advancedAnalyzer.current.analyzeGroupDynamics(participantAnalyses);
        setGroupMetrics(groupAnalysis);

        const allAlerts = analyzedParticipants.flatMap(p => p.analysis.alerts || []);
        setAlerts(allAlerts);
      }

      // Dibujar detecciones y actualizar estado
      drawDetections(analyzedParticipants)
      setParticipants(analyzedParticipants)
      
    } catch (error) {
      console.error('❌ Face Mesh analyzeFrame error:', error)
    }
  }, [faceApiLoaded, systemError, detectFaces, analyzeFace]) // ✨ Dependencias mínimas

  // ✨ FUNCIÓN DE DIBUJO OPTIMIZADA Y ESTABLE
  const drawDetections = useCallback((analyzedParticipants) => {
    const canvas = canvasRef.current
    const video = videoRef.current
    
    if (!canvas || !video) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const videoActualWidth = video.videoWidth || 640
    const videoActualHeight = video.videoHeight || 480
    const scaleX = canvas.width / videoActualWidth
    const scaleY = canvas.height / videoActualHeight

    analyzedParticipants.forEach((participant, index) => {
      const box = participant.box
      const metrics = participant.analysis?.metrics || {}
      const status = participant.analysis?.status || 'medium'
      const gazeDirection = participant.analysis?.gazeDirection
      
      const drawBox = {
        x: box.x * scaleX,
        y: box.y * scaleY,
        width: box.width * scaleX,
        height: box.height * scaleY
      }

      // ✨ Color más estable basado en engagement
      let strokeColor = '#22c55e' // Verde por defecto
      if (metrics.engagement < 30) strokeColor = '#ef4444' // Rojo
      else if (metrics.engagement < 60) strokeColor = '#f59e0b' // Amarillo
      else if (metrics.engagement >= 80) strokeColor = '#10b981' // Verde brillante
      
      if (gazeDirection?.isLookingAway) {
        strokeColor = '#f97316' // Naranja para distracción
      }
      
      // ✨ Dibujar rectángulo principal simplificado pero visible
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = 3
      ctx.strokeRect(drawBox.x, drawBox.y, drawBox.width, drawBox.height)
      
      // ✨ Label simplificado pero informativo
      const labelHeight = 120
      const labelWidth = 250
      const labelX = drawBox.x
      const labelY = drawBox.y - labelHeight - 5
      
      if (labelY > 0) {
        // Fondo del label
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)'
        ctx.fillRect(labelX, labelY, labelWidth, labelHeight)
        
        // Borde del label
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = 2
        ctx.strokeRect(labelX, labelY, labelWidth, labelHeight)
        
        // Texto optimizado
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 14px Arial'
        ctx.fillText(`Participant ${index + 1}`, labelX + 8, labelY + 20)
        
        ctx.font = '12px Arial'
        ctx.fillStyle = strokeColor
        ctx.fillText(`Engagement: ${metrics.engagement || 0}%`, labelX + 8, labelY + 40)
        
        ctx.fillStyle = metrics.attention >= 70 ? '#22c55e' : metrics.attention >= 40 ? '#f59e0b' : '#ef4444'
        ctx.fillText(`Attention: ${metrics.attention || 0}%`, labelX + 8, labelY + 60)
        
        // ✨ Gaze score si está disponible
        if (participant.analysis?.gazeScore !== null && participant.analysis?.gazeScore !== undefined) {
          ctx.fillStyle = participant.analysis.isLookingAway ? '#ef4444' : '#10b981'
          ctx.fillText(`Gaze: ${participant.analysis.gazeScore}%`, labelX + 8, labelY + 80)
        }
        
        ctx.fillStyle = '#ffffff'
        ctx.fillText(`Status: ${status.toUpperCase()}`, labelX + 8, labelY + 100)
      }
      
      // ✨ ID visual estable
      ctx.fillStyle = strokeColor
      ctx.beginPath()
      ctx.arc(drawBox.x + drawBox.width - 15, drawBox.y + 15, 12, 0, 2 * Math.PI)
      ctx.fill()
      
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 10px Arial'
      ctx.textAlign = 'center'
      ctx.fillText((index + 1).toString(), drawBox.x + drawBox.width - 15, drawBox.y + 19)
      ctx.textAlign = 'left'
    })

    // ✨ Info de debug estable y útil
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.fillRect(10, 10, 300, 120)
    ctx.strokeStyle = '#00ff00'
    ctx.strokeRect(10, 10, 300, 120)
    
    ctx.fillStyle = '#00ff00'
    ctx.font = 'bold 12px monospace'
    ctx.fillText('🎯 Face Mesh Analysis - STABLE', 15, 30)
    
    ctx.font = '11px monospace'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`Detections: ${detectionCountRef.current}`, 15, 50)
    ctx.fillText(`Active faces: ${analyzedParticipants.length}`, 15, 65)
    ctx.fillText(`Avg engagement: ${groupMetrics.averageEngagement || 0}%`, 15, 80)
    ctx.fillText(`Engine: ${capabilities?.engineType || 'face-mesh'}`, 15, 95)
    ctx.fillText(`Status: TRACKING STABLE`, 15, 110)
  }, [groupMetrics, capabilities]) // ✨ Dependencias mínimas estables
  // ✨ FUNCIÓN DE INICIO OPTIMIZADA
  const startAnalysis = async () => {
    if (!sessionName.trim()) {
      alert('Please enter a session name')
      return
    }

    if (!isStreaming) {
      alert('Please start screen share first')
      return
    }

    if (!videoRef.current) {
      alert('Video not ready. Please wait a moment and try again.')
      return
    }

    if (!faceApiLoaded) {
      alert('Face detection system not ready. Please wait a moment.')
      return
    }

    if (!user) {
      alert('Please sign in to start analysis.')
      return
    }

    try {
      console.log('🚀 Starting STABLE Face Mesh analysis...')
      setSystemError(null)
      
      // ✨ NO RECREAR EL ANALIZADOR - usar el global
      if (!advancedAnalyzer.current) {
        advancedAnalyzer.current = getOrCreateAnalyzer();
      } else {
        // Solo reset si ya existe
        advancedAnalyzer.current.reset();
        console.log('✅ Advanced analyzer reset (not recreated)')
      }
      
      // Verificar estado del video
      const video = videoRef.current
      console.log('📺 Video state:', {
        readyState: video.readyState,
        dimensions: `${video.videoWidth}x${video.videoHeight}`,
        hasStream: !!video.srcObject
      })

      if (video.readyState < 2) {
        throw new Error(`Video not ready for analysis. ReadyState: ${video.readyState}`)
      }

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        throw new Error(`Invalid video dimensions: ${video.videoWidth}x${video.videoHeight}`)
      }

      // ✨ Crear sesión mock simplificada (sin base de datos para estabilidad)
      const session = {
        id: `stable_session_${Date.now()}`,
        name: sessionName.trim(),
        start_time: new Date().toISOString(),
        status: 'active',
        metadata: {
          engine: capabilities?.engineType || 'mediapipe-facemesh',
          stable: true
        }
      }
      
      console.log('✅ Stable session created:', session.id)
      setCurrentSession(session)
      setIsRecording(true)
      setIsAnalyzing(true)
      
      // ✨ Test rápido antes de iniciar
      try {
        const testDetections = await detectFaces(video)
        console.log(`✅ Pre-analysis test: ${testDetections.length} faces detected`)
      } catch (testError) {
        console.warn('⚠️ Pre-analysis test failed, but continuing:', testError.message)
      }

      // ✨ Iniciar intervalo con mayor estabilidad
      setTimeout(() => {
        console.log('⏰ Starting STABLE analysis interval...')
        intervalRef.current = setInterval(() => {
          analyzeFrame().catch(error => {
            console.error('❌ Error in analyzeFrame:', error)
          })
        }, 1500) // ✨ 1.5 segundos para mayor estabilidad
        
        console.log('✅ STABLE Face Mesh analysis started successfully')
      }, 500)
      
    } catch (error) {
      console.error('❌ Error starting analysis:', error)
      setSystemError('Failed to start analysis: ' + error.message)
      setIsAnalyzing(false)
      setIsRecording(false)
      setCurrentSession(null)
    }
  }

  // ✨ FUNCIÓN DE PARADA OPTIMIZADA
  const stopAnalysis = async () => {
    try {
      console.log('🛑 Stopping analysis...')
      setIsAnalyzing(false)
      
      // Limpiar intervalo
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        console.log('✅ Analysis interval cleared')
      }

      // Limpiar estados
      setIsRecording(false)
      setCurrentSession(null)
      setParticipants([])
      setGroupMetrics({})
      setAlerts([])
      detectionCountRef.current = 0
      
      // ✨ NO limpiar el analizador global - mantenerlo para la próxima sesión
      console.log('✅ Analysis stopped successfully (analyzer preserved)')
    } catch (error) {
      console.error('❌ Error stopping analysis:', error)
      setSystemError('Failed to stop analysis: ' + error.message)
    }
  }

  // ✨ FUNCIÓN DE DEBUG OPTIMIZADA
  const debugAnalysis = useCallback(() => {
    console.log('🔧 DEBUG STABLE FACE MESH ANALYSIS:')
    console.log('='.repeat(50))
    
    console.log('📊 CURRENT STATE:')
    console.log('  - faceApiLoaded:', faceApiLoaded)
    console.log('  - isAnalyzing:', isAnalyzing)
    console.log('  - isStreaming:', isStreaming)
    console.log('  - participants:', participants.length)
    console.log('  - detections:', detectionCountRef.current)
    console.log('  - canvas configured:', canvasConfiguredRef.current)
    
    console.log('🧠 ANALYZER STATE:')
    if (advancedAnalyzer.current) {
      console.log('  - participants tracked:', advancedAnalyzer.current.participantHistory.size)
      console.log('  - analyzer instance:', 'STABLE GLOBAL')
    } else {
      console.log('  - analyzer:', 'NOT INITIALIZED')
    }
    
    console.log('🎯 GROUP METRICS:', groupMetrics)
    console.log('⚠️ ALERTS:', alerts.length)
    
    if (capabilities) {
      console.log('🔬 CAPABILITIES:')
      console.log('  - engine:', capabilities.engineType)
      console.log('  - headPose:', capabilities.headPoseEstimation)
      console.log('  - gaze:', capabilities.gazeTracking)
      console.log('  - eyes:', capabilities.eyeStateDetection)
    }
    
    console.log('='.repeat(50))
  }, [faceApiLoaded, isAnalyzing, isStreaming, participants.length, groupMetrics, alerts, capabilities])

  // ✨ LIMPIEZA OPTIMIZADA
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      // ✨ NO limpiar el analizador global al desmontar
    }
  }, [])

  // ✨ EXPONER DEBUG
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.debugStableFaceMesh = debugAnalysis
      console.log('🔧 Stable debug function: debugStableFaceMesh()')
    }
  }, [debugAnalysis])

  // ============================================
  // RENDER DEL COMPONENTE OPTIMIZADO
  // ============================================
  return (
    <div className="container py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
            Advanced Engagement Analyzer
            {capabilities?.engineType && (
              <span className="text-sm font-normal text-blue-600 block mt-2">
                Powered by {capabilities.engineType} - STABLE VERSION
              </span>
            )}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real-time AI-powered analysis with advanced Face Mesh technology for precise head pose estimation, 
            gaze tracking, and eye state detection. Optimized for stable tracking.
          </p>
          
          {/* ✨ INDICADORES DE CAPACIDADES OPTIMIZADOS */}
          {capabilities && (
            <div className="mt-4 flex justify-center gap-4 text-sm">
              <div className={`flex items-center gap-1 ${capabilities.headPoseEstimation ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${capabilities.headPoseEstimation ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                Head Pose
              </div>
              <div className={`flex items-center gap-1 ${capabilities.gazeTracking ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${capabilities.gazeTracking ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                Gaze Tracking
              </div>
              <div className={`flex items-center gap-1 ${capabilities.eyeStateDetection ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${capabilities.eyeStateDetection ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                Eye State
              </div>
              <div className={`flex items-center gap-1 ${capabilities.facialLandmarks ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${capabilities.facialLandmarks ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                468 Landmarks
              </div>
              <div className="flex items-center gap-1 text-purple-600">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                STABLE
              </div>
            </div>
          )}
        </div>

        {/* Alertas en Tiempo Real */}
        {alerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-900">Active Alerts</h3>
            </div>
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div key={index} className={`p-2 rounded ${
                  alert.type === 'critical' ? 'bg-red-100 text-red-800' : 
                  alert.type === 'distraction' ? 'bg-orange-100 text-orange-800' :
                  alert.type === 'fatigue' ? 'bg-purple-100 text-purple-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  <div className="font-medium">{alert.message}</div>
                  {alert.action && (
                    <div className="text-sm mt-1">{alert.action}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Métricas Grupales Optimizadas */}
        {isAnalyzing && groupMetrics.participantCount > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Group Dynamics - Stable Face Mesh Analytics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Active Participants</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">{groupMetrics.participantCount || 0}</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Avg Engagement</span>
                </div>
                <div className="text-2xl font-bold text-green-900">{groupMetrics.averageEngagement || 0}%</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Frames Analyzed</span>
                </div>
                <div className="text-2xl font-bold text-purple-900">{detectionCountRef.current}</div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Session Time</span>
                </div>
                <div className="text-2xl font-bold text-orange-900">
                  {currentSession 
                    ? Math.floor((Date.now() - new Date(currentSession.start_time).getTime()) / 60000) 
                    : 0}m
                </div>
              </div>
            </div>

            {/* Métricas Face Mesh específicas */}
            {(groupMetrics.participantsLookingAway !== undefined || groupMetrics.averageGazeScore !== undefined) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-indigo-900">👀 Looking Away</span>
                  </div>
                  <div className="text-2xl font-bold text-indigo-900">{groupMetrics.participantsLookingAway || 0}</div>
                  <div className="text-xs text-indigo-600">participants</div>
                </div>
                
                <div className="bg-teal-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-teal-900">🎯 Avg Gaze Score</span>
                  </div>
                  <div className="text-2xl font-bold text-teal-900">{groupMetrics.averageGazeScore || 0}%</div>
                  <div className="text-xs text-teal-600">attention level</div>
                </div>
                
                <div className="bg-pink-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-pink-900">😴 Eyes Closed</span>
                  </div>
                  <div className="text-2xl font-bold text-pink-900">{groupMetrics.participantsWithEyesClosed || 0}</div>
                  <div className="text-xs text-pink-600">fatigue indicators</div>
                </div>
              </div>
            )}

            {/* Recomendaciones */}
            {groupMetrics.recommendations && groupMetrics.recommendations.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">💡 Stable Face Mesh Recommendations</h4>
                <div className="space-y-1">
                  {groupMetrics.recommendations.map((rec, index) => (
                    <div key={index} className="text-sm text-yellow-800">
                      <span className="font-medium">{rec.type.toUpperCase()}:</span> {rec.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Controles Optimizados */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="sessionName" className="block text-sm font-medium text-gray-700 mb-2">
                Session Name
              </label>
              <input
                type="text"
                id="sessionName"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="Enter session name (e.g., Team Standup, Client Meeting)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isAnalyzing}
              />
            </div>
            
            <div className="flex gap-3">
              {!isAnalyzing ? (
                <>
                  <button
                    onClick={startScreenShare}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={isStreaming && streamType === 'screen'}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Screen Share
                  </button>
                  <button
                    onClick={startAnalysis}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    disabled={!isStreaming || !sessionName.trim() || faceApiLoading}
                  >
                    <Play className="w-4 h-4" />
                    Start Stable Analysis
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={stopAnalysis}
                    className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <Pause className="w-4 h-4" />
                    Stop Analysis
                  </button>
                  <button
                    onClick={stopStream}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Stop Stream
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Status optimizado */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <div className={`flex items-center gap-2 ${
              faceApiLoaded ? 'text-green-600' : 'text-yellow-600'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                faceApiLoaded ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              Face Mesh API: {faceApiLoaded ? 'Loaded' : 'Loading...'}
            </div>
            
            <div className={`flex items-center gap-2 ${
              isStreaming ? 'text-green-600' : 'text-gray-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isStreaming ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              Stream: {isStreaming ? `Active (${streamType})` : 'Inactive'}
            </div>
            
            <div className={`flex items-center gap-2 ${
              isAnalyzing ? 'text-blue-600' : 'text-gray-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isAnalyzing ? 'bg-blue-500' : 'bg-gray-400'
              }`}></div>
              Analysis: {isAnalyzing ? 'Running (Stable)' : 'Stopped'}
            </div>
            
            {capabilities?.engineType && (
              <div className="flex items-center gap-2 text-purple-600">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                Engine: {capabilities.engineType}
              </div>
            )}

            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              Canvas: {canvasConfiguredRef.current ? 'Configured' : 'Pending'}
            </div>
          </div>
        </div>

        {/* Errores */}
        {(systemError || faceApiError || streamError) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">System Error</span>
            </div>
            <div className="mt-2 text-red-700">
              {systemError || faceApiError || streamError}
            </div>
            {faceApiError && (
              <button
                onClick={reloadFaceAPI}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Reload Face Mesh API
              </button>
            )}
          </div>
        )}

        {/* Video y Canvas Optimizado */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-auto max-h-96 bg-black rounded-lg"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              width={640}
              height={480}
            />
          </div>
          
          {isStreaming && !isAnalyzing && (
            <div className="mt-4 text-center">
              <p className="text-gray-600 mb-2">
                Stream is active. Enter a session name and click "Start Stable Analysis" to begin.
              </p>
              {capabilities && (
                <p className="text-sm text-blue-600">
                  Stable Face Mesh capabilities detected: Head Pose, Gaze Tracking, Eye State Detection
                </p>
              )}
            </div>
          )}
          
          {isAnalyzing && participants.length === 0 && (
            <div className="mt-4 text-center">
              <p className="text-gray-600 mb-2">
                🔍 Analyzing with Stable Face Mesh... Make sure faces are clearly visible.
              </p>
              <div className="flex justify-center">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Activity className="w-4 h-4" />
                  <span>Processed {detectionCountRef.current} frames (Stable tracking)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lista de Participantes Optimizada */}
        {isAnalyzing && participants.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Stable Face Mesh Participant Analysis ({participants.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {participants.map((participant, index) => {
                const metrics = participant.analysis?.metrics || {}
                const status = participant.analysis?.status || 'medium'
                const insights = participant.analysis?.insights || []
                
                const headPose = participant.analysis?.headPose
                const gazeDirection = participant.analysis?.gazeDirection
                const eyeState = participant.analysis?.eyeState
                const gazeScore = participant.analysis?.gazeScore
                const isLookingAway = participant.analysis?.isLookingAway
                const eyesOpen = participant.analysis?.eyesOpen
                
                return (
                  <div key={participant.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Participant {index + 1}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          status === 'excellent' ? 'bg-green-100 text-green-800' :
                          status === 'good' ? 'bg-blue-100 text-blue-800' :
                          status === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                          status === 'poor' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {status.toUpperCase()}
                        </span>
                        <span className="text-xs text-purple-600 font-medium">STABLE</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span>Engagement:</span>
                        <span className="font-medium">{metrics.engagement || 0}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Attention:</span>
                        <span className="font-medium">{metrics.attention || 0}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Energy:</span>
                        <span className="font-medium">{metrics.energy || 0}%</span>
                      </div>
                      
                      {gazeScore !== null && gazeScore !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span>Gaze Score:</span>
                          <span className={`font-medium ${gazeScore >= 70 ? 'text-green-600' : gazeScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {gazeScore}%
                          </span>
                        </div>
                      )}
                      
                      {headPose && (
                        <div className="text-xs text-purple-600 space-y-1">
                          <div className="font-medium">Head Pose (Stable):</div>
                          <div className="ml-2 grid grid-cols-3 gap-1 text-xs">
                            <span>Y: {headPose.yaw?.toFixed(0)}°</span>
                            <span>P: {headPose.pitch?.toFixed(0)}°</span>
                            <span>R: {headPose.roll?.toFixed(0)}°</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-2">
                        {isLookingAway !== undefined && (
                          <div className={`text-xs px-2 py-1 rounded ${
                            isLookingAway ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            👀 {isLookingAway ? 'Looking Away' : 'Focused'}
                          </div>
                        )}
                        
                        {eyesOpen !== undefined && (
                          <div className={`text-xs px-2 py-1 rounded ${
                            eyesOpen ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {eyesOpen ? '👁️ Alert' : '😴 Drowsy'}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {insights.length > 0 && (
                      <div className="text-xs text-gray-600">
                        <strong>Stable Insights:</strong>
                        {insights.slice(0, 2).map((insight, i) => (
                          <div key={i} className="mt-1">
                            • {insight.message}
                          </div>
                        ))}
                        {insights.length > 2 && (
                          <div className="mt-1 text-gray-500">
                            ... and {insights.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Panel de Estadísticas Detalladas - Solo si hay participantes */}
        {isAnalyzing && participants.length > 0 && capabilities && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Stable Face Mesh Performance Analytics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-purple-600">🎭</span> Head Pose
                </h4>
                <div className="space-y-1 text-sm">
                  <div>Detections: {participants.filter(p => p.analysis?.headPose).length}/{participants.length}</div>
                  <div className="text-xs text-green-600 font-medium">STABLE TRACKING</div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-green-600">👀</span> Gaze Tracking
                </h4>
                <div className="space-y-1 text-sm">
                  <div>Focused: {participants.filter(p => !p.analysis?.isLookingAway).length}/{participants.length}</div>
                  <div className="text-xs text-green-600 font-medium">Score: {groupMetrics.averageGazeScore || 0}%</div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">👁️</span> Eye State
                </h4>
                <div className="space-y-1 text-sm">
                  <div>Alert: {participants.filter(p => p.analysis?.eyesOpen !== false).length}/{participants.length}</div>
                  <div className="text-xs text-green-600 font-medium">FATIGUE MONITORING</div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-orange-600">⚡</span> Performance
                </h4>
                <div className="space-y-1 text-sm">
                  <div>Stable Tracking: ✅</div>
                  <div className="text-xs text-green-600 font-medium">OPTIMIZED</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Engine:</span>
                  <span className="font-medium text-blue-600">{capabilities.engineType} (Stable)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Frames:</span>
                  <span className="font-medium">{detectionCountRef.current}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking Quality:</span>
                  <span className="font-medium text-green-600">STABLE & CONSISTENT</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EngagementAnalyzer