import React from 'react'
import { NavFooter } from '@/components/mainLayout/NavFooter'
import Hero from '@/components/Hero'
import ArticleSection from '@/components/ArticleSection'
const HomePage = () => {
  return (
    <NavFooter>
      <Hero />
      <ArticleSection />
    </NavFooter>
  )
}

export default HomePage
