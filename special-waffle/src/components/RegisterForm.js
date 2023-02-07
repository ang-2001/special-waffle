import { useState } from 'react'

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <>

        
            <div className="formContainer">
                <form className="registerWrapper" id='registrationForm'>
                    <label></label>
                    <input type="text" value={username} placeholder="Username" onChange={e => setUsername(e.target.value)} />
                    <input type="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} />
                    <input type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} />
                </form>

                {/* value attribute = inital value of the button output, i think for hooks and stuff */}
                <button type='submit' form='registrationForm'>Submit</button>
            </div>

            {/* is it better to have id on the form or have an extra div?  */}
        </>
    )
}

export default RegisterForm