import React, { useContext } from 'react'
import Layout from '../components/Layout.js'
import ProductItem from '../components/ProductItem.js'
import data from '../utils/data.js'
import db from '../utils/db.js'
import Product from '../models/Product.js'
import { Store } from '../utils/Store.js'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function Home({products}) {
  const {state, dispatch} = useContext(Store);
  const {cart} = state;
  const addToCartHandler = async (product) =>{
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const {data} = await axios.get(`/api/products/${product._id}`)

    if(data.countInStock<quantity){
      toast.error('Sorry, product is out of stock')
        return;
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

  const productElement = products.map(product => {
    return <ProductItem 
              product={product} 
              key={product.slug}
              addToCartHandler={addToCartHandler}
            ></ProductItem>
  })
  return (
    <Layout title="Home Page">
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {productElement}
      </div>
    </Layout>
  )
}

export async function getServerSideProps(){
  await db.connect();
  const products = await Product.find().lean();
  return{
    props:{
      products: products.map(db.convertDoctoObj)
    }
  }
}
