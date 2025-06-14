import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { assets, formatVND } from '../assets/assets';

const ProductsCard = ({product}) => {
    const {currency, addToCart, removeFromCart, cartItems, navigate} = useAppContext();

    const [isHovered, setIsHovered] = useState(false);
   
    return product && (
        <div
            onClick={() => {navigate(`/products/${product.category.toLowerCase()}/${product._id}`);scrollTo(0,0)}}
            className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white w-full relative group"
        >
            {!product.inStock && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium z-10"
                >
                    Hết hàng
                </motion.div>
            )}
            
            <div className="cursor-pointer flex items-center justify-center px-2">
                <div className="relative h-48 w-full flex items-center justify-center">
                    <img 
                        className={`group-hover:scale-105 transition object-contain w-full h-full max-h-44 ${!product.inStock ? 'opacity-50' : ''}`} 
                        src={product.image} 
                        alt={product.name} 
                    />
                    {!product.inStock && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                        </motion.div>
                    )}
                </div>
            </div>
            
            <div className="text-gray-500/60 text-sm">
                <p>{product.category}</p>
                <p className="text-gray-700 cursor-pointer font-medium text-lg truncate w-full">{product.name}</p>
                {product.offerPrice && (
                <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium z-10">
                    Giảm giá
                </div>
                )}

                <div className="flex flex-wrap items-end justify-between mt-3">
                    {product.offerPrice ? (
                        <p className="md:text-md text-base font-medium text-black/65">
                        {formatVND(product.offerPrice)}{currency}
                        <span className="text-gray-500/60 md:text-sm block text-xs line-through">
                            {formatVND(product.price)}{currency}
                        </span>
                        </p>
                    ) : (
                        <p className="md:text-md text-base font-medium text-black/80">
                        {formatVND(product.price)}{currency}
                        </p>
                    )}
                    <div onClick={(e) => {e.stopPropagation()}} className="text-primary">
                        { !cartItems[product._id] ? (
                            <motion.button
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                transition={{ duration: 0.4 }}
                                className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[100px] 
                                w-[84px] h-[44px] rounded text-primary cursor-pointer"
                                onClick={async () => await addToCart(product._id)}
                            >
                                <motion.span
                                    animate={isHovered ? { rotate: [0, -8, 8, -8, 8, 0] } : { rotate: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <box-icon color="#EF5350" name="cart"></box-icon>
                                </motion.span>
                                <motion.span
                                    animate={isHovered ? { rotate: [0, 8, -8, 8, -8, 0] } : { rotate: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="font-medium"
                                >
                                    Đặt hàng 
                                </motion.span>
                            </motion.button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                                <button onClick={async () => {await removeFromCart(product._id)}} className="cursor-pointer text-lg px-2 h-full" >
                                    -
                                </button>
                                <span className="w-5 text-center">{cartItems[product._id]}</span>
                                <button onClick={async () => {await addToCart(product._id)}} className="cursor-pointer text-lg px-2 h-full" >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductsCard