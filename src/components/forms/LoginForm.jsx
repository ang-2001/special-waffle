import React, { useState } from 'react'
import styles from './index.module.css';
import { InputContainer, InputField, InputLabel, SubmitButton } from '../../utils/styles/index.styled';

const LoginForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')


    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <form className={styles.form} onSubmit={handleSubmit}>
                <InputContainer>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <InputField type="email" id="email" pattern="/.+/g" />
                </InputContainer>
                <InputContainer className={styles.passwordField}>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <InputField type="password" id="password" />
                </InputContainer>
                <SubmitButton className={styles.button}>Login</SubmitButton>
                <div>
                    <span>Don't have an account? </span>
                    <span>Register</span>
                </div>
            </form>
        </>
    )
}

export default LoginForm