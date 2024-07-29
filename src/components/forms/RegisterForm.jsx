import { useState } from 'react'
import { InputContainer, InputLabel, InputField, SubmitButton } from '../../utils/styles/index.styled';
import styles from './index.module.css';

// component for regsiter form(page wraps arond this component)
const RegisterForm = () => {

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <>  
        {/* form for creating an account */}
            <form className={styles.form} onSubmit={handleSubmit}>
                <InputContainer>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <InputField type="email" id="email" />
                </InputContainer>
                <section className={styles.nameFieldRow}>
                    <InputContainer>
                        <InputLabel htmlFor="firstName">First Name</InputLabel>
                        <InputField type="text" id="firstName" />
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
                <div> 
                    <span>Already have an account? </span>
                    <span>Login</span>
                </div>
            </form>

            {/* value attribute = inital value of the button output */}
        </>
    )
}

export default RegisterForm