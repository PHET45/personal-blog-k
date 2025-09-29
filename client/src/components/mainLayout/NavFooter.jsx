import Navbar from '../Nav'
import { Footer } from '../Footer'

export const NavFooter = ({ children }) => {
  return (
    <div className = "flex flex-col w-full min-h-screen overflow-x-hidden">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}
