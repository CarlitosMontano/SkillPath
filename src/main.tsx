import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './styles/refresh.css'
import './styles/theme-dark.css'
import { initialTheme } from './modules/platform/theme'
import { Login } from './modules/platform/Login'
import { learningStorageKey } from './modules/learning/LearningRoutes'
import type { Session } from './modules/platform/state'

// Aplica el tema antes del primer pintado para evitar un destello claro.
document.documentElement.dataset.theme = initialTheme()

/** Borra el progreso guardado para que cada sesión empiece como un usuario nuevo. El tema se conserva. */
function resetStoredProgress() {
  try {
    localStorage.removeItem(learningStorageKey)
  } catch {
    // Almacenamiento bloqueado: no hay nada que borrar.
  }
}

/**
 * Cada inicio de sesión monta <App> con una `key` nueva: React descarta todo el
 * estado anterior y la app arranca vacía, en la guía de bienvenida.
 */
function Root() {
  const [session, setSession] = useState<Session | null>(null)
  const [sessionKey, setSessionKey] = useState(0)

  if (!session) {
    return (
      <Login
        onLogin={(next) => {
          resetStoredProgress()
          setSessionKey((key) => key + 1)
          setSession(next)
        }}
      />
    )
  }
  return (
    <App
      key={sessionKey}
      session={session}
      onLogout={() => {
        resetStoredProgress()
        setSession(null)
        window.scrollTo({ top: 0 })
      }}
    />
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
