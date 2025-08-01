
import "tailwindcss";
import Navbar from "./components/Nav";
import Hero from "./components/Hero";
function App() {
  return (
    <div className = "flex flex-col justify-center items-center  w-full ">
      <Navbar />
      <Hero />
    </div>
  )
}

export default App

