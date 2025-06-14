import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext';
import {  formatVND } from '../assets/assets';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion'

const MyOrder = () => {
    const [myOrders, setMyOrders] = useState([]);
    const {currency,axios,user} = useAppContext();
    // Thay đổi: Lưu orderId thay vì boolean
    const [orderToCancel, setOrderToCancel] = useState(null)

    useEffect(() => {
        let interval;
        const fetchMyOrders = async () => {
            try {
                const { data } = await axios.get('/api/order/user');
                if (data.success) {
                    setMyOrders(data.orders);
                }
            } catch (error) {
                console.log(error);
            }
        };
    
        if (user) {
            fetchMyOrders(); 
            interval = setInterval(fetchMyOrders, 5000); 
        }
    
        return () => clearInterval(interval);
    }, [user]);

    const handleCancelOrder = async (orderId, isPaid) => {
        try {
            const { data } = await axios.put(`/api/order/${orderId}`, { status: 'Đã hủy đơn' });
            if (data.success) {
                setMyOrders(prevOrders => prevOrders.map(order => 
                    order._id === orderId ? {...order, status: 'Đã hủy đơn'} : order
                ));
                
                if (isPaid) {
                    toast.success('Đơn hàng đã hủy. Chúng tôi sẽ hoàn tiền cho bạn sau.');
                } else {
                    toast.success('Đơn hàng đã hủy thành công.');
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
        }
    };

    // Hàm mở modal với orderId cụ thể
    const openCancelModal = (orderId) => {
        setOrderToCancel(orderId);
    };

    // Hàm đóng modal
    const closeCancelModal = () => {
        setOrderToCancel(null);
    };

    // Hàm xác nhận hủy đơn hàng
    const confirmCancelOrder = () => {
        if (orderToCancel) {
            const order = myOrders.find(o => o._id === orderToCancel);
            if (order) {
                handleCancelOrder(orderToCancel, order.status === 'Đã thanh toán');
            }
        }
        closeCancelModal();
    };

    return (
        <div className='pb-16 mt-40 px-6 md:px-16 lg:px-24 xl:px-32'>
            <div className='flex flex-col items-end w-max mb-8'>
                <p className='text-2xl font-medium uppercase'>Đơn hàng của tôi</p>
            </div>
            {myOrders.length === 0 ? (
                <p className="text-center text-gray-500 text-lg mt-10">Bạn chưa có đơn hàng nào</p>
                ) :(
                    myOrders.map((order, idx) => (
                <div key={idx} className='border border-gray-300 rounded-lg p-4 py-5 max-w-4xl mb-10'>
                    <p className='flex max-md:font-medium max-md:flex-col md:items-center justify-between text-gray-400'>
                        <span>Mã đơn hàng: {order._id}</span>
                        <span>Phương thức thanh toán : {order.paymentType}</span>
                        <span className='text-sub3 font-medium text-lg'>Tổng tiền: {formatVND(order.amount)}{currency}</span>
                    </p>
                    <div className='flex justify-between items-center mt-2 mb-4'>
                        <span className='font-medium'>Trạng thái: <span className={`${order.status === 'Đã hủy đơn' ? 'text-red-500' : 'text-green-500'}`}>{order.status}</span></span>
                        {order.status !== 'Đã giao hàng' && order.status !== 'Đang giao hàng' && order.status !== 'Đã hủy đơn' && (
                            <button 
                                onClick={() => openCancelModal(order._id)} // Thay đổi: truyền orderId cụ thể
                                className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors cursor-pointer'
                            >
                                Hủy đơn hàng
                            </button>
                        )}
                    </div>
                    {order.items.map((item, idx) => (
                        <div key={idx} 
                        className={`relative bg-white text-gray-500/70 ${order.items.length !== idx + 1 && 'border-b' } border-gray-300 flex flex-col md:flex-row justify-between md:items-center p-4 py-5 md:gap-6 w-full max-w-4xl`}>
                            <div className='flex items-center mb-4 md:mb-0'>
                                <div className='bg-primary/10 p-4 rounded-lg'>
                                    <img src={item.product.image} alt="" className='w-16 h-16'/>
                                </div>
                                <div className='ml-4 w-[150px]'>
                                    <h2 className='text-xl font-medium text-gray-800 w-full'>{item.product.name}</h2>
                                    <p className='w-full'>Danh mục: {item.product.category}</p>
                                </div>
                            </div>
                            <div className='flex flex-col justify-center  mb-4 md:mb-0'>
                                <p>Số lượng : {item.quantity || '1'}</p>
                                <p>Trạng thái: {order.status}</p>
                                <p>Ngày đặt hàng: {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <p>Số tiền: {item.product.offerPrice ? (formatVND(item.product.offerPrice * item.quantity)) : (formatVND(item.product.price * item.quantity))} {currency}</p>
                        </div>
                    ))}
                </div>
            )))}

            {/* Modal xác nhận hủy đơn hàng - Di chuyển ra ngoài vòng lặp */}
            {orderToCancel && (
                <div
                    onClick={closeCancelModal}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 ">
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
                    <h2 className="text-gray-900 font-semibold text-center mt-4 text-xl">Bạn chắc chắn muốn hủy đơn hàng này?</h2>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                        Hành động này không thể hoàn tác. <br /> Bạn có chắc chắn muốn tiếp tục?
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-5 w-full">
                        <button onClick={closeCancelModal} type="button" className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium cursor-pointer text-sm hover:bg-gray-100 active:scale-95 transition">
                        Hủy
                        </button>
                        <button
                        type="button"
                        onClick={confirmCancelOrder} // Thay đổi: sử dụng hàm riêng biệt
                        className="w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm cursor-pointer hover:bg-red-700 active:scale-95 transition"
                        >
                        Xác nhận
                        </button>
                    </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default MyOrder