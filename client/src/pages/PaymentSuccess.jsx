import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets';

const PaymentSuccess = () => {
    const {navigate,setCartItems} = useAppContext()
    useEffect(() => {
        setCartItems({}); 
    }, []);
    const handleViewOrders = () =>{
        navigate('/my_orders')
    }
  return (
    <div className='mt-40 flex flex-col items-center justify-center min-h-[70vh]'>
      <img src={assets.check_ic} alt="check_icon" className='my-4 w-30'/>
      <h1 className='text-3xl font-bold text-green-500 mb-4'>Đặt hàng thành công!</h1>
      <p className='text-lg mb-8'>Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi.</p>
      <button onClick={handleViewOrders} className='px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer'>
        Xem đơn hàng của bạn
      </button>
    </div>
  )
}

export default PaymentSuccess
