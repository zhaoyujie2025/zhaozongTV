import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/main.css'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import App from '@/App'
import MyRouter from '@/router/MyRouter'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeroUIProvider>
      <ToastProvider placement="top-center" />
      <MyRouter>
        <App />
      </MyRouter>
    </HeroUIProvider>
  </StrictMode>,
)
