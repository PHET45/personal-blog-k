
import "tailwindcss";
const Navbar = () => {
  return (
  <div className = "flex justify-between items-center p-4 w-full">
    <nav className="flex flex-row justify-between px-20 w-full items-center  py-4 md:px-8 bg-background border-b border-muted border-gray-200">
      <img src="/public/images/logo.png" alt="logo" />
      <ul className="flex flex-row gap-5 ">
        <li>
          <button className="text-black bg-white   hover:bg-white focus:outline-none  focus:ring-stone-400 font-medium rounded-full text-sm  me-2 mb-2 dark:bg-white dark:hover:border-stone-400 dark:hover:text-stone-400 dark:focus:ring-stone-400 dark:border-gray-800 px-[40px] py-[12px] border-1">Login</button>
        </li>
        <li>
          <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none  focus:ring-gray-300 font-medium rounded-full text-sm  me-2 mb-2 dark:bg-gray-800 dark:hover:bg-[hsla(36,4%,44%,1)] dark:focus:ring-gray-700 dark:border-stone-400 px-[40px] py-[12px] border-1 ">Signup</button>
        </li>
      </ul>
    </nav>
  </div>
  )
}

const Hero = () => {
  return (
    <section className="flex justify-center items-center p-4 w-full ">
      <div className = "flex flex-col justify-center  items-center w-full gap-5 container md:px-8 px-4 py-8 lg:flex-row lg:py-16 mx-auto">
        <div className = "flex flex-col">
            <h1 className = "flex justify-self-start text-4xl lg:text-5xl font-bold mb-4">
              Stay 
              <br className="hidden lg:block"/>
              Informed, 
              <br />
              Stay Inspired
            </h1>
            <p className = "text-[#78716c] text-lg text-muted-foreground">Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.</p>
        </div>
          <img src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg" alt="Person with a cat" className = "w-full h-[530px] object-cover rounded-lg shadow-lg lg:w-1/3 mx-4 mb-8 lg:mb-0" />
        <div className = "flex flex-col lg:w-1/3 lg:pl-8 ">
            <h2 className="text-xl font-semibold mb-2">-Author</h2>
            <h3 className="text-2xl font-bold mb-4">Thompson P.</h3>
            <p className="text-[#78716c] text-muted-foreground mb-4">
              I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
            </p>
            <p className="text-[#78716c] text-muted-foreground">
              When i’m not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.
            </p>
        </div>
      </div>
    </section>
  )
}
function App() {
  return (
    <div className = "flex flex-col justify-center items-center  w-full ">
      <Navbar />
      <Hero />
    </div>
  )
}

export default App

