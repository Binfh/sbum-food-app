import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import { assets, formatVND } from '../../assets/assets';
import toast from 'react-hot-toast';

const Orders = () => {
  const {currency,axios} = useAppContext();
  const [orders,setOrders] = useState([]);
  const fetchOrders = async() => {
    try {
      const {data} = await axios.get('/api/order/seller')
      if(data.success){
        setOrders(data.orders)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(`/api/order/${orderId}`, { status: newStatus });
      if(data.success){
        toast.success('Cập nhật trạng thái thành công!');
        fetchOrders(); 
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);
    
    return () => clearInterval(interval);
  },[]);
  

  return (
    <div className='no-scrollbar overflow-y-scroll flex flex-1 h-[95vh]'>
      <div className="md:p-10 p-4 space-y-4">
          <h2 className="text-lg font-medium">Danh sách đơn hàng</h2>
          {orders.map((order, index) => (
              <div key={index} className="flex flex-col md:items-center md:flex-row justify-between gap-10 p-5 max-w-4xl rounded-md border border-gray-300">
                  <div className="flex gap-5 max-w-80 ">
                      <img className="w-12 h-12 object-cover" src={assets.foodIcon} alt="boxIcon" />
                          <div>
                            {order.items.map((item, index) => (
                                <div key={index} className="flex flex-col">
                                    <p className="font-medium">
                                        {item.product.name}{''} <span className={'text-primary'}>x {item.quantity}</span>
                                    </p>
                                </div>
                            ))}
                          </div>
                  </div>

                  <div className="text-sm md:text-base text-black/60">
                      <p className='text-black/80'>{order.address.firstName} {order.address.lastName}</p>
                      <p>{order.address.street},{order.address.state} </p> 
                      <p>{order.address.city}</p>
                      <p></p>
                      <p>{order.address.phone}</p>
                  </div>

                  <p className="font-medium text-lg my-auto ">{formatVND(order.amount)}{currency}</p>

                  <div className="flex flex-col text-sm md:text-base text-black/60">
                    <p>Hình thức thanh toán: {order.paymentType}</p>
                    <p>Ngày đặt hàng: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p>Trạng thái: {order.status}</p>
                    <select
                        className="p-2 border border-gray-300 rounded-md"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                        <option value="Đã đặt hàng">Đã đặt hàng</option>
                        <option value="Đã thanh toán">Đã thanh toán</option>
                        <option value="Đang giao hàng">Đang giao hàng</option>
                        <option value="Đã giao hàng">Đã giao hàng</option>
                        <option value="Đã hủy đơn">Đã hủy đơn</option>
                    </select>
                  </div>

              </div>
          ))}
      </div>
    </div>
  );
};

export default Orders