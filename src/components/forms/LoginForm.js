import React, { useState } from 'react'

const LoginForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const []

    return (
        <div className="FormWrapper">
            <form action="onSubmit" id="LoginForm">
                <label></label>

                <input type="text" name="" id="" />
                <input type="password" name="" id="" />
                <input type="checkbox" name="" id="" />
            </form>

            <button type="submit" form="LoginForm"></button>
        </div>
  )
}

export default LoginForm