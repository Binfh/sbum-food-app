import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';

const VnpayReturn = () => {
    const { navigate, setCartItems, axios } = useAppContext();
    const location = useLocation();

    useEffect(() => {
        const handleReturn = async () => {
            try {
                const query = location.search;
                const { data } = await axios.get(`/api/order/vnpay-return${query}`);
                
                if (data.success) {
                    toast.success('Thanh toán thành công!');
                    setCartItems({});
                    setTimeout(() => {
                        navigate('/payment-success');
                    }, 2000);
                } else {
                    toast.error('Thanh toán thất bại!');
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                }
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra!');
                navigate('/');
            }
        };

        handleReturn();
    }, [location.search]);

    return <Loading />;
};

export default VnpayReturn;
