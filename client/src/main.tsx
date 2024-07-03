import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './style/index.css'
import AppContextExports from './context/context.tsx'

const { AppProvider } = AppContextExports;


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
        <App />
    </AppProvider>
  </React.StrictMode>,
)
