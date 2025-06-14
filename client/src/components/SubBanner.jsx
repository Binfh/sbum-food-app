import React from 'react'
import { assets, features } from '../assets/assets'
import {easeOut, motion} from 'framer-motion'

const SubBanner = () => {
  return (
    <div className='relative mt-24 overflow-hidden'>
      <img 
        src={assets.sub_banner} 
        alt="banner" 
        className='w-full md:block hidden rounded-lg shadow-lg transition-all duration-300 hover:opacity-95' 
      />
      <img 
        src={assets.sub_banner_sm} 
        alt="banner" 
        className='w-full md:hidden max-md:h-[90vh] block rounded-lg shadow-lg object-cover' 
      />
      <div className='absolute inset-0 bg-gradient-to-r from-black/40 to-transparent'></div>
      
      <div className='absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 sm:mr-14 md:pt-0 px-6'>
        <div className='text-white max-w-md backdrop-blur-sm bg-black/10 p-6 rounded-lg border border-white/10'>
          <h1 className='text-2xl md:text-4xl font-bold mb-8 relative'>
            Tại sao chọn chúng tôi
            <motion.span 
              initial={{ x: 0 }}
              animate={{ x: ['0%', '100%', '0%'] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className='absolute -bottom-3 left-0 w-16 h-1 bg-red-500'>
            </motion.span>
          </h1>
          
          <div className='space-y-5 overflow-hidden'>
            {features.map((item, index) => (
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
                viewport={{ amount: 0.2 }}
                key={index}
                className='flex items-start gap-4 group transition-all duration-300 hover:translate-x-1'
              >
                <div className="bg-red-600 rounded-md inline-flex items-center justify-center md:w-12 md:h-12 w-10 h-10 shadow-lg transition-all duration-300 group-hover:bg-red-500 group-hover:scale-110">
                  <box-icon
                    type={item.type}
                    name={item.icon}
                    color="white"
                    className="md:w-6 md:h-6 w-5 h-5"
                  ></box-icon>
                </div>

                <div>
                  <h3 className='text-lg md:text-xl font-bold group-hover:text-red-300 transition-colors duration-300'>
                    {item.title}
                  </h3>
                  <p className='text-sm md:text-base text-gray-200'>
                    {item.des}
                  </p>
                </div>
              </motion.div>
            ))}

          </div>
        </div>
      </div>
    </div>
  )
}

export default SubBanner