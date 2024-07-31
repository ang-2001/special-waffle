import React from 'react'
import LoginForm from "../components/forms/LoginForm"
import { Header, Page } from "../utils/styles/index.styled"

const LoginPage = () => {
  return (
    <Page>
      <Header>Login</Header>
      <LoginForm />
    </Page>
  )
}

export default LoginPage