// hooks/useAnalytics.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useAnalytics = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [analytics, setAnalytics] = useState({
    stats: [],
    recentSessions: [],
    weeklyData: null
  })

  // Fetch analytics data
  const fetchAnalytics = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // 1. Get basic stats
      const statsPromise = fetchUserStats()
      
      // 2. Get recent sessions
      const sessionsPromise = fetchRecentSessions()
      
      // 3. Get weekly summary
      const weeklyPromise = fetchWeeklySummary()

      const [stats, sessions, weekly] = await Promise.all([
        statsPromise,
        sessionsPromise,
        weeklyPromise
      ])

      setAnalytics({
        stats,
        recentSessions: sessions,
        weeklyData: weekly
      })

    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch user stats
  const fetchUserStats = async () => {
    const { data: sessions, error } = await supabase
      .from('analysis_sessions')
      .select(`
        id,
        duration_seconds,
        total_participants,
        avg_engagement,
        max_engagement,
        status,
        start_time
      `)
      .eq('user_id', user.id)
      .eq('status', 'completed')

    if (error) throw error

    // Calculate stats
    const totalSessions = sessions.length
    const totalHours = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 3600
    const avgEngagement = sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + (s.avg_engagement || 0), 0) / sessions.length 
      : 0
    const totalParticipants = sessions.reduce((sum, s) => sum + (s.total_participants || 0), 0)

    // Get alerts count
    const { count: alertsCount } = await supabase
      .from('system_alerts')
      .select('*', { count: 'exact', head: true })
      .in('session_id', sessions.map(s => s.id))

    return [
      {
        title: 'Total Sessions',
        value: totalSessions.toString(),
        change: '+12% from last week',
        color: 'blue',
        icon: 'BarChart3'
      },
      {
        title: 'Analysis Hours',
        value: `${totalHours.toFixed(1)}h`,
        change: '+8% from last week',
        color: 'green',
        icon: 'Clock'
      },
      {
        title: 'Avg Engagement',
        value: `${avgEngagement.toFixed(1)}%`,
        change: '+5% from last week',
        color: 'purple',
        icon: 'TrendingUp'
      },
      {
        title: 'Total Alerts',
        value: (alertsCount || 0).toString(),
        change: '-15% from last week',
        color: 'red',
        icon: 'AlertTriangle'
      }
    ]
  }

  // Fetch recent sessions
  const fetchRecentSessions = async () => {
    const { data, error } = await supabase
      .from('analysis_sessions')
      .select(`
        id,
        name,
        start_time,
        end_time,
        duration_seconds,
        total_participants,
        avg_engagement,
        status
      `)
      .eq('user_id', user.id)
      .order('start_time', { ascending: false })
      .limit(10)

    if (error) throw error

    return data.map(session => ({
      id: session.id,
      name: session.name,
      date: new Date(session.start_time).toLocaleDateString(),
      duration: formatDuration(session.duration_seconds),
      participants: session.total_participants || 0,
      engagement: session.avg_engagement ? `${session.avg_engagement.toFixed(1)}%` : 'N/A',
      status: session.status
    }))
  }

  // Fetch weekly summary
  const fetchWeeklySummary = async () => {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // Start of week
    
    const { data, error } = await supabase
      .from('user_analytics_summary')
      .select('*')
      .eq('user_id', user.id)
      .eq('period_type', 'weekly')
      .gte('period_start', weekStart.toISOString().split('T')[0])
      .single()

    if (error && error.code !== 'PGRST116') {
      console.warn('No weekly summary found:', error)
      return null
    }

    return data
  }

  // Helper function to format duration
  const formatDuration = (seconds) => {
    if (!seconds) return '0m'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  // Effect to fetch data when user changes
  useEffect(() => {
    if (user) {
      fetchAnalytics()
    }
  }, [user])

  return {
    analytics,
    loading,
    error,
    refresh: fetchAnalytics
  }
}

