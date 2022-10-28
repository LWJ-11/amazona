import Link from 'next/link';
import React, { useContext } from 'react'
import Layout from '../components/Layout';
import { Store } from '../utils/Store'
import {TrashIcon} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

function CartScreen() {
    const {state, dispatch} = useContext(Store);
    const router = useRouter();
    const {
        cart:{cartItems},
    } = state;

    const removeỈtemHandler = (cartItem) =>{
        dispatch({
            type: 'CART_REMOVE_ITEM',
            payload: cartItem
        });
    };

    const updateCartHandler = (item, qty) =>{
        const quantity = Number(qty);
        dispatch({
            type: 'CART_ADD_ITEM',
            payload:{
                ...item,
                quantity
            }
        });
    };

    const cartItemElement = cartItems.map((cartItem) => {
        return(
            <tr key={cartItem.slug} className="border-b">
                <td>
                    <Link href={`/product/${cartItem.slug}`} legacyBehavior>
                        <a className='flex item-center'>
                            <Image
                                src={cartItem.image}
                                alt={cartItem.name}
                                width={50}
                                height={50}
                            >
                            </Image>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {cartItem.name}
                        </a>
                    </Link>
                </td>
                <td className='p-5 text-right'>
                    <select value={cartItem.quantity} onChange={(e) => updateCartHandler(cartItem, e.target.value)}>
                        {[...Array(cartItem.countInStock).keys()].map(x => (
                            <option key={x+1} value={x+1}>
                                {x+1}
                            </option>
                        ))}
                    </select>
                </td>
                <td className='p-5 text-right'>${cartItem.price}</td>
                <td className='p-5 text-center'>
                    <button onClick={()=>removeỈtemHandler(cartItem)}>
                        <TrashIcon className='h-8 w-8 bg-red-600 rounded text-white'></TrashIcon>
                    </button>
                </td>
            </tr>
        )
    })

  return (
    <Layout title="Shopping Cart">
        <h1 className='mb-4 text-xl'>Shopping</h1>
        {
            cartItems.length === 0 ?
            (<div>
                Cart is empty. <Link href="/" legacyBehavior><a className='text-black font-bold'>Go shopping</a></Link>
            </div>)
            : (
                <div className='grid md:grid-cols-4 md:gap-5'>
                    <div className='overflow-x-auto md:col-span-3'>
                        <table className='min-w-full'>
                            <thead className='border-b'>
                                <tr>
                                    <th className='px-5 text-left'>Item</th>
                                    <th className='p-5 text-right'>Quantity</th>
                                    <th className='p-5 text-right'>Price</th>
                                    <th className='p-5'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItemElement}
                            </tbody>
                        </table>
                    </div>
                    <div className='card p-5'>
                        <ul>
                            <li>
                                <div className='pb-3 text-xl'>Subtotal ({cartItems.reduce((a,c) => a + c.quantity, 0)})
                                {' '}
                                : $ {cartItems.reduce((a,c) => a + c.quantity * c.price, 0)}
                                </div>
                            </li>
                            <li>
                                <button 
                                    onClick={() => router.push('login?redirect=/shipping')} 
                                    className='primary-button w-full'>Checkout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            )
        }
    </Layout>
  )
}


export default dynamic(()=>Promise.resolve(CartScreen), {ssr:false})