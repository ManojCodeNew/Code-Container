import React from 'react';
import './Login.css';

export default function Login() {
    return (
        <div className='Login-container'>
            <h1>Login</h1>
            <form action="" method="post">
                <label for="email">Email :</label>
                <input type="email" name="email" id="" /><br />
            
                <label for="password">Password :</label>
                <input type="pwd" name="password" id="" /><br />

                <button type="submit">Login
                </button>
            </form>
        </div>
    )
}
