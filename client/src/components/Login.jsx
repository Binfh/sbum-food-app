import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
    const {setShowUserLogin,setUser,axios,navigate,setCartItems,loginState} = useAppContext()

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandle = async(event) => {
        try {
            event.preventDefault();
            const {data} = await axios.post(`/api/user/${state}`,{name,email,password});
            if(data.success){
                navigate('/')
                setUser(data.user)
                setCartItems(data.user.cartItems);
                toast.success('Đăng nhập thành công')
                setShowUserLogin(false);
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            
        }
        
    }

    useEffect(() => {
        if (loginState) {
            setState(loginState);
        }
    }, [loginState]);

    return (
        <div onClick={() => setShowUserLogin(false)} className='fixed top-0 left-0 bottom-0 right-0 z-[100] bg-black/50 flex items-center text-sm text-gray-600'>
            <motion.form
             initial={{scale: 0.5, opacity: 0}}
             animate={{scale: 1, opacity: 1}}
             transition={{duration: 0.5, ease: "easeInOut"}}
             onClick={(e) => e.stopPropagation()}
             onSubmit={onSubmitHandle}
             className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto pb-10">
                    {state === "login" ? "Đăng Nhập" : "Đăng Ký "}
                </p>
                {state === "register" && (
                    <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            width="20"
                            height="17"
                        >
                            <path
                            fillRule="evenodd"
                            d="M12 2a5 5 0 100 10 5 5 0 000-10zm-3.5 5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0zM4 20a8 8 0 1116 0H4zm8-6a6 6 0 00-5.917 5h11.834A6 6 0 0012 14z"
                            clipRule="evenodd" fill='#6B7280'
                            />
                        </svg>
                        <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Tên người dùng" className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full" />                 
                    </div>
                )}
                <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280"/>
                    </svg>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Email " className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full" />                 
                </div>
                <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280"/>
                    </svg>
                    <input 
                    onChange={(e) => setPassword(e.target.value)} value={password} 
                    type="password" placeholder="Mật khẩu" className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full" />                 
                </div>
                {state === "register" ? (
                    <p>
                        Bạn đã có tài khoản? <span onClick={() => setState("login")} className="text-primary cursor-pointer hover:underline">Đăng nhập ngay</span>
                    </p>
                ) : (
                    <p>
                        Bạn chưa có tài khoản? <span onClick={() => setState("register")} className="text-primary cursor-pointer hover:underline">Đăng ký ngay</span>
                    </p>
                )}
                {state === "login" && (
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                            <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            Ghi nhớ đăng nhập
                            </label>
                        </div>

                        <div className="text-sm">
                        <button
                        type="button"
                        onClick={() => {
                            navigate('/forgot-password')
                            setShowUserLogin(false)
                            }}
                        className="font-medium hover:underline cursor-pointer text-blue-600 hover:text-blue-500"
                        >
                        Quên mật khẩu?
                        </button>
                        </div>
                    </div>
                )}
                <motion.button
                    className="bg-primary transition-all text-white w-full py-2 rounded-full cursor-pointer"
                    whileHover={{
                        scale: [1, 1.1, 1],
                        transition: {
                        duration: 1,
                        repeat: Infinity, 
                        ease: "easeInOut",
                        },
                    }}
                    >
                    {state === "register" ? "Đăng Ký" : "Đăng Nhập"}
                </motion.button>
            </motion.form>
        </div>
    );
};

export default Login