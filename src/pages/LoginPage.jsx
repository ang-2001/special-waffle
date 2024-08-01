import React from 'react'
import LoginForm from "../components/forms/LoginForm"
import { PageHeader, Page } from "../utils/styles/index.styled"

const LoginPage = () => {
  return (
    <Page>
      <PageHeader>Login</PageHeader>
      <LoginForm />
    </Page>
  )
}

export default LoginPage