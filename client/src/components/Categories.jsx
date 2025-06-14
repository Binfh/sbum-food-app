import React from 'react'
import { categories } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Categories = () => {
    const {navigate} = useAppContext();

  return (
    <div className='mt-16 px-6 md:px-16 lg:px-24 xl:px-32'>
        <p className='text-2xl md:text-3xl font-medium'>Danh mục món ăn</p>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-6 mt-6'>
            {categories.map((category,idx) => (
                <div key={idx} 
                    className='group cursor-pointer py-3 px-3 gap-2 rounded-lg flex flex-col items-center justify-center '
                    style={{backgroundColor: category.bgColor}}
                    onClick={() => {
                        navigate(`/products/${category.path.toLowerCase()}`);
                        scrollTo(0, 0);
                    }}
                >
                    <img className='group-hover:scale-108 transition max-w-28' src={category.image} alt={categories.text} />
                    <p className='text-sm font-medium'>{category.text}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Categories