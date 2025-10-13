// NavFooter.jsx
import Navbar from '../Nav'
import { Footer } from '../Footer'

export const NavFooter = ({ children }) => {
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </div>
  )
}