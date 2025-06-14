import { useState, useEffect } from "react";
import { motion } from "framer-motion";


const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const smoothScrollToTop = () => {
    const scrollStep = -window.scrollY / 50; 
    const scrollInterval = setInterval(() => {
      if (window.scrollY === 0) {
        clearInterval(scrollInterval);
      } else {
        window.scrollBy(0, scrollStep);
      }
    }, 20); 
  };

  return (
    <motion.button
      className="fixed bottom-6 left-6 cursor-pointer p-3 !bg-blue-600 text-white rounded-lg shadow-lg"
      onClick={smoothScrollToTop}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.3 }}
      whileHover={{scale:1.2}}
    >
       <span className="text-[20px]">↑</span> 
    </motion.button>
  );
};

export default BackToTop;
