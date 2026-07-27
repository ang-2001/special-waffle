import React from 'react'
import RegisterForm from '../components/organisms/RegisterForm/RegisterForm';
import AuthPageTemplate from '../components/templates/AuthPageTemplate';

const RegisterPage = () => {
  return (
    <AuthPageTemplate heading="Register">
      <RegisterForm />
    </AuthPageTemplate>
  )
}

export default RegisterPage
