import React from 'react'

const NewLetter = () => {
    
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-2 mt-24 pb-14">
            <h1 className="md:text-4xl text-2xl font-semibold">Đừng Bỏ Lỡ Ưu Đãi!</h1>
            <p className="md:text-lg text-gray-500/70 pb-8">
            Đăng ký để nhận thông tin về khuyến mãi, món mới và ưu đãi độc quyền
            </p>
            <form className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
                <input
                    className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
                    type="text"
                    placeholder="Nhập email của bạn"
                    required
                />
                <button type="submit" className="md:px-12 px-8 h-full text-white bg-primary hover:bg-primary-2 transition-all cursor-pointer rounded-md rounded-l-none">
                    Đăng ký
                </button>
            </form>
        </div>
    )
}

export default NewLetter