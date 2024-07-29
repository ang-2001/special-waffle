import React from 'react'
import RegisterForm from '../components/forms/RegisterForm.jsx'
import { Page } from '../utils/styles/index.styled.js'
import styles from '../index.css'


const LandingPage = () => {
  return (
    // pass a prop that specifies alignment of the page(not all pages have the same alignment)
    <Page>
      <RegisterForm />
    </Page>
  )
}

export default LandingPage