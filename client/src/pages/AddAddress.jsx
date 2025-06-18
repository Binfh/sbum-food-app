import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const InputFeilds = ({type,placeholder,name,handleChange,address}) =>
    (
        <input 
            className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition '
            type={type} 
            placeholder={placeholder}
            name={name}
            onChange={handleChange}
            value={address[name]}
            required
        />
    )

const AddAddress = () => {
    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        phone:'',
        email:'',
        street:'',
        city:'',
        state:'',
    })

    const {axios,user,navigate} = useAppContext();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    

    const onSubmitHandle = async(e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post('/api/address/add',{
                address});
            if(data.success){
                toast.success(data.message)
                navigate('/cart')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        if(!user){
            navigate('/cart')
        }
    },[])

  return (
    <div className='mt-40 px-6 md:px-16 lg:px-24 xl:px-32 pb-16'>
        <p className='text-2xl md:text-3xl text-gray-500'>Thêm <span className='font-semibold text-primary'>Địa Chỉ</span> Giao Hàng</p>
        <div className='flex flex-col-reverse md:flex-row justify-between max-md:items-center mt-10'>
            <div className='flex-1 max-w-md'>
                <form onSubmit={onSubmitHandle} className='space-y-3 mt-6 text-sm'>
                    <div className='grid grid-cols-2 gap-4'>
                        <InputFeilds handleChange={handleChange} address={address} name='firstName' type='text'
                        className
                        placeholder='Họ'/>
                        <InputFeilds handleChange={handleChange} address={address} name='lastName' type='text' placeholder='Tên'/>
                    </div>
                    <InputFeilds handleChange={handleChange} address={address} name='street' type='text' placeholder='Đường'/>
                    <div className='grid grid-cols-2 gap-4'>
                        <InputFeilds handleChange={handleChange} address={address} name='state' type='text' placeholder='Quận/Huyện'/>
                        <InputFeilds handleChange={handleChange} address={address} name='city' type='text' placeholder='Tỉnh/Thành phố'/>
                    </div>
                    <InputFeilds handleChange={handleChange} address={address} name='phone' type='number' placeholder='Số điện thoại'/>

                    <button className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-2 transition cursor-pointer uppercase'>Lưu địa chỉ</button>
                </form>
            </div>
            <img className='max-w-lg md:mr-16 md:mt-0 mb-16 ' src={assets.add_address} alt="Add Address" />
        </div>
    </div>
  )
}

export default AddAddress