import React from 'react'
import RegisterForm from '../components/organisms/RegisterForm/RegisterForm'
import AuthPageTemplate from '../components/templates/AuthPageTemplate'

const LandingPage = () => {
  return (
    // pass a prop that specifies alignment of the page(not all pages have the same alignment)
    <AuthPageTemplate>
      <RegisterForm />
    </AuthPageTemplate>
  )
}

export default LandingPage
