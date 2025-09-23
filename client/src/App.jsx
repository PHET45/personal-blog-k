import AppRoutes from './routes/routes'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toast'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer position="bottom-right" />
    </BrowserRouter>
  )
}

export default App
