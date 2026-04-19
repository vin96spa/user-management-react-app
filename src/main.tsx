import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App.tsx'
import { LoaderProvider } from './context/LoaderContext.tsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoaderProvider>
      <Toaster position="top-right" richColors closeButton />
      <App />
    </LoaderProvider>
  </StrictMode>,
)
