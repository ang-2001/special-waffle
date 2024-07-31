import React, { useState } from 'react'
import styles from './index.module.css';
import { InputContainer, InputField, InputLabel, SubmitButton } from '../../utils/styles/index.styled';
import { Link } from 'react-router-dom';

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
                    <InputField type="email" id="email" />
                </InputContainer>
                <InputContainer className={styles.passwordField}>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <InputField type="password" id="password" />
                </InputContainer>
                <SubmitButton className={styles.button}>Login</SubmitButton>
                <div>
                    <span>Don't have an account? </span>
                    <Link className={styles.pageLink} to="../register">
                        <span>
                            Register
                        </span>
                    </Link>
                </div>
            </form>
        </>
    )
}

export default LoginForm