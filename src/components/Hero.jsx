import AnimatedContent from "./ui/AnimatedContent"
import BlurText from "./ui/BlurText"



const Hero = () => {
  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };
    return (
      <section className="flex justify-center items-center p-4 w-full ">
        <div className = "flex flex-col justify-center  items-center w-full gap-5 container md:px-8 px-4 py-8 lg:flex-row lg:py-16 mx-auto">
          <div className = "flex flex-col lg:w-1/3">
              <h1 className = "flex flex-col justify-self-start text-4xl lg:text-5xl font-bold mb-4">
                <BlurText
                  text=" Stay "
                  delay={150}
                  animateBy="words"
                  direction="top"
                  onAnimationComplete={handleAnimationComplete}
                />          
                <BlurText
                  text=" Informed, "
                  delay={150}
                  animateBy="words"
                  direction="top"
                  onAnimationComplete={handleAnimationComplete}
                /> 
                <BlurText
                  text=" Stay Inspired "
                  delay={150}
                  animateBy="words"
                  direction="top"
                  onAnimationComplete={handleAnimationComplete}
                /> 
              </h1>
              <p className = "text-[#78716c] text-lg text-muted-foreground">Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.</p>
          </div>
          
          <AnimatedContent
            distance={150}
            direction="horizontal"
            reverse={false}
            duration={1.2}
            ease="bounce.out"
            initialOpacity={0.2}
            animateOpacity
            scale={1.1}
            threshold={0.2}
            delay={0.3}
          >
          <div><img src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg" alt="Person with a cat" className = "w-full h-[530px] object-cover rounded-lg shadow-lg  mx-4 mb-8 " /></div>
          </AnimatedContent>
            
          <div className = "flex flex-col lg:w-1/3 lg:pl-8 ">
              <h2 className="text-xl font-semibold mb-2">-Author</h2>
              <h3 className="text-2xl font-bold mb-4">Thompson P.</h3>
              <p className="text-[#78716c] text-muted-foreground mb-4">
                I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
              </p>
              <p className="text-[#78716c] text-muted-foreground">
                When i'm not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.
              </p>
          </div>
        </div>
      </section>
    )
  }

  export default Hero