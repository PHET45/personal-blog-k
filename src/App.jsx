
import "tailwindcss";
const Navbar = () => {
  return (
  <div className = "flex justify-between items-center p-4 w-full">
    <nav className="flex flex-row justify-between px-20 w-full ">
      <h1 className="">dd</h1>
      <ul className="flex flex-row gap-5 ">
        <li>Login</li>
        <li>Signup</li>
      </ul>
    </nav>
  </div>
  )
}

const Hero = () => {
  return (
    <section className="flex justify-center items-center p-4 w-full">
      <div className = "flex flex-row justify-center px-20 w-full">
        <div className = "flex flex-col">
            <h1 className = "flex justify-end">"Stay Informed, Stay Inspired"</h1>
            <p>"Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information."</p>
        </div>
          <img src="" alt="humen" />
        <div className = "flex flex-col">
            <h3>"Thompson P."</h3>
            <p>
              "I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
              When i’m not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes."
            </p>
        </div>
      </div>
    </section>
  )
}
function App() {
  return (
    <div className = "flex flex-col justify-center items-center  w-full">
      <Navbar />
      <Hero />
    </div>
  )
}

export default App

