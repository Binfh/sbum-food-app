import React from 'react'
import ProductsCard from './ProductCard'
import { useAppContext } from '../context/AppContext';


const BestSeller = () => {
  const {products} = useAppContext();
  return (
    <div className='mt-16 px-6 md:px-16 lg:px-24 xl:px-32'>
        <p className='text-2xl md:text-3xl font-medium'>Bán chạy nhất</p>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mt-6'>
          {products.slice(0,4).map((product,idx) => (
            <ProductsCard key={idx} product={product}/>
          ))} 
        </div>
    </div>
  )
}

export default BestSeller