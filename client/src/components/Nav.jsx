import React from 'react'
import { Link } from 'react-router-dom'
import { RxHamburgerMenu } from 'react-icons/rx'
const Navbar = () => {
  const [menuOpen, setMenuOpen] = React.useState(false)
  return (
    <div className="flex justify-between items-center p-4 w-full"> 
      <nav className="flex flex-row justify-between px-20 w-full items-center py-4 md:px-8 bg-background border-b border-gray-200">
        <img src="/public/images/logo.png" alt="logo" />
        <ul className="hidden md:flex flex-row gap-5">
          <li>
            <Link to="/login">
              <button className="text-black bg-white   hover:bg-white focus:outline-none  focus:ring-stone-400 font-medium rounded-full text-sm  me-2 mb-2 dark:bg-white dark:hover:border-stone-400 dark:hover:text-stone-400 dark:focus:ring-stone-400 dark:border-gray-800 px-[40px] py-[12px] border-1 cursor-pointer">
                Login
              </button>
            </Link>
          </li>
          <li>
            <Link to="/register">
              <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none  focus:ring-gray-300 font-medium rounded-full text-sm  me-2 mb-2 dark:bg-gray-800 dark:hover:bg-[hsla(36,4%,44%,1)] dark:focus:ring-gray-700 dark:border-stone-400 px-[40px] py-[12px] border-1 cursor-pointer">
                Signup
              </button>
            </Link>
          </li>
        </ul>
        <div className="flex md:hidden items-center relative">
          <button onClick={() => setMenuOpen((v) => !v)} aria-label="Open menu">
            <RxHamburgerMenu className="text-2xl cursor-pointer" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-12 z-50 flex flex-col gap-3 w-56 bg-white shadow-lg rounded-3xl p-4 border border-gray-200">
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-black bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-stone-400 font-medium rounded-full text-lg py-3 mb-2">
                  Log in
                </button>
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-lg py-3">
                  Sign up
                </button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Navbar
