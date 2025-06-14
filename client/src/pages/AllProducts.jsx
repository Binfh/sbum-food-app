import React, { useEffect, useState } from 'react'
import ProductsCard from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';

const AllProducts = () => {
    const { products, searchQuery, setSearchQuery } = useAppContext();
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const removeVietnameseTones = (str) => {
            return str
                .normalize("NFD") // Tách các ký tự có dấu thành ký tự cơ bản và dấu
                .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
                .replace(/đ/g, "d") // Thay thế "đ" thành "d"
                .replace(/Đ/g, "D") // Thay thế "Đ" thành "D"
                .toLowerCase(); // Chuyển về chữ thường
        };

        if (searchQuery.length > 0) {
            setFilteredProducts(
                products.filter((product) =>
                    removeVietnameseTones(product.name).includes(removeVietnameseTones(searchQuery))
                )
            );
        } else {
            setFilteredProducts(products);
        }
    }, [products, searchQuery])

    return (
        <div className='flex flex-col mt-40 px-6 md:px-16 lg:px-24 xl:px-32'>
            <div className='flex flex-col items-end w-max'>
                <p className='text-2xl font-medium uppercase'>Tất cả món ăn</p>
            </div>

            {filteredProducts.length > 0 ? (
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mt-6'>
                    {filteredProducts.map((prd, idx) => (
                        <ProductsCard key={idx} product={prd} />
                    ))}
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center mt-12 py-8'>
                    <div className='text-gray-400 text-6xl mb-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            <line x1="11" y1="8" x2="11" y2="14"></line>
                            <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                    </div>
                    <h3 className='text-xl font-medium text-gray-800'>Không tìm thấy kết quả</h3>
                    <p className='text-gray-500 mt-2 mb-6 text-center'>
                        Không có món ăn nào phù hợp với từ khóa "{typeof searchQuery === 'string' ? searchQuery : ''}"
                    </p>
                    <button 
                        onClick={() => setSearchQuery('')}
                        className='px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors cursor-pointer'
                    >
                        Xóa tìm kiếm
                    </button>
                </div>
            )}
        </div>
    )
}

export default AllProducts