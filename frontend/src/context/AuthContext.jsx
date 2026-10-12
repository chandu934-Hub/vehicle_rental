import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('roam_user'))
    } catch {
      return null
    }
  })

  const login = (data) => {
    const next = {
      email: data.email,
      role: data.role,
      fullName: data.fullName || '',
      phoneNumber: data.phoneNumber || ''
    }
    localStorage.setItem('roam_token', data.token)
    localStorage.setItem('roam_user', JSON.stringify(next))
    setUser(next)
  }

  const logout = () => {
    localStorage.removeItem('roam_token')
    localStorage.removeItem('roam_user')
    setUser(null)
  }

  useEffect(() => {
    window.addEventListener('roam:logout', logout)
    return () => window.removeEventListener('roam:logout', logout)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}