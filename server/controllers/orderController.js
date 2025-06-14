import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { VNPay } from 'vnpay';

export const clearUserCart = async (userId) => {
    try {
        // Assuming you have a User model with cartItems field
        await User.findByIdAndUpdate(userId, { 
            cartItems: {} 
        });
        return true;
    } catch (error) {
        console.log("Error clearing cart:", error);
        return false;
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { cartItems: {} }, 
            { new: true }
        );
        
        if (!updatedUser) {
            return res.json({ success: false, message: "User not found" });
        }
        
        res.json({ 
            success: true, 
            message: "Cart cleared successfully",
            user: updatedUser 
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Place Order COD
export const placeOrderCOD = async (req,res) =>{
    try {
        const userId = req.user.userId;
        const {items,address} = req.body;
        if(!address ){
            return res.json({success:false,message:"Vui lòng điền địa chỉ giao hàng"})
        }
        if(items.length === 0){
            return res.json({success:false,message:"Giỏ hàng của bạn đang trống"})
        }
        const newItems = await Promise.all(items.map(async (item) => {
            const product = await Product.findById(item.product);
            const price = product.offerPrice ?? product.price;
            return {
                product: product._id,
                quantity: item.quantity,
                price,
            };
        }));
        
        let amount = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        amount +=Math.round(amount * 0.02);
        await Order.create({
            userId,
            items: newItems,
            amount,
            address,
            paymentType:'COD',
            status: 'Đã đặt hàng'
        })

        await clearUserCart(userId);

        return res.json({success:true,message:"Đặt hàng thành công"})
    } catch (error) {
        console.log(error.message);
        return res.json({success:false,message:error.message})
    }
}

// Place Order VNPay
const vnpay = new VNPay({
    tmnCode: process.env.VNP_TMNCODE,
    secureSecret: process.env.VNP_HASH_SECRET,
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true,
    hashAlgorithm: 'SHA512',
    enableLog: true,
});

export const placeOrderVnPay = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { items, address } = req.body;
        const { origin } = req.headers;

        if(!address ){
            return res.json({success:false,message:"Vui lòng điền địa chỉ giao hàng"})
        }
        if(items.length === 0){
            return res.json({success:false,message:"Giỏ hàng của bạn đang trống"})
        }

        let productData = [];

        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price:  product.offerPrice ?? product.price,
                quantity: item.quantity,
            });
            const price = product.offerPrice ?? product.price;
            return (await acc) + price * item.quantity;
        }, 0);

        amount += Math.round(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: 'online',
        });

        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: amount * 1000, 
            vnp_IpAddr: req.ip,
            vnp_OrderInfo: `Thanh toán đơn hàng #${order._id}`,
            vnp_OrderType: 'other',
            vnp_ReturnUrl: `${origin}/vnpay-return`,
            vnp_TxnRef: order._id.toString(),
        });

        return res.json({ success: true, url: paymentUrl });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};

// VNPay Return URL Handler
export const vnpayReturn = async (req, res) => {
    try {
        const vnp_ResponseCode = req.query.vnp_ResponseCode;
        const orderId = req.query.vnp_TxnRef;

        if (vnp_ResponseCode === '00') {
            const order = await Order.findByIdAndUpdate(orderId, { isPaid: true , status: 'Đã thanh toán'});

            if (order) {
                await clearUserCart(order.userId);
            }

            return res.json({ success: true, message: 'Thanh toán thành công' });
        } else {
            await Order.findByIdAndDelete(orderId);
            return res.json({ success: false, message: 'Thanh toán thất bại' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Có lỗi xảy ra');
    }
};



//Get Orders by User Id 

export const getUserOrders = async(req,res) =>{
    try {
        const userId = req.user.userId;
        const orders = await Order.find({
            userId,
            $or: [{paymentType : "COD"},{isPaid:true}]
        }).populate({
            path: "items.product",
            model: "product" 
        })
        .populate("address").sort({createdAt : -1})
        res.json({success:true,orders})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// Get All Orders 

export const getAllOrders = async(req,res) =>{
    try {
        const orders = await Order.find({
            $or: [{paymentType : "COD"},{isPaid:true}]
        }).populate({
            path: "items.product",
            model: "product" 
        })
        .populate("address").sort({createdAt : -1});
        res.json({success:true,orders})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;  
        const { status } = req.body; 

        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
        }

        res.json({ success: true, order: updatedOrder });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
