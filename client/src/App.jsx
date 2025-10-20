import AppRoutes from './routes/routes'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toast'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </BrowserRouter>
  )
}

export default App
