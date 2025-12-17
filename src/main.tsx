import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

async function enableMocking() {
  // In a real app we might check environment here
  // if (import.meta.env.PROD) return;

  const { worker } = await import('./mocks/browser')
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}

enableMocking()
  .then(() => console.log('MSW started'))
  .catch((e) => console.error('MSW failed to start', e))
  .finally(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
