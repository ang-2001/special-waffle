import { useState } from 'react'
import { InputContainer } from '../../utils/styles/index.styled';


const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pwdConfirmation, setConfirmation] = useState('');

    return (
        <>
            <form className="registerWrapper" id='registrationForm'>
                <InputContainer>
                    <label htmlFor="">Sign Up</label>
                    <input type="text" value={username} placeholder="Username" onChange={e => setUsername(e.target.value)} />
                    <input type="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} />
                    <input type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} />
                    <input type="password" value={pwdConfirmation} placeholder="Confirm Password" onChange={e => setConfirmation(e.target.value)} />
                </InputContainer>
            </form>
            <button className="registerButton" name='register' type='submit'>Sign Up</button>
            {/* value attribute = inital value of the button output */}
            <p className="login">Already have an account? Login</p>
        </>
    )
}

export default RegisterForm