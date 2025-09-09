import Navbar from '../Nav'
import { Footer } from '../Footer'

export const NavFooter = ({ children }) => {
  return (
    <div className = "flex flex-col w-full ">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}
