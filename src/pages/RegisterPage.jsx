import { useState } from 'react'
import RegisterForm from '../components/forms/RegisterForm';
import { Header, Page } from '../utils/styles/index.styled';

const RegisterPage = () => {
  // is there shorthand for this section? 
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setConfirm] = useState('');

  return (
    <Page>
      <Header>Register</Header>
      <RegisterForm />
    </Page>
  )
}

export default RegisterPage