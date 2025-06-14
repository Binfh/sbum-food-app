import React, { use, useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets, formatVND } from '../assets/assets'
import toast from 'react-hot-toast';
import { motion } from 'framer-motion'
import {PulseLoader} from 'react-spinners'

const Cart = () => {
    
    const {products,currency,cartItems,deleteFromCart,getCartCount,updateToCart,navigate,getCartAmount,axios,user,setCartItems,setUser} = useAppContext();
    
    const [cartArray,setCartArray] = useState([])
    const [addresses,setAddresses] = useState([]);
    const [selectedAddress,setSelectedAddress] = useState(null);
    const [paymentOption,setPaymentOption] = useState('COD');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const [showAddress, setShowAddress] = useState(false)
    const [productToDelete, setProductToDelete] = useState(null);
    const [productToDeleteInfo, setProductToDeleteInfo] = useState(null);

    const getCart = () => {
        let tempArray = [];
        for(const key in cartItems){
            const product = products.find((item) => item._id === key);
            if(product) {
                product.quantity = cartItems[key];
                tempArray.push(product);
            } else {
                deleteFromCart(key);
            }
        }
        setCartArray(tempArray);
    }

    const getUserAddress = async () =>{
        try {
            const {data} = await axios.get('/api/address/get');
            if(data.success){
                setAddresses(data.addresses)
                if(data.addresses.length > 0){
                    setSelectedAddress(data.addresses[0])
                }
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            
        }
    }

    const placeOrder = async() => {
        try {
            if(!selectedAddress){
                return toast.error("Vui lòng điền địa chỉ giao hàng")
            }

            setIsProcessingPayment(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            if(paymentOption === "COD"){
                const {data} = await axios.post('/api/order/cod',{
                    userId:user._id,
                    items:cartArray.map(item => ({product:item._id,quantity:item.quantity})),
                    address:selectedAddress._id
                })

                if(data.success){
                    toast.success(data.message)
                    
                    // Clear cart both frontend and backend
                    setCartItems({})
                    
                    // Update user context to ensure consistency
                    const updatedUser = {...user, cartItems: {}};
                    setUser(updatedUser);
                    
                    navigate('/payment-success')
                }else{
                    toast.error(data.message)
                }
            }else{
                const {data} = await axios.post('/api/order/vnpay',{
                    userId:user._id,
                    items:cartArray.map(item => ({product:item._id,quantity:item.quantity})),
                    address:selectedAddress._id
                })

                if(data.success){
                    // For VNPay, cart will be cleared in the return handler
                    // but we should also clear frontend state to be safe
                    setCartItems({})
                    const updatedUser = {...user, cartItems: {}};
                    setUser(updatedUser);
                    
                    window.location.replace(data.url)
                }else{
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsProcessingPayment(false);
        }
    }

    useEffect(() => {
        if (products.length > 0 && cartItems) {
            getCart();
        }
    },[products,cartItems])


    useEffect(() =>{
        if(user){
            getUserAddress();
        }
    },[user])

    const hasOutOfStock = cartArray.some(item => !item.inStock);


    return products.length > 0 && Object.keys(cartItems).length > 0 ? (
        <div className="flex flex-col md:flex-row mt-40 px-6 md:px-16 lg:px-24 xl:px-32">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Giỏ hàng <span className="text-sm text-primary">({getCartCount()} món)</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Món ăn</p>
                    <p className="text-center">Giá</p>
                    <p className="text-center">Xử lý</p>
                </div>

                <div className='h-[calc(100vh-100px)] overflow-y-auto'>
                    {cartArray.map((product, index) => (
                        <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                            <div className="flex items-center md:gap-6 gap-3">
                                <div
                                    onClick={() => {navigate(`/products/${product.category.toLowerCase()}/${product._id}`);scrollTo(0,0)}}
                                    className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                    <img className="max-w-full h-full object-cover p-1" src={product.image} alt={product.name} />
                                </div>
                                <div>
                                    <p className="hidden md:block font-semibold">{product.name}</p>
                                    <div className="font-normal text-gray-500/70">
                                        <div className='flex items-center'>
                                            <p>Số lượng:</p>
                                            <select 
                                                onChange={e => updateToCart(product._id,Number(e.target.value))}
                                                value={cartItems[product._id]}
                                                className='outline-none'>
                                                {Array(cartItems[product._id] > 9 ? cartItems[product._id] : 9).fill('').map((_, index) => (
                                                    <option key={index} value={index + 1}>{index + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {product.offerPrice ? (
                                <p className="text-center">{formatVND(product.offerPrice * product.quantity)} {currency}</p>)
                                : (
                                <p className="text-center">{formatVND(product.price * product.quantity)} {currency}</p>)
                            }
                            <button
                                onClick={() => {
                                    setProductToDelete(product._id);
                                    setProductToDeleteInfo(product);
                                }}
                                className="cursor-pointer mx-auto">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0" stroke="#FF532E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            {productToDelete && productToDeleteInfo &&(
                                <div
                                    onClick={() => {
                                        setProductToDelete(null);
                                        setProductToDeleteInfo(null);
                                    }}
                                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
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
                                        <h2 className="text-gray-900 font-semibold text-center mt-4 text-xl">Bạn chắc chắn muốn xóa món "<strong>{productToDeleteInfo.name}</strong>" khỏi giỏ hàng?</h2>
                                        <p className="text-sm text-gray-600 mt-2 text-center">
                                            Hành động này không thể hoàn tác. <br /> Bạn có chắc chắn muốn tiếp tục?
                                        </p>
                                        <div className="flex items-center justify-center gap-4 mt-5 w-full">
                                            <button onClick={() => {
                                                setProductToDelete(null);
                                                setProductToDeleteInfo(null);
                                            }} type="button" className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium cursor-pointer text-sm hover:bg-gray-100 active:scale-95 transition">
                                            Hủy
                                            </button>
                                            <button
                                            type="button"
                                            onClick={async () => {
                                                await deleteFromCart(productToDelete);
                                                setProductToDelete(null);
                                                setProductToDeleteInfo(null);
                                            }}
                                            className="w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm cursor-pointer hover:bg-red-700 active:scale-95 transition"
                                            >
                                            Xác nhận
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                                )}
                        </div>)
                    )}
                </div>

                <button
                    onClick={() => {navigate('/products');scrollTo(0,0)}}
                    className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium">
                    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1" stroke="#615fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Tiếp tục mua sắm
                </button>

            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Tóm tắt đơn hàng</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Địa chỉ giao hàng</p>
                    <div className="relative flex justify-between items-start mt-2">
                        {user ? (
                            <p className="text-gray-500">
                                {selectedAddress ? (
                                    <>
                                        {selectedAddress.street}, {selectedAddress.state}, {selectedAddress.city}
                                        <br />
                                        <span className="flex items-center justify-between">
                                            Số điện thoại: <span className='pl-2'>{selectedAddress.phone}</span>
                                        </span>
                                    </>
                                ) : (
                                    'Chưa có địa chỉ'
                                )}
                            </p>
                        ) : (
                            <p className="text-gray-500">
                                Vui lòng đăng nhập để thêm địa chỉ giao hàng
                            </p>
                        )}

                        <button 
                            onClick={() => {
                                if(!user) {
                                    toast.error("Vui lòng đăng nhập trước");
                                    navigate('/login');
                                    return;
                                }
                                setShowAddress(!showAddress);
                            }} 
                            className="text-primary hover:underline cursor-pointer">
                            {user ? 'Thay đổi' : ''}
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                                {addresses.map((address,idx) => (
                                    <p key={idx} onClick={() => {setSelectedAddress(address);setShowAddress(false)}} className="text-gray-500 p-5 hover:bg-gray-100">
                                        <span>{address.street},{address.city},{address.state},{address.country}</span>
                                        <br />
                                        <span className='text-gray-500 text-sm'>{address.phone}</span>
                                    </p>
                                ))}
                                <p onClick={() => navigate('/add-address')} className="text-primary-500 text-center cursor-pointer p-5 hover:bg-primary/10 border border-t-gray-500 border-transparent">
                                    Thêm địa chỉ
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Phương thức thanh toán</p>

                    <div className="space-y-4 mt-4">
                        <label className="flex items-center gap-3 cursor-pointer border border-gray-300 p-3 rounded-md">
                            <input
                            type="radio"
                            name="payment"
                            value="COD"
                            checked={paymentOption === 'COD'}
                            onChange={(e) => setPaymentOption(e.target.value)}
                            />
                            <span>Thanh toán khi nhận hàng</span>
                            <img src={assets.cod} alt="cod" className="w-6 h-6" />
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer border border-gray-300 p-3 rounded-md">
                            <input
                            type="radio"
                            name="payment"
                            value="Online"
                            checked={paymentOption === 'Online'}
                            onChange={(e) => setPaymentOption(e.target.value)}
                            />
                            <span>Thanh toán qua VNPAY</span>
                            <img src={assets.logo_vnpay} alt="VNPAY" className="w-6 h-6" />
                        </label>
                    </div>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                    <span>Giá món</span><span>{formatVND(getCartAmount())}{currency}</span>
                    </p>
                    <p className="flex justify-between">
                    <span>Phí vận chuyển</span><span className="text-green-600">Miễn phí</span>
                    </p>
                    <p className="flex justify-between">
                    <span>Thuế (2%)</span><span>{formatVND(getCartAmount() * 2 / 100)}{currency}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                    <span>Tổng cộng:</span><span>{formatVND(getCartAmount() + getCartAmount() * 2 / 100)}{currency}</span>
                    </p>
                </div>

                {hasOutOfStock ? 
                    (<button className="w-full py-3 mt-6 cursor-not-allowed bg-gray-300 text-gray-600 font-medium transition flex items-center px-2 gap-1" disabled>
                        <img src={assets.ic_cry} alt="" className='w-5' />
                        <span className="font-medium">Giỏ hàng có món đã hết,hẹn gặp quý khách vào ngày mai</span>
                    </button>) 
                    : (<button onClick={placeOrder}
                        disabled={isProcessingPayment}
                        className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary/60 transition disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2">
                        {isProcessingPayment ? (
                            <PulseLoader color="#ffffff" size={8} />
                        ) :
                        (paymentOption === 'COD' ? 'Thanh toán khi nhận hàng' : 'Thanh toán qua VNPAY')}
                    </button>)
                }
            </div>

        </div>
        ) : (
            <div className="min-h-screen flex justify-center items-center">
                <div className="text-center p-6">
                    <img src={assets.empty_cart} className='w-16 h-16 mx-auto'/>
                    <p className="text-lg font-medium text-gray-600 mt-4">Giỏ hàng của bạn hiện tại trống.</p>
                    <p className="text-sm text-gray-500 mt-2">Hãy thêm món ăn vào giỏ hàng để bắt đầu mua sắm.</p>
                    <div className="mt-8">
                        <button
                            onClick={() => navigate('/products')}
                            className="px-6 cursor-pointer py-3 bg-blue-600 text-white font-semibold text-sm uppercase rounded-md hover:bg-blue-700 "
                        >
                            Quay lại thực đơn
                        </button>
                    </div>
                </div>
            </div>
        )
}

export default Cart