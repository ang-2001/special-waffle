import React from 'react'
import RegisterForm from '../components/forms/RegisterForm'
import { Page } from '../utils/styles/index.styled'
import styles from '../index.css'


const LandingPage = () => {
  return (
    <Page>
      <RegisterForm/>
    </Page>
  )
}

export default LandingPage