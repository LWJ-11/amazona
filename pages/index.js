import React from 'react'
import Layout from '../components/Layout.js'
import ProductItem from '../components/ProductItem.js'
import data from '../utils/data.js'


export default function Home() {
  const productElement = data.products.map(product => {
    return <ProductItem product={product} key={product.slug}></ProductItem>
  })
  console.log(productElement.toString())
  return (
    <Layout title="Home Page">
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {productElement}
      </div>
    </Layout>
  )
}
