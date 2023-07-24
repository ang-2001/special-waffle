import React from 'react'
import RegisterForm from '../components/forms/RegisterForm'
import { Page } from '../utils/styles/index.styled'

const LandingPage = () => {
  return (
    <div>
      <Page>
        <RegisterForm/>
      </Page>
    </div>
  )
}

export default LandingPage