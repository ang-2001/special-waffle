import React from 'react'
import LoginForm from "../components/organisms/LoginForm/LoginForm"
import AuthPageTemplate from "../components/templates/AuthPageTemplate"

const LoginPage = () => {
  return (
    <AuthPageTemplate heading="Login">
      <LoginForm />
    </AuthPageTemplate>
  )
}

export default LoginPage
