import Link from 'next/link';
import { useRouter } from 'next/router'
import React,{useContext} from 'react'
import Layout from '../../components/Layout'
import Image from 'next/image';
import { Store } from '../../utils/Store';
import db from '../../utils/db';
import Product from '../../models/Product';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ProductScreen(props) {
    const {product} = props;
    const {state, dispatch} = useContext(Store)
    const router = useRouter();
    if(!product){
        return <div title='Product not found'><h1 className='text-amber-500 font-bold text-3xl flex mt-72 justify-center h-screen'>Product Not Found</h1></div>
    }

    const addToCartHandler = async () =>{
        const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const {data} = await axios.get(`/api/products/${product._id}`)

        if(data.countInStock<quantity){
            return toast.error('Sorry. Product is out of stock')
        } 
        dispatch({
            type: 'CART_ADD_ITEM',
            payload:{
                ...product,
                quantity
            }
        });
        toast.success('Product added to cart')
    };
  return (
    <div>
        <Layout title={product.name}>
            <div className='py-2'>
                <Link href="/">Back to product</Link>
            </div>
            <div className='grid md:grid-cols-4 md:gap-3'>
                <div className='md:col-span-2'>
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={640}
                        height={640}
                        layout = "responsive"
                    ></Image>
                </div>
                <div>
                    <ul>
                        <li>
                            <h1 className='text-lg'>{product.name}</h1>
                        </li>
                        <li>Category: {product.category}</li>
                        <li>Brand: {product.brand}</li>
                        <li>Rating: {product.rating} of {product.numReviews} reviews</li>
                        <li>Description: {product.description}</li>
                    </ul>
                </div>
                <div className='p-5 card h-fit'>
                    <div className=' mb-2 flex justify-between'>
                        <div>Price</div>
                        <div>${product.price}</div>
                    </div>
                    <div className='mb-2 flex justify-between'>
                        <div>Status</div>
                        <div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
                    </div>
                    <button className='primary-button w-full' onClick={addToCartHandler}>Add to cart</button>
                </div>
            </div>
        </Layout>
    </div>
  )
}

export async function getServerSideProps(context){
    const {params} = context;
    const {slug} = params;

    await db.connect();
    const product = await Product.findOne({slug}).lean();
    await db.disconnect();
    return {
        props:{
            product: product? db.convertDoctoObj(product) : null,
        }
    }
}