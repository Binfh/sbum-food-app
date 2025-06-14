import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets, categories } from '../assets/assets'
import 'boxicons'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Navbar = () => {
    const [open, setOpen] = React.useState(false);
    const [showSearch, setShowSearch] = React.useState(false);
    const [showCategories, setShowCategories] = React.useState(false);
    const {user, setUser, setShowUserLogin, navigate, searchQuery, setSearchQuery, getCartCount, axios, setCartItems,setLoginState} = useAppContext();
    
    const logout = async () => {
        try {
            const {data} = await axios.get('/api/user/logout')
            if(data.success){
                toast.success(data.message)
                setUser(null);
                setCartItems({});
                navigate("/");
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleLogin = () => {
        setLoginState('login'); 
        setShowUserLogin(true);
    }

    const handleRegister = () => {
        setLoginState('register');
        setShowUserLogin(true);
    }

    const handleCategoryClick = (categoryPath) => {
        navigate(`/products/${categoryPath.toLowerCase()}`);
        setShowCategories(false);
        window.scrollTo(0, 0);
    }

    useEffect(() => {
        if(searchQuery.length > 0) {
            navigate("/products")
        }
    },[searchQuery])


    return (
        <nav className="flex items-end justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 fixed top-0 left-0 right-0 z-50 shadow-md transition-all bg-primary text-white">
            <NavLink to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                <img className="h-24" src={assets.logo} alt="logo" />
            </NavLink>

            <div className="hidden md:flex items-center lg:gap-2 max-lg:gap-3 max-xl:gap-0  ">
                <NavLink className={({ isActive }) =>
                    `max-xl:pr-3 md:px-1 py-3 lg:px-[10px] font-bold text-[16px] text-white hover:py-3  hover:bg-nav hover:text-primary hover:rounded-t-[10px] ${isActive ? "py-3 px-[10px] bg-nav !text-primary rounded-t-[10px] " : ""}`
                } to={"/"}>
                    Trang chủ
                </NavLink>
                <NavLink className={({ isActive }) =>
                    `max-xl:pr-3 md:px-1 py-3 lg:px-[10px] font-bold text-[16px] text-white hover:py-3  hover:bg-nav hover:text-primary hover:rounded-t-[10px] ${isActive ? "py-3 px-[10px] bg-nav !text-primary rounded-t-[10px] " : ""}`
                } to={"/about"}>
                    Giới thiệu
                </NavLink>
                <div className="relative group">
                    <NavLink className={({ isActive }) =>
                        `max-xl:pr-3 md:px-1 py-3 lg:px-[10px] font-bold text-[16px] text-white hover:py-3  hover:bg-nav hover:text-primary hover:rounded-t-[10px] ${isActive ? "py-3 px-[10px] bg-nav !text-primary rounded-t-[10px] " : ""}`
                    } to={"/products"}>
                        Thực đơn
                    </NavLink>
                    
                    {/* Arrow */}
                    <div className={`absolute top-9 left-1/2 -translate-x-1/2 w-0 h-0 
                        border-l-[12px] border-l-transparent 
                        border-r-[12px] border-r-transparent 
                        border-t-[12px] border-t-nav
                        opacity-0 group-hover:opacity-100 
                        transition-opacity duration-200`} 
                    />
                    
                    {/* Categories Dropdown - luôn render nhưng ẩn bằng CSS */}
                    <div className="absolute top-12 -right-80 bg-nav shadow-lg rounded-b-lg p-4 flex gap-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        {categories && categories.map((category, idx) => (
                            <div 
                                key={idx} 
                                className='cursor-pointer py-3 px-3 gap-2 rounded-lg flex flex-col items-center justify-center hover:scale-105 transition-transform'
                                onClick={() => handleCategoryClick(category.path)}
                            >
                                <img className='hover:scale-110 transition max-w-16' src={category.image} alt={category.text} />
                                <p className='text-[15px] text-black font-medium text-center'>{category.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <NavLink className={({ isActive }) =>
                    `max-xl:pr-3 md:px-1 py-3 lg:px-[10px] font-bold text-[16px] text-white hover:py-3  hover:bg-nav hover:text-primary hover:rounded-t-[10px] ${isActive ? "py-3 px-[10px] bg-nav !text-primary rounded-t-[10px] " : ""}`
                } to={"/contact"}>
                    Liên lạc
                </NavLink>

                <div className="relative group ">
                    <button 
                        onClick={() => setShowSearch(prev => !prev)} 
                        className="cursor-pointer p-2 "
                    >
                        <box-icon color='white' name='search'></box-icon>
                    </button>

                    {showSearch && (
                        <div className="absolute max-lg:top-14 top-12 right-0 bg-white rounded-full shadow-md px-3 py-2 w-[220px]">
                        <input
                            onChange={(e) => setSearchQuery(e.target.value)}
                            value={searchQuery}
                            className="text-black w-full outline-none"
                            type="text"
                            placeholder="Tìm kiếm món ăn..."
                        />
                        </div>
                    )}
                </div>


                <div onClick={() => navigate("/cart")} className="relative cursor-pointer max-xl:pr-3">
                    <box-icon className="w-6 opacity-80 " color="white" name='cart'></box-icon>
                    <button className="absolute -top-2 -right-3 max-xl:right-1 text-xs text-primary bg-white w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>
                {!user ?
                    (
                        <div 
                        className="  px-4 py-1 ml-4 bg-btn transition text-white rounded-full flex items-center gap-2">
                            <button className='hover:text-[#2e3131] cursor-pointer hover:underline' onClick={handleLogin} >Đăng nhập</button> 
                            <span>/</span>
                            <button className='hover:text-[#2e3131] cursor-pointer hover:underline' onClick={handleRegister} >Đăng ký</button>
                        </div>
                    )
                    : (
                        <div className='relative group'>
                            <img src={assets.userAvatar} alt="userAvatar" className="w-9 lg:ml-2 max-md:hidden " />
                            <ul className="hidden group-hover:block absolute top-9 right-0 bg-white shadow border border-gray-200 py-2.5 rounded-md w-30 z-50 text-sm text-black" >
                                <li onClick={() => navigate("/my_orders")} className='p-1.5 pl-3 hover:bg-hover cursor-pointer'>Đơn hàng của tôi
                                </li>
                                <li onClick={() => navigate("/profile")} className='p-1.5 pl-3 hover:bg-hover cursor-pointer'>Tài khoản của tôi
                                </li>
                                <li className='p-1.5 pl-3 hover:bg-hover cursor-pointer' onClick={logout}>Đăng xuất</li>
                            </ul>
                        </div>
                    )
                }
            </div>
            <div className='flex items-center gap-6 md:hidden'>
                {user ? (
                    <img onClick={() => {navigate('/profile')}} src={assets.userAvatar} alt="userAvatar"  className="w-8 cursor-pointer md:hidden" />
                ) 
                : ""}
                <div className="relative cursor-pointer md:hidden max-xl:pr-3">
                    <box-icon color='white' onClick={() => navigate("/cart")} className="w-6 opacity-80" name='cart'></box-icon>
                    <button className="absolute -top-2 -right-3 max-xl:right-1 text-xs text-primary bg-white w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>
                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="">
                <box-icon color='white' className='cursor-pointer' name='menu' ></box-icon>
                </button>
            </div>

            {/* Mobile Menu */}
            { open && (
                <div className={`${open ? 'flex' : 'hidden'} absolute top-[130px] left-0 w-full bg-white shadow-md gap-2 z-50 flex-row items-center justify-between text-sm md:hidden`}>
                    <div className='flex flex-col items-start py-4 px-5 gap-3'>
                        <NavLink className={({ isActive }) =>
                            `max-xl:pr-3 text-primary ${isActive ? "border border-transparent border-b-primary  font-semibold" : ""}`
                        } to={"/"} onClick={() => setOpen(false)}>Trang chủ</NavLink>
                        <NavLink className={({ isActive }) =>
                            `max-xl:pr-3 text-primary ${isActive ? "border border-transparent border-b-primary  font-semibold" : ""}`
                        } to={"/about"} onClick={() => setOpen(false)}>Giới thiệu</NavLink>
                        <NavLink className={({ isActive }) =>
                            `max-xl:pr-3 text-primary ${isActive ? "border border-transparent border-b-primary  font-semibold" : ""}`
                        } to={"/products"} onClick={() => setOpen(false)}>Thực đơn</NavLink>
                        {user && <NavLink className={({ isActive }) =>
                            `max-xl:pr-3 text-primary ${isActive ? "border border-transparent border-b-primary  font-semibold" : ""}`
                        } to={"/my_orders"} onClick={() => setOpen(false)}>Đơn hàng</NavLink>}
                        <NavLink className={({ isActive }) =>
                            `max-xl:pr-3 text-primary ${isActive ? "border border-transparent border-b-primary  font-semibold" : ""}`
                        } to={"/contact"} onClick={() => setOpen(false)}>Liên lạc</NavLink>
                        {!user ? (
                            <div 
                                className=" px-6 py-2 mt-2 bg-primary hover:bg-primary transition text-white rounded-full text-sm flex flex-col items-center gap-2">
                                <button className='cursor-pointer hover:underline border-b border-white pb-2' onClick={() => {
                                    setOpen(false);
                                    handleLogin()
                                }} >Đăng nhập</button>
                                <button className='cursor-pointer hover:underline' onClick={() => {
                                    setOpen(false);
                                    handleRegister()
                                }} >Đăng ký</button>
                            </div>
                        )
                        
                        : (
                            <button
                            onClick={logout}
                            className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary transition text-white rounded-full text-sm">
                                Đăng xuất
                            </button>
                        )}
                    </div>
                    <div className="px-5 pb-4">
                        <div className="flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full w-full">
                        <input
                            onChange={(e) => setSearchQuery(e.target.value)}
                            value={searchQuery}
                            className="py-1.5 w-full font-roboto bg-transparent outline-none placeholder-gray-500 text-black"
                            type="text"
                            placeholder="Tìm kiếm món ăn"
                        />
                        <box-icon className="w-4 h-4" color="black" name='search'></box-icon>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar