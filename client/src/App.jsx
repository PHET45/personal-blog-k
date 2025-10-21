import AppRoutes from './routes/routes'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toast'
import AIChatModal from '@/components/AIChatModal'
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <AIChatModal />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </BrowserRouter>
  )
}

export default App
