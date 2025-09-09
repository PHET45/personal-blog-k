import React from "react";

export const Footer = () => {
  return (
<div className="h-[152px] opacity-100 pt-10 pr-4 pb-10 pl-4 gap-6 bg-[hsla(45,11%,93%,1)] w-full ">
    <div className="flex flex-row justify-evenly items-center lg:justify-start lg:gap-10"> 
        <div className="font-poppins font-medium text-base leading-6 tracking-normal">Get in touch</div>
            <div className="flex flex-row gap-5">
                <div><img src="/public/linkedin.svg" alt="linkedin" className="cursor-pointer"/></div>
                <div><img src="/public/github.svg" alt="github" className="cursor-pointer"/></div>
                <div><img src="/public/google.svg" alt="google" className="cursor-pointer"/></div>
            </div>
    </div>
    <div className="flex items-center justify-center lg:justify-end lg:px-5 lg:my-[-30px] py-5  underline"><button className="cursor-pointer">Home page</button></div>
</div>
  )
}