// Hook para manejo de sesiones
export const useSessionData = () => {
  const { user } = useAuth()
  const [currentSession, setCurrentSession] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState(null)

  // Start a new session
  const startSession = async (sessionName) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      const { data, error } = await supabase
        .from('analysis_sessions')
        .insert([{
          user_id: user.id,
          name: sessionName,
          start_time: new Date().toISOString(),
          status: 'active'
        }])
        .select()
        .single()

      if (error) throw error

      setCurrentSession(data)
      setIsRecording(true)
      console.log('✅ Session started:', data.id)
      
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // End current session
  const endSession = async () => {
    if (!currentSession) {
      throw new Error('No active session')
    }

    try {
      const endTime = new Date().toISOString()
      const durationSeconds = Math.floor(
        (new Date(endTime) - new Date(currentSession.start_time)) / 1000
      )

      const { data, error } = await supabase
        .from('analysis_sessions')
        .update({
          end_time: endTime,
          duration_seconds: durationSeconds,
          status: 'completed'
        })
        .eq('id', currentSession.id)
        .select()
        .single()

      if (error) throw error

      setCurrentSession(null)
      setIsRecording(false)
      console.log('✅ Session ended:', data.id)
      
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Save participant data
  const saveParticipantData = async (participantAnalysis) => {
    if (!currentSession || !isRecording) {
      return false
    }

    try {
      const participantDataBatch = participantAnalysis.map((participant, index) => ({
        session_id: currentSession.id,
        participant_index: index,
        timestamp: new Date().toISOString(),
        engagement_score: participant.analysis?.metrics?.engagement || 0,
        attention_score: participant.analysis?.metrics?.attention || 0,
        happiness_score: participant.analysis?.metrics?.happiness || 0,
        fatigue_score: participant.analysis?.metrics?.fatigue || 0,
        estimated_age: participant.analysis?.age,
        estimated_gender: participant.analysis?.gender,
        expressions: participant.analysis?.expressions || {},
        face_box: participant.box ? {
          x: participant.box.x,
          y: participant.box.y,
          width: participant.box.width,
          height: participant.box.height
        } : {},
        confidence_score: participant.analysis?.confidence || 0
      }))

      const { error } = await supabase
        .from('participant_data')
        .insert(participantDataBatch)

      if (error) throw error

      console.log(`✅ Saved ${participantDataBatch.length} participant data points`)
      return true
    } catch (err) {
      console.error('Error saving participant data:', err)
      setError(err.message)
      return false
    }
  }

  // Save system alert
  const saveAlert = async (alertData) => {
    if (!currentSession) return false

    try {
      const { error } = await supabase
        .from('system_alerts')
        .insert([{
          session_id: currentSession.id,
          alert_type: alertData.type === 'low_engagement' ? 'low_engagement' : 'high_fatigue',
          message: alertData.message,
          severity: alertData.severity || 'warning',
          participant_index: alertData.participantIndex,
          trigger_value: alertData.triggerValue,
          threshold_value: alertData.threshold
        }])

      if (error) throw error

      console.log('✅ Alert saved:', alertData.message)
      return true
    } catch (err) {
      console.error('Error saving alert:', err)
      return false
    }
  }

  return {
    currentSession,
    isRecording,
    error,
    startSession,
    endSession,
    saveParticipantData,
    saveAlert
  }
}

// Hook para detalles de sesión específica
export const useSessionDetails = (sessionId) => {
  const { user } = useAuth()
  const [sessionDetails, setSessionDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!sessionId || !user) {
      setLoading(false)
      return
    }

    const fetchSessionDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get session basic info
        const { data: session, error: sessionError } = await supabase
          .from('analysis_sessions')
          .select('*')
          .eq('id', sessionId)
          .eq('user_id', user.id)
          .single()

        if (sessionError) throw sessionError

        // Get participant data
        const { data: participantData, error: participantError } = await supabase
          .from('participant_data')
          .select('*')
          .eq('session_id', sessionId)
          .order('timestamp', { ascending: true })

        if (participantError) throw participantError

        // Get alerts
        const { data: alerts, error: alertsError } = await supabase
          .from('system_alerts')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true })

        if (alertsError) throw alertsError

        // Get insights
        const { data: insights, error: insightsError } = await supabase
          .from('session_insights')
          .select('*')
          .eq('session_id', sessionId)
          .single()

        if (insightsError && insightsError.code !== 'PGRST116') {
          console.warn('No insights found for session:', insightsError)
        }

        setSessionDetails({
          session,
          participantData: participantData || [],
          alerts: alerts || [],
          insights: insights || null
        })

      } catch (err) {
        console.error('Error fetching session details:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSessionDetails()
  }, [sessionId, user])

  return {
    sessionDetails,
    loading,
    error
  }
}