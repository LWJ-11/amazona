import Cookies from 'js-cookie';
import { Router, useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import CheckoutWizard from '../components/CheckoutWizard'
import Layout from '../components/Layout'
import { Store } from '../utils/Store';

export default function ShippingScreen() {

    const{
        handleSubmit,
        register,
        formState:{errors},
        setValue,
    } = useForm();

    const {state, dispatch} = useContext(Store);
    const {cart} = state;
    const shippingAddress = cart;
    const router = useRouter();

    useEffect(() => {
        setValue('fullname', shippingAddress.fullName);
        setValue('fullname', shippingAddress.address);
        setValue('fullname', shippingAddress.city);
        setValue('fullname', shippingAddress.phonenum);
    }, [setValue, shippingAddress]);

    const submitHandler = ({fullName, address, city, phonenum,}) =>{
        dispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload:{fullName, address, city, phonenum,},
        });
        Cookies.set(
            'cart',
            JSON.stringify({
                ...cart,
                shippingAddress:{
                    fullName,
                    address,
                    city,
                    phonenum,
                },
            })
        );
        router.push('/payment');
    };

  return (
    <Layout title = "Shipping Address">
        <CheckoutWizard activeStep={1}/>
        <form
            className='mx-auto max-w-screen-md'
            onSubmit={handleSubmit(submitHandler)}
        >
            <h1 className='mb-4 text-xl'>
                Shipping Address
            </h1>
            <div className='mb-4'>
                <label htmlFor='fullName'>Full Name</label>
                <input
                    className='w-full'
                    id="fullName"
                    autoFocus
                    {...register('fullName',{
                        required: 'Please enter full name',
                    })}
                />
                {errors.fullName &&(
                    <div className='text-red-500'>{errors.fullName.message}</div>
                )}
            </div>
            <div className='mb-4'>
                <label htmlFor='phonenum'>Phone Number</label>
                <input
                    className='w-full'
                    id="phonenum"
                    autoFocus
                    {...register('phonenum',{
                        required: 'Please enter phone number',
                        minLength:{value: 10, message:'Phone number is more than 10  chars'}
                    })}
                />
                {errors.phonenum &&(
                    <div className='text-red-500'>{errors.phonenum.message}</div>
                )}
            </div>
            <div className='mb-4'>
                <label htmlFor='address'>Address</label>
                <input
                    className='w-full'
                    id="address"
                    autoFocus
                    {...register('address',{
                        required: 'Please enter address',
                        minLength:{value: 3, message:'Address is more than 3 chars'}
                    })}
                />
                {errors.address &&(
                    <div className='text-red-500'>{errors.address.message}</div>
                )}
            </div>
            <div className='mb-4'>
                <label htmlFor='city'>City</label>
                <input
                    className='w-full'
                    id="city"
                    autoFocus
                    {...register('city',{
                        required: 'Please enter city',
                    })}
                />
                {errors.city &&(
                    <div className='text-red-500'>{errors.city.message}</div>
                )}
            </div>
            <div className='mb-4 flex justify-between'>
                    <button className='primary-button'>Next</button>
            </div>
        </form>
    </Layout>
  )
}


ShippingScreen.auth = true;