import { Link } from "react-router-dom";

const Navbar = () => {
    return (
    <div className = "flex justify-between items-center p-4 w-full ">
      <nav className="flex flex-row justify-between px-20 w-full items-center  py-4 md:px-8 bg-background border-b border-muted border-gray-200">
        <img src="/public/images/logo.png" alt="logo" />
        <ul className="flex flex-row gap-5 ">
          <li>
            <Link to="/login"><button className="text-black bg-white   hover:bg-white focus:outline-none  focus:ring-stone-400 font-medium rounded-full text-sm  me-2 mb-2 dark:bg-white dark:hover:border-stone-400 dark:hover:text-stone-400 dark:focus:ring-stone-400 dark:border-gray-800 px-[40px] py-[12px] border-1">Login</button></Link>
          </li>
          <li>
          <Link to="/register"><button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none  focus:ring-gray-300 font-medium rounded-full text-sm  me-2 mb-2 dark:bg-gray-800 dark:hover:bg-[hsla(36,4%,44%,1)] dark:focus:ring-gray-700 dark:border-stone-400 px-[40px] py-[12px] border-1 ">Signup</button></Link>
          </li>
        </ul>
      </nav>
    </div>
    )
  }

  export default Navbar;