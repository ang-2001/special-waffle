import { useState } from 'react'

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setConfirm] = useState('');

  return (
    <>
    {/* container for surrounding css, div for just the form */}
      <div className="registerContainer">
        <form className="registerForm">
          <label htmlFor="">Sign Up</label>
          <input type="text" value={username} placeholder="Username" onChange={e => setUsername(e.target.value)} />
          <input type="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <input type="password" name="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <input type="password" name="passwordConfirm" value={passwordConfirm} placeholder="Confirm Password" onChange={e => setConfirm(e.target.value)} />
        </form>

        <button className="registerButton" name='register' type='submit'>Sign Up</button>
        <p className="loginText">Already have an account? Login</p>
      </div>
    </>
  )
}

export default Register