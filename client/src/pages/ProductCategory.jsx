import React from 'react'
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductsCard from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';

const ProductCategory = () => {
    const {products} = useAppContext();
    const {category} = useParams();

    const searchCategory = categories.find((item) => item.path.toLowerCase() === category);

    const filteredProducts = products.filter((item) => item.category.toLowerCase() === category);

  return (
    <div className='mt-40 px-6 md:px-16 lg:px-24 xl:px-32'>       
        {searchCategory && (
            <div className='flex flex-col items-end w-max'>
                <p className='text-2xl font-medium'>{searchCategory.text.toUpperCase()}</p>
            </div>
        )}
        {filteredProducts.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mt-6'>
                {filteredProducts.map((prd) =>(
                    <ProductsCard key={prd._id} product={prd} />
                )) }
            </div>
        ) :(
            <div className='flex items-center justify-center h-[60vh] '>
                <p className='text-lg font-medium text-primary'>Không có sản phẩm nào trong danh mục này</p>
            </div>
        )}
    </div>
  )
}

export default ProductCategory