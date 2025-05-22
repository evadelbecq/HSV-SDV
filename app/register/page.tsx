'use client';

import React from 'react'
import api from '@/lib/client/api';


    
const Register = () => {
    const handleRegister = async (formData: FormData) => {
        const first_name = formData.get('first_name') as string;
        const last_name = formData.get('last_name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const password = formData.get('password') as string;
        
        await api.register({ first_name, last_name, email, phone, password });
        }
  return (
    <div>
      <form action={handleRegister}>
        <div className='flex flex-col'>
          <label htmlFor="first_name">First Name</label>
          <input type="text" id="first_name" name="first_name" required />
        </div>
        <div className='flex flex-col'>
          <label htmlFor="last_name">Last Name</label>
          <input type="text" id="last_name" name="last_name" required />
        </div>
        <div className='flex flex-col'>
          <label htmlFor="email">Email</label>
          <input type="text" id="email" name="email" required />
        </div>
        <div className='flex flex-col'>
            <label htmlFor="phone">Phone</label>
            <input type="text" id="phone" name="phone" required />
        </div>
        <div className='flex flex-col'>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required/>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register
