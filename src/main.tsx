import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './styles/refresh.css'
import './styles/theme-dark.css'
import { initialTheme } from './modules/platform/theme'

// Aplica el tema antes del primer pintado para evitar un destello claro.
document.documentElement.dataset.theme = initialTheme()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
