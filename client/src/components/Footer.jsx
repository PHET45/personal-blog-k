import React from 'react'
import { FaGithub } from 'react-icons/fa'
import { FaLinkedin } from 'react-icons/fa'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <div className='flex items-center justify-center flex-col gap-4 w-full bg-[hsla(45,11%,93%,1)]'>
    <div className="lg:h-[144px] opacity-100 lg:px-30 gap-5 py-5 lg:w-[1440px] flex md:flex-row flex-col  justify-center items-center lg:justify-between w-full">
      <div className="flex flex-row justify-center items-center gap-x-10 lg:justify-start lg:gap-10">
        <div className="font-poppins font-medium text-base leading-6 tracking-normal">
          Get in touch
        </div>
        <div className="flex flex-row gap-5">
          <div>
            <FaLinkedin size={24} color="#43403B" className="cursor-pointer " />
          </div>
          <div>
            <FaGithub size={24} color="#43403B" className="cursor-pointer" />
          </div>
          <div>
            <AiFillGoogleCircle
              size={24}
              color="#43403B"
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center lg:justify-end lg:px-5 lg:my-[-30px] py-5  ">
        <Link className='hover:underline' to="/">Home page</Link>
      </div>
    </div>
    </div>
  )
}
