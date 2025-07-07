// contexts/AuthContext.jsx - ACTUALIZADO
import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting initial session:', error)
          throw error
        }

        setSession(session)
        setUser(session?.user ?? null)
        
        console.log('Initial session loaded:', session?.user?.email || 'No user')
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        setSession(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No user')
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (event === 'SIGNED_IN') {
          console.log('Usuario autenticado:', session?.user?.email)
          
          // Opcional: Crear perfil de usuario si no existe
          if (session?.user) {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()

              if (error && error.code === 'PGRST116') {
                // Perfil no existe, crear uno
                const { error: insertError } = await supabase
                  .from('profiles')
                  .insert([
                    {
                      id: session.user.id,
                      email: session.user.email,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString()
                    }
                  ])
                
                if (insertError) {
                  console.error('Error creating profile:', insertError)
                } else {
                  console.log('Profile created successfully')
                }
              }
            } catch (profileError) {
              console.error('Error handling profile:', profileError)
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('Usuario desautenticado')
          setSession(null)
          setUser(null)
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed for user:', session?.user?.email)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email, password, metadata = {}) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.fullName || '',
            ...metadata
          }
        }
      })

      if (error) throw error

      console.log('User signed up:', data.user?.email)
      return { data, error: null }
    } catch (error) {
      console.error('Error signing up:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      console.log('User signed in:', data.user?.email)
      return { data, error: null }
    } catch (error) {
      console.error('Error signing in:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      console.log('User signed out')
      setSession(null)
      setUser(null)
      
      return { error: null }
    } catch (error) {
      console.error('Error signing out:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) throw error
      
      console.log('Password reset email sent to:', email)
      return { error: null }
    } catch (error) {
      console.error('Error resetting password:', error)
      return { error }
    }
  }

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      })

      if (error) throw error
      
      console.log('Profile updated:', updates)
      return { data, error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { data: null, error }
    }
  }

  const changePassword = async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
      
      console.log('Password changed successfully')
      return { data, error: null }
    } catch (error) {
      console.error('Error changing password:', error)
      return { data: null, error }
    }
  }

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) throw error
      
      setSession(data.session)
      setUser(data.session?.user ?? null)
      
      console.log('Session refreshed')
      return { data, error: null }
    } catch (error) {
      console.error('Error refreshing session:', error)
      return { data: null, error }
    }
  }

  // Función para obtener información adicional del usuario
  const getUserProfile = async () => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      
      return data
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    changePassword,
    refreshSession,
    getUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}