import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import Login from './components/Login'
import AllProducts from './pages/AllProducts'
import ProductCategory from './pages/ProductCategory'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import AddAddress from './pages/AddAddress'
import MyOrder from './pages/MyOrder'
import SellerLogin from './components/seller/SellerLogin'
import { useAppContext } from './context/AppContext'
import ProductList from './pages/seller/ProductList'
import AddProducts from './pages/seller/AddProducts'
import ControllerReview from './pages/seller/ControllerReview'
import Orders from './pages/seller/Orders'
import SellerLayOut from './pages/seller/SellerLayout'
import Loading from './components/Loading'
import PaymentSuccess from './pages/PaymentSuccess'
import VnpayReturn from './pages/VnpayReturn'
import About from './pages/About'
import BackToTop from './components/BackToTop'
import Contact from './pages/Contact'
import MyAccount from './pages/MyAccount'
import Chatbot from './components/Chatbot'
import ForgotPassword from './pages/ForgotPassword'


const App = () => {

  const isSellerPath = useLocation().pathname.includes('seller')
  const {showUserLogin,isSeller} = useAppContext()

  const [isLoading, setIsLoading] = useState(true);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer); 
  }, []);
  
  return (
    <div className=' min-h-screen text-gray-700 bg-white'>
      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null} 
      <Toaster/>
      {/* px-6 md:px-16 lg:px-24 xl:px-32 */}
      <div>
          {
            isLoading ? (<Loading/>) :
            (
              <div>
                <Routes>
                  <Route path='/' element={<Home />} />
                  <Route path='/about' element={<About />} />
                  <Route path='/products' element={<AllProducts />} />
                  <Route path='/products/:category' element={<ProductCategory />} />
                  <Route path='/products/:category/:id' element={<ProductDetail />} />
                  <Route path='/cart' element={<Cart />} />
                  <Route path='/add-address' element={<AddAddress />} />
                  <Route path='/my_orders' element={<MyOrder />} />
                  <Route path='/contact' element={<Contact />} />
                  <Route path='/loader' element={<Loading />} />
                  <Route path='/payment-success' element={<PaymentSuccess />} />
                  <Route path="/vnpay-return" element={<VnpayReturn />} />
                  <Route path="/profile" element={<MyAccount/>} />
                  <Route path="/forgot-password" element={<ForgotPassword/>} />
                  <Route path='/seller' element={isSeller ? <SellerLayOut /> : <SellerLogin />} >
                  <Route index element={isSeller ? <AddProducts/> : null} />
                    {/* index : định nghĩa route mặc định cho route cha */}
                    <Route path='product-list' element={<ProductList/>} />
                    <Route path='reviews' element={<ControllerReview/>} />
                    <Route path='orders' element={<Orders/>} />
                  </Route>
                </Routes>
                <BackToTop/>
                
                {!isSellerPath && <Footer />}
                {!isSellerPath && <Chatbot/>}
              </div>
            )
          }
      </div>
    </div>
  )
}

export default App