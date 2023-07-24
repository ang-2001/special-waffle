import { useState } from 'react'
import { InputContainer, InputLabel, InputField, SubmitButton } from '../../utils/styles/index.styled';
import styles from './index.module.css';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pwdConfirmation, setConfirmation] = useState('');

    return (
        <>  
        {/* form for creating an account */}
            <form className={styles.form}>
                <InputContainer>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <InputField type="email" id="email" />
                </InputContainer>
                <section className={styles.nameFieldRow}>
                    <InputContainer>
                        <InputLabel htmlFor="firstName">First Name</InputLabel>
                        <InputField type="text" id="email" />
                    </InputContainer>
                    <InputContainer>
                        <InputLabel htmlFor="lastName">Last Name</InputLabel>
                        <InputField type="text" id="lastName" />
                    </InputContainer>
                </section>
                <InputContainer>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <InputField type="password" id="password" />
                </InputContainer>
                <SubmitButton className={styles.button}>Create My Account</SubmitButton>
            </form>

            
            {/* value attribute = inital value of the button output */}
        </>
    )
}

export default RegisterForm