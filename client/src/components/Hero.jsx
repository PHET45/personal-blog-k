import AnimatedContent from './ui/AnimatedContent'
import BlurText from './ui/BlurText'

const Hero = () => {
  const handleAnimationComplete = () => {

  }
  return (
    <div className="flex flex-col justify-center w-full items-center lg:w-[1200px] lg:gap-14 md:gap-5 container md:px-8 px-4 py-8 lg:flex-row lg:py-16 mx-auto ">
      <div className="flex flex-col  lg:w-1/3 ">
        <h1
          className="flex flex-col 
             items-center
              md:items-center lg:items-end 
             font-poppins font-semibold 
             text-3xl md:text-5xl lg:text-[52px] 
             leading-snug  lg:leading-[60px] 
             tracking-normal  
             text-left md:text-center lg:text-right 
             mb-4"
        >
          <div className="flex flex-row lg:flex-col lg:items-end">
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
          </div>

          <BlurText
            text=" Stay Inspired "
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="flex flex-row items-end"
          />
        </h1>

        <div
          className="flex flex-col  text-center lg:items-end 
             text-[hsla(36,4%,44%,1)] font-poppins font-medium 
               lg:text-right 
             w-full lg:max-w-[600px]"
        >
          Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.
        </div>
      </div>

      <div className="flex flex-col  lg:flex-row items-center lg:w-1/3 mt-8 lg:mt-0">
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
          <div className="flex justify-center">
            <img
              src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
              alt="Person with a cat"
              className="w-full h-[530px] object-cover rounded-lg shadow-lg  mx-4 mb-8 "
            />
          </div>
        </AnimatedContent>
      </div>

      <div className="flex flex-col lg:w-1/3  ">
        <h2
          className="font-poppins font-medium 
             text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] 
             leading-[16px] sm:leading-[20px] md:leading-[22px] lg:leading-[24px] 
             tracking-normal text-[hsla(36,4%,44%,1)]"
        >
          -Author
        </h2>
        <h3 className="text-2xl font-bold mb-4">Thompson P.</h3>
        <p className="text-[#78716c]  mb-4">
          I am a pet enthusiast and freelance writer who specializes in animal
          behavior and care. With a deep love for cats, I enjoy sharing insights
          on feline companionship and wellness.
        </p>
        <p className="text-[#78716c] ">
          When i'm not writing, I spends time volunteering at my local animal
          shelter, helping cats find loving homes.
        </p>
      </div>
    </div>
  )
}

export default Hero
