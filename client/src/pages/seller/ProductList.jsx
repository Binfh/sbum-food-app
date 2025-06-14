import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import { formatVND } from '../../assets/assets';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion'

const ProductList = () => {
    const { products, currency, updateProductStock, axios, navigate, cartItems, setCartItems } = useAppContext();
    const [deleteId, setDeleteId] = useState(null);
    const [showDel, setShowDel] = useState(false);
    
    // State search riêng cho admin
    const [adminSearchQuery, setAdminSearchQuery] = useState('');
    
    // State để theo dõi sản phẩm đang cập nhật và tránh double-click
    const [updatingProducts, setUpdatingProducts] = useState({});
    // Ref để theo dõi timeout debounce
    const debounceTimers = useRef({});

    // Lọc sản phẩm dựa trên admin search query
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(adminSearchQuery.toLowerCase())
    );

    // Debounced function để xử lý toggle stock
    const toggleStock = useCallback((id, inStock) => {
        // Nếu đang cập nhật, không làm gì cả
        if (updatingProducts[id]) return;

        // Đánh dấu sản phẩm đang cập nhật
        setUpdatingProducts(prev => ({ ...prev, [id]: true }));
        
        // Xóa timer cũ nếu có
        if (debounceTimers.current[id]) {
            clearTimeout(debounceTimers.current[id]);
        }

        // Tạo timer mới với debounce 300ms
        debounceTimers.current[id] = setTimeout(async () => {
            try {
                // Gọi hàm cập nhật từ context
                await updateProductStock(id, inStock);
            } finally {
                // Xóa trạng thái đang cập nhật sau khi hoàn thành
                setUpdatingProducts(prev => ({ ...prev, [id]: false }));
                // Xóa timer sau khi hoàn thành
                delete debounceTimers.current[id];
            }
        }, 300);
    }, [updatingProducts, updateProductStock]);

    const handleDelete = async (id) => {
        try {
            const { data } = await axios.delete(`/api/product/delete/${id}`);
            if (data.success) {
                // Cập nhật danh sách sản phẩm trực tiếp
                products.filter(product => product._id !== id);
                
                // Xóa sản phẩm khỏi giỏ hàng nếu có
                if (cartItems[id]) {
                    const updatedCart = {...cartItems};
                    delete updatedCart[id];
                    setCartItems(updatedCart);
                }
                
                toast.success(data.message || 'Xóa món ăn thành công');
            } else {
                toast.error(data.message || 'Xóa món ăn thất bại');
            }
        } catch (error) {
            toast.error('Lỗi khi xóa món ăn');
        }
    };

    return (
        <div className="no-scrollbar overflow-y-scroll flex flex-col flex-1 h-[95vh] justify-between">
            <div className="w-full md:p-10 p-4">
                <div className='flex items-center justify-between'>
                    <h2 className="pb-4 text-lg font-medium">
                        Tất cả món ăn 
                        {adminSearchQuery && (
                            <span className="text-sm text-gray-500 ml-2">
                                ({filteredProducts.length} kết quả)
                            </span>
                        )}
                    </h2>
                    <div className="px-5 pb-4">
                        <div className="flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full w-full">
                            <input
                                onChange={(e) => setAdminSearchQuery(e.target.value)}
                                value={adminSearchQuery}
                                className="py-1.5 w-full font-roboto bg-transparent outline-none placeholder-gray-500 text-black"
                                type="text"
                                placeholder="Tìm kiếm món ăn (Admin)"
                            />
                            <box-icon className="w-4 h-4" color="black" name='search'></box-icon>
                        </div>
                        {adminSearchQuery && (
                            <button 
                                onClick={() => setAdminSearchQuery('')}
                                className="text-xs text-gray-500 hover:text-gray-700 mt-1"
                            >
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                </div>
               
                <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    <table className="md:table-auto table-fixed w-full overflow-hidden">
                        <thead className="text-gray-900 text-sm text-left">
                            <tr>
                                <th className="px-4 py-3 font-semibold truncate">Món ăn</th>
                                <th className="px-4 py-3 font-semibold truncate">Danh mục</th>
                                <th className="px-4 py-3 font-semibold truncate ">Giá bán</th>
                                <th className="px-4 py-3 font-semibold truncate">Trạng thái còn món</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-500">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product._id} className="border-t border-gray-500/20">
                                        <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                            <div className="border border-gray-300 rounded p-2">
                                                <img src={product.image} alt="Product" className="w-16" />
                                            </div>
                                            <span className="truncate max-sm:hidden w-full">{product.name}</span>
                                        </td>
                                        <td className="px-4 py-3">{product.category}</td>
                                        <td className="px-4 py-3 max-sm:hidden">{product.offerPrice ? formatVND(product.offerPrice) : formatVND(product.price)}{currency}</td>
                                        <td className="px-4 py-3">
                                            <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                                <input 
                                                    onChange={() => toggleStock(product._id, !product.inStock)}
                                                    checked={product.inStock}
                                                    disabled={updatingProducts[product._id]}
                                                    type="checkbox" 
                                                    className="sr-only peer"  
                                                />
                                                <div className={`w-12 h-7 rounded-full transition-colors duration-200
                                                    ${updatingProducts[product._id] 
                                                        ? 'bg-gray-400' 
                                                        : product.inStock 
                                                            ? 'bg-blue-600' 
                                                            : 'bg-slate-300'
                                                    }`}>
                                                    <span className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform 
                                                        duration-200 ease-in-out ${product.inStock ? 'translate-x-5' : ''}`}>
                                                    </span>
                                                </div>
                                                {updatingProducts[product._id] && 
                                                    <span className="ml-2 text-xs text-gray-500">Đang cập nhật...</span>
                                                }
                                            </label>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button 
                                                className="text-blue-500 hover:underline cursor-pointer"
                                                onClick={() => navigate('/seller', { state: { product } })}
                                            >Sửa</button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button 
                                                className="text-red-500 hover:underline cursor-pointer"
                                                onClick={() => {
                                                    setShowDel(true)
                                                    setDeleteId(product._id)
                                                }}
                                            >Xóa</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                        {adminSearchQuery 
                                            ? `Không tìm thấy món ăn nào với từ khóa "${adminSearchQuery}"`
                                            : "Không có món ăn nào"
                                        }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {showDel && (
                        <div
                            onClick={() => setShowDel(false)}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <motion.div
                                initial={{scale: 0.5, opacity: 0}}
                                animate={{scale: 1, opacity: 1}}
                                transition={{duration: 0.5, ease: "easeInOut"}}
                                onClick={(e) => e.stopPropagation()}
                                className="flex flex-col items-center justify-center bg-white shadow-md rounded-xl py-6 px-5 md:w-[460px] w-[370px] border border-gray-300">
                                <div className="flex items-center justify-center p-4 bg-red-100 rounded-full">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.875 5.75h1.917m0 0h15.333m-15.333 0v13.417a1.917 1.917 0 0 0 1.916 1.916h9.584a1.917 1.917 0 0 0 1.916-1.916V5.75m-10.541 0V3.833a1.917 1.917 0 0 1 1.916-1.916h3.834a1.917 1.917 0 0 1 1.916 1.916V5.75m-5.75 4.792v5.75m3.834-5.75v5.75" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <h2 className="text-gray-900 font-semibold text-center mt-4 text-xl">Bạn có chắc chắn muốn xóa món ăn này không?</h2>
                                <div className="flex items-center justify-center gap-4 mt-5 w-full">
                                    <button onClick={() => setShowDel(false)} type="button" className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium cursor-pointer text-sm hover:bg-gray-100 active:scale-95 transition">
                                    Hủy
                                    </button>
                                    <button
                                    type="button"
                                    onClick={() => {
                                        handleDelete(deleteId);
                                        setShowDel(false);
                                    }}
                                    className="w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm cursor-pointer hover:bg-red-700 active:scale-95 transition"
                                    >
                                    Xác nhận
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;