import express from 'express'
import authUser from '../middlewares/authUser.js'
import authSeller from '../middlewares/authSeller.js'
import { clearCart, getAllOrders, getUserOrders, placeOrderCOD, placeOrderVnPay, updateOrderStatus, vnpayReturn } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/cod',authUser,placeOrderCOD)
orderRouter.post('/vnpay',authUser,placeOrderVnPay) 
orderRouter.post('/clear',authUser,clearCart) 
orderRouter.get('/user',authUser,getUserOrders)
orderRouter.get('/seller',authSeller,getAllOrders)
orderRouter.put('/:id',authSeller,updateOrderStatus)
orderRouter.get('/vnpay-return', vnpayReturn);

export default orderRouter;