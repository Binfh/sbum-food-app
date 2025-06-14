// controllers/reviewController.js
import Review from "../models/Review.js";
import User from "../models/User.js";
import Product from '../models/Product.js'

// Thêm đánh giá mới
export const addReview = async (req, res) => {
    try {
        const { productId, comment } = req.body;
        const userId = req.user.userId;

        if (!productId || !comment) {
            return res.json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' });
        }

        // Lấy thông tin người dùng
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'Không tìm thấy người dùng' });
        }

        // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
        const existingReview = await Review.findOne({ userId, productId });
        if (existingReview) {
            // Cập nhật đánh giá hiện có
            existingReview.comment = comment;
            await existingReview.save();
            return res.json({ success: true, message: 'Cập nhật đánh giá thành công', review: existingReview });
        }

        // Tạo đánh giá mới
        const newReview = await Review.create({
            userId,
            productId,
            comment,
            userName: user.name
        });

        res.json({ success: true, message: 'Thêm đánh giá thành công', review: newReview });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Lấy tất cả đánh giá của một sản phẩm
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.json({ success: false, message: 'Thiếu ID sản phẩm' });
        }

        const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

        res.json({ success: true, reviews });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Xóa đánh giá
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.userId;

        if (!reviewId) {
            return res.json({ success: false, message: 'Thiếu ID đánh giá' });
        }

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.json({ success: false, message: 'Không tìm thấy đánh giá' });
        }

        // Kiểm tra xem người dùng có phải là người tạo đánh giá không
        if (review.userId.toString() !== userId) {
            return res.json({ success: false, message: 'Bạn không có quyền xóa đánh giá này' });
        }

        await Review.findByIdAndDelete(reviewId);

        res.json({ success: true, message: 'Xóa đánh giá thành công' });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Thêm hàm xóa đánh giá cho admin
export const adminDeleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        if (!reviewId) {
            return res.json({ success: false, message: 'Thiếu ID đánh giá' });
        }

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.json({ success: false, message: 'Không tìm thấy đánh giá' });
        }

        await Review.findByIdAndDelete(reviewId);

        res.json({ success: true, message: 'Xóa đánh giá thành công' });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Thêm hàm lấy tất cả đánh giá cho admin
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        
        // Sửa lại cách bổ sung thông tin sản phẩm để tránh lỗi
        const enrichedReviews = [];
        
        for (const review of reviews) {
            const reviewObj = review.toObject();
            try {
                const product = await Product.findById(review.productId);
                reviewObj.productName = product ? product.name : "Sản phẩm không tồn tại";
            } catch (error) {
                console.log(`Lỗi khi tìm sản phẩm cho review ${review._id}:`, error.message);
                reviewObj.productName = "Không thể tải thông tin sản phẩm";
            }
            enrichedReviews.push(reviewObj);
        }

        res.json({ success: true, reviews: enrichedReviews });
    } catch (error) {
        console.log("Lỗi khi tải tất cả đánh giá:", error.message);
        res.json({ success: false, message: error.message });
    }
};

export const adminReplyReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { reply } = req.body;

        if (!reviewId || !reply) {
            return res.json({ success: false, message: 'Thiếu thông tin cần thiết' });
        }

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.json({ success: false, message: 'Không tìm thấy đánh giá' });
        }

        
        review.adminReply = reply;
        review.adminRepliedAt = new Date();
        review.adminName = 'SBumShop';  

        await review.save();

        res.json({ success: true, message: 'Trả lời đánh giá thành công', review });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Cập nhật hàm xóa trả lời admin
export const adminDeleteReply = async (req, res) => {
    try {
        const { reviewId } = req.params;

        if (!reviewId) {
            return res.json({ success: false, message: 'Thiếu ID đánh giá' });
        }

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.json({ success: false, message: 'Không tìm thấy đánh giá' });
        }

        // Xóa trả lời của admin
        review.adminReply = null;
        review.adminRepliedAt = null;
        review.adminName = null;

        await review.save();

        res.json({ success: true, message: 'Xóa trả lời thành công' });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
