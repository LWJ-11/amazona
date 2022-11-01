import Link from 'next/link'
import React from 'react'
import Layout from '../components/Layout'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import bcryptjs from 'bcryptjs'

export default function LoginScreen() {

    const router = useRouter();
    const {redirect} =router.query;
    const { data: session } = useSession();

    useEffect(()=>{
        if(session?.user){
            router.push(redirect || '/')
        }
    },[router, session, redirect]);

    const{
        handleSubmit,
        register,
        formState:{errors},
    } = useForm();

    const submitHandler = async ({email, password}) => {
        try{
            const result = await signIn('credentials',{
                redirect: false,
                email,
                password,
            });
            if(result.error){
                toast.error(result.error);
            }
        } catch(err){
            toast.error(getError(err));
        }
        console.log(email,bcryptjs.hashSync(password))
    }

  return (
    <Layout title="Login">
        <form className='mx-auto max-w-screen-md' onSubmit={handleSubmit(submitHandler)}>
            <h1 className='mb-4 text-xl'>Login</h1>
            <div className='mb-4'>
                <label htmlFor='email'>Email</label>
                <input 
                    {...register('email', {required: 'Please enter email',
                        pattern:{
                            value: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+$/i,
                            message:'Please enter valid email',
                        }
                    })}
                    
                    type='type' 
                    className='w-full' 
                    id='email' 
                    autoFocus
                >    
                </input>
                {errors.email && (
                <div className='text-red-500'>{errors.email.message}</div>
                )}
            </div>
            <div className='mb-4'>
                <label htmlFor='password'>Password</label>
                <input 
                    type='password' 
                    {...register('password',{
                        required:'Please enter password',
                        minLength:{
                            value: 6, 
                            message: 'Password is more than 6 chars'
                        }
                    })}
                    className='w-full' 
                    id='password' 
                    autoFocus
                ></input>
                {errors.password && (
                <div className='text-red-500'>{errors.password.message}</div>
                )}
            </div>
            <div className='mb-4'>
                <button className='primary-button'>Login</button>
            </div>
            <div>
                Don&apos;t have an account? &nbsp; 
                <Link href='register' legacyBehavior>
                    <a className='font-bold'>Register</a>
                    </Link>
            </div>
        </form>
    </Layout>
  )
}
