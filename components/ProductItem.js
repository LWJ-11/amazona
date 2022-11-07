import Link from 'next/link';
import React,{useContext} from 'react';
import Router, { useRouter } from 'next/router'
import { Store } from '../utils/Store';

export default function ProductItem({product, addToCartHandler}) {
  return (
    <div className="card">
        <Link href={`./product/${product.slug}`} legacyBehavior>
            <a>
                <img
                    src={product.image}
                    alt={product.name}
                    className="rounded product-image"
                />
            </a>
        </Link>
        <div className="flex flex-col items-center justify-center p-5">
            <Link href={`./product/${product.slug}`} legacyBehavior>
                <a>
                    <h2 className='text-lg'>{product.name}</h2>
                </a>
            </Link>
            <p className="mb-2">{product.brand}</p>
            <p>${product.price}</p>
            <button 
                className="primary-button" 
                type='button'
                onClick={() => addToCartHandler(product)}
            >
                Add to cart
            </button>
        </div>
    </div>
  )
}
