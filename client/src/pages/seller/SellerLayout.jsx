import React from 'react'
import { useAppContext } from '../../context/AppContext';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';


const SellerLayOut = () => {

    const {navigate,axios} = useAppContext();

    const sidebarLinks = [
        { name: "Thêm món ăn", path: "/seller", icon: add_icon },
        { name: "Danh sách món ăn", path: "/seller/product-list", icon: list_icon },
        { name: "Đơn hàng", path: "/seller/orders", icon: check_icon },
        { name: "Quản lý đánh giá", path: "/seller/reviews", icon: review_ic },
    ];

    const logout = async () => {
        try {
            const {data} = await axios.get("/api/seller/logout"); 
            if(data.success){
                toast.success(data.message)
                navigate('/')
            }else{
                toast.error(data.message)
            }
        } catch (err) {
            toast.error(err.message)
        } 
    }
    

    return (
        <>
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white ">
                <Link to={'/'}>
                    <img className="cursor-pointer w-24 md:w-28" src={assets.logo} alt="logo" />
                </Link>
                <div className="flex items-center gap-5 text-gray-500">
                    <p>Xin chào Admin</p>
                    <button onClick={logout} className='border rounded-full cursor-pointer text-sm px-4 py-1'>Đăng xuất</button>
                </div>
            </div>
            <div className='flex'>
                <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col ">
                    {sidebarLinks.map((item) => (
                        <NavLink to={item.path} key={item.name} end={item.path === "/seller"}
                            className={({isActive}) => `flex items-center py-3 px-4 gap-3 
                                ${isActive ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                    : "hover:bg-gray-100/90 border-white "
                                }`
                            }
                        >
                            <div className='w-7 h-7'>{item.icon}</div>
                            <p className="md:block hidden text-center">{item.name}</p>
                        </NavLink>
                    ))}
                </div>
                <Outlet />
            </div>
        </>
    );
};

export const add_icon = (
    <box-icon name='message-square-add'></box-icon>
);

export const list_icon = (
    <box-icon name='list-ul'></box-icon>
);

export const check_icon = (
    <box-icon name='badge-check' ></box-icon>
);

export const review_ic = (
    <box-icon name='cog' ></box-icon>
);


export default SellerLayOut