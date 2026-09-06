import React from 'react'
import LandingHero from '../components/organisms/LandingHero/LandingHero'
import AuthPageTemplate from '../components/templates/AuthPageTemplate'

const LandingPage = () => {
  return (
    <AuthPageTemplate>
      <LandingHero />
    </AuthPageTemplate>
  )
}

export default LandingPage
