import React from 'react'
import { NavFooter } from '@/components/mainLayout/NavFooter'
import Hero from '@/components/Hero'
import ArticleSection from '@/components/ArticleSection'
import AIChatModal from '@/components/AIChatModal'
const HomePage = () => {
  return (
    <NavFooter>
      <Hero />
      <ArticleSection />
      <AIChatModal />
    </NavFooter>
  )
}

export default HomePage
