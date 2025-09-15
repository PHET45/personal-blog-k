import React from 'react'
import { FaGithub } from 'react-icons/fa'
import { FaLinkedin } from 'react-icons/fa'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <div className="h-[144px] opacity-100 pt-10 pr-4 pb-10 pl-4 gap-5 bg-[hsla(45,11%,93%,1)] w-full flex justify-between ">
      <div className="flex flex-row justify-center items-center lg:justify-start lg:gap-10">
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
  )
}
