

import Navbar from "./components/Nav";
import Hero from "./components/Hero";
import {Footer} from "./components/Footer";
import ArticleSection from "./components/ArticleSection"
function App() {
  return (
    <div className = "flex flex-col justify-center items-center  w-full ">
      <Navbar />
      <Hero />
      <ArticleSection/>
      <Footer/>
    </div>
  )
}

export default App

