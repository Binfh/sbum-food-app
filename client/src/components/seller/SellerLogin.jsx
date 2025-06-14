import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import {PulseLoader} from 'react-spinners'

const SellerLogin = () => {
    const {isSeller,setIsSeller,navigate,axios,loading,setLoading} = useAppContext()
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            setLoading(true)
            const {data} = await axios.post('/api/seller/login',{email,password});
            await new Promise(resolve => setTimeout(resolve, 1500));
            if(data.success){
                setIsSeller(true)
                navigate('/seller')
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
        
    }

    useEffect(() => {
        if(isSeller){
            navigate('/seller')
        }
    },[isSeller])

  return !isSeller &&(
    <form onSubmit={onSubmitHandler} className='flex items-center min-h-screen text-sm text-gray-600'>
        <div className='flex flex-col gap-4 m-auto items-start p-8 py-12 min-w-80 sm:min-w-100 rounded-lg shadow-xl border border-gray-200'>
            <p className='text-2xl font-medium m-auto'>
                <span className='text-primary mr-2'>Admin</span>
                Đăng nhập
            </p>
            <div className='w-full'>
                <p>Email</p>
                <input
                    onChange={(e) => setEmail(e.target.value)} value={email} 
                    type="email" placeholder=' Email admin'  className='border border-gray-200 rounded-full w-full mt-1 p-2 outline-1' required/>
            </div>
            <div className='w-full'>
                <p>Mật khẩu</p>
                <input
                    onChange={(e) => setPassword(e.target.value)} value={password} 
                    type="password" placeholder=' Mật khẩu ' className='border border-gray-200 rounded-full w-full mt-1 p-2 outline-1' required />
            </div>
            <button className={`bg-primary border border-transparent text-white w-full py-2 rounded-full cursor-pointer hover:bg-white hover:text-black hover:border-primary transition-all ease-in-out duration-500 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black hover:border-primary'}`}>{loading ? <PulseLoader size={5} color='blue'/> : 'Đăng nhập'}</button>
        </div>
    </form>
  )
}

export default SellerLogin