import { useState } from 'react'
import RegisterForm from '../components/forms/RegisterForm';

const RegisterPage = () => {
  // is there shorthand for this section? 
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setConfirm] = useState('');

  return (
    <>
      <div className="register">
        <div className="registerContainer">
          <RegisterForm></RegisterForm>
        </div>
      </div>
    </>
  )
}

export default RegisterPage