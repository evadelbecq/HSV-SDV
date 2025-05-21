'use client';

import React from 'react'
import { useAuth } from '@/lib/client/hooks/useAuth'


const Login = () => {
  const auth = useAuth();
  
  const handleLogin = async (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    await auth.login(email, password);
  };
  
  return (
    <div>
      <h1>Login</h1>
      <form className='flex flex-col gap-4' action={handleLogin} >
        <div className='flex flex-col'>
          <label htmlFor="email">Email</label>
          <input type="text" id="email" name="email" required />
        </div>
        <div className='flex flex-col'>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required/>
        </div>
        <button type="submit">Login</button>
        </form>
    </div>
  )
}

export default Login
