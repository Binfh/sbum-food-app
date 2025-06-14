import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';

const MainBanner = () => {
  const [activeSlide, setActiveSlide] = useState(0); 

  const letterAnimation = {
    hidden: { y: -50, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  const lines = ["Thèm món gì", "Đặt ngay món đó"];

  return (
    <div className="relative ">
      <Swiper
        modules={[Pagination, Autoplay]}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        speed={1000}
        className="w-full absolute z-10"
        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)} 
      >
        <SwiperSlide>
          <img src={assets.main_banner} alt="banner" className="w-full h-screen" />
          <div className="absolute top-2/5 left-2/3 ml-5 max-lg:left-3/4 max-md:left-5/6 max-sm:left-5/7 max-sm:w-[250px] transform -translate-x-1/2 -translate-y-1/2 text-white w-[350px] z-50">
            {lines.map((line, lineIndex) => (
              <h1 key={lineIndex} className="text-white text-[50px] max-lg:text-4xl max-md:text-3xl max-sm:text-2xl font-bold mb-4 whitespace-pre">
                {line.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={letterIndex}
                    variants={letterAnimation}
                    initial="hidden"
                    animate={activeSlide === 0 ? "visible" : "hidden"} 
                    custom={letterIndex}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </h1>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={activeSlide === 0 ? { opacity: 1, y: 0 } :"hidden"}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute top-3/5 left-3/5 ml-5 max-lg:left-3/5 max-md:left-4/7 max-sm:left-3/7 pt-5 text-white z-50">
            <Link
              to="/products"
              onClick={() => window.scrollTo(0, 0)}
              className="group flex items-center px-7 md:px-5 py-3 max-sm:px-2 max-sm:py-1 max-sm:w-[120px] text-white transition rounded cursor-pointer bg-primary-2 hover:bg-sub3"
            >
              <span>Đặt hàng ngay</span>
              <box-icon
                name="right-arrow-alt"
                color="white"
              />
            </Link>
          </motion.div>
        </SwiperSlide>

        <SwiperSlide>
          <img src={assets.main_banner_sm} alt="banner" className="w-full h-screen" />
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] text-white z-50 text-center">
            <motion.h1
                className="text-white text-[50px] max-lg:text-4xl max-md:text-3xl max-sm:text-2xl font-bold px-5 w-full bg-[#050505]/50 rounded-lg"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={activeSlide === 1 ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }} 
                transition={{
                  duration: 1.5, 
                  ease: 'easeOut', 
                }}
                style={{ transformOrigin: 'center' }} 
              >
                Rất ngon và đảm bảo chất lượng
            </motion.h1>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default MainBanner;